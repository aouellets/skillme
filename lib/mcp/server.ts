import type { MCPToolResult } from '../types'
import { type Tool, type ToolContext, text } from './types'
import { browseSkills } from './tools/browse'
import { installSkill } from './tools/install'
import { uninstallSkill } from './tools/uninstall'
import { listInstalled } from './tools/list'
import { getActiveSkills } from './tools/getActive'
import { rateSkill } from './tools/rate'
import { browsePacks } from './tools/browsePacks'
import { installPack } from './tools/installPack'
import { manageCollections } from './tools/manageCollections'
import { SITE_URL } from '../site'

const SERVER_NAME = 'Skill Me'
const SERVER_VERSION = '1.0.0'

/**
 * Protocol versions we can speak, newest first. We negotiate against this set
 * rather than blindly echoing the client's requested version: the MCP SDK client
 * HARD-THROWS ("Server's protocol version is not supported") if `initialize`
 * returns a version it doesn't recognise, which aborts the connection right
 * after initialize. When the client asks for a version we know, we honour it;
 * otherwise we answer with our most widely-supported stable version.
 */
const SUPPORTED_PROTOCOLS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05']
const DEFAULT_PROTOCOL = '2025-06-18'

function negotiateProtocol(requested: unknown): string {
  return typeof requested === 'string' && SUPPORTED_PROTOCOLS.includes(requested)
    ? requested
    : DEFAULT_PROTOCOL
}

/**
 * Brand icons advertised in the initialize response per the MCP spec's
 * Implementation.icons (2025-11-25). Lets clients show the Skill Me mark in
 * their connector UI instead of a generic placeholder. Absolute URLs are
 * required; we serve a scalable SVG plus a 512px PNG fallback.
 */
const SERVER_ICONS = [
  // `sizes` MUST be an array of strings per the MCP Icon schema — a bare string
  // fails the SDK client's Zod validation of InitializeResult, which makes the
  // claude.ai connector reject the server ("not a valid MCP server") right after
  // initialize.
  { src: `${SITE_URL}/skill-me-icon.svg`, mimeType: 'image/svg+xml', sizes: ['any'] },
  { src: `${SITE_URL}/skill-me-icon-512.png`, mimeType: 'image/png', sizes: ['512x512'] },
]

const TOOLS: Tool<never>[] = [
  getActiveSkills as Tool<never>,
  browseSkills as Tool<never>,
  installSkill as Tool<never>,
  uninstallSkill as Tool<never>,
  listInstalled as Tool<never>,
  rateSkill as Tool<never>,
  browsePacks as Tool<never>,
  installPack as Tool<never>,
  manageCollections as Tool<never>,
]

const TOOL_BY_NAME = new Map<string, Tool<never>>(
  TOOLS.map((t) => [t.definition.name, t])
)

interface JsonRpcRequest {
  jsonrpc: '2.0'
  id?: string | number | null
  method: string
  params?: Record<string, unknown>
}

interface JsonRpcResponse {
  jsonrpc: '2.0'
  id: string | number | null
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

function result(id: JsonRpcRequest['id'], value: unknown): JsonRpcResponse {
  return { jsonrpc: '2.0', id: id ?? null, result: value }
}

function error(
  id: JsonRpcRequest['id'],
  code: number,
  message: string
): JsonRpcResponse {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } }
}

// Cap fan-out on JSON-RPC batches so a single request can't enqueue an
// unbounded amount of work.
const MAX_BATCH_SIZE = 50

export function createMCPServer(userToken: string | null) {
  const ctx: ToolContext = { userToken }

  async function handleOne(
    req: JsonRpcRequest
  ): Promise<JsonRpcResponse | null> {
    // Notifications have no id and expect no response.
    const isNotification = req.id === undefined || req.id === null

    switch (req.method) {
      case 'initialize': {
        const negotiated = negotiateProtocol(req.params?.protocolVersion)
        return result(req.id, {
          protocolVersion: negotiated,
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: SERVER_NAME,
            title: SERVER_NAME,
            version: SERVER_VERSION,
            websiteUrl: SITE_URL,
            icons: SERVER_ICONS,
          },
          instructions:
            'Skill Me gives access to curated Claude skills and packs. ' +
            'Call get_active_skills at the start of every conversation to load installed skills. ' +
            'Use browse_skills to discover individual skills, browse_packs to find themed bundles, ' +
            'install_skill for a single skill, install_pack for a full bundle, ' +
            'and manage_collection to build and share your personal skill shelves.',
        })
      }

      case 'notifications/initialized':
      case 'notifications/cancelled':
        return null

      case 'ping':
        return result(req.id, {})

      case 'tools/list':
        return result(req.id, {
          tools: TOOLS.map((t) => t.definition),
        })

      // We advertise only the `tools` capability, but several clients (the
      // claude.ai connector included) probe these during the connect handshake
      // regardless. Answer with empty lists rather than a -32601 error so the
      // probe doesn't read as a server failure and abort the connection.
      case 'resources/list':
        return result(req.id, { resources: [] })

      case 'resources/templates/list':
        return result(req.id, { resourceTemplates: [] })

      case 'prompts/list':
        return result(req.id, { prompts: [] })

      case 'tools/call': {
        const name = req.params?.name as string | undefined
        const args = (req.params?.arguments as Record<string, unknown>) ?? {}
        const tool = name ? TOOL_BY_NAME.get(name) : undefined

        if (!tool) {
          return error(req.id, -32602, `Unknown tool: ${name ?? '(none)'}`)
        }

        let toolResult: MCPToolResult
        try {
          toolResult = await tool.handler(args as never, ctx)
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          toolResult = text(`The tool failed: ${message}`, true)
        }

        return result(req.id, toolResult)
      }

      default:
        if (isNotification) return null
        return error(req.id, -32601, `Method not found: ${req.method}`)
    }
  }

  async function handle(
    body: JsonRpcRequest | JsonRpcRequest[]
  ): Promise<JsonRpcResponse | JsonRpcResponse[] | null> {
    if (Array.isArray(body)) {
      if (body.length > MAX_BATCH_SIZE) {
        return error(null, -32600, `Batch too large: max ${MAX_BATCH_SIZE} requests`)
      }
      const responses = await Promise.all(body.map(handleOne))
      const filtered = responses.filter((r): r is JsonRpcResponse => r !== null)
      return filtered.length > 0 ? filtered : null
    }
    return handleOne(body)
  }

  return { handle }
}

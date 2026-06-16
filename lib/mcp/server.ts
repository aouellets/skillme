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

const SERVER_NAME = 'SkillShelf'
const SERVER_VERSION = '1.0.0'
const DEFAULT_PROTOCOL = '2025-11-25'

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

export function createMCPServer(userToken: string) {
  const ctx: ToolContext = { userToken }

  async function handleOne(
    req: JsonRpcRequest
  ): Promise<JsonRpcResponse | null> {
    // Notifications have no id and expect no response.
    const isNotification = req.id === undefined || req.id === null

    switch (req.method) {
      case 'initialize': {
        const requested = (req.params?.protocolVersion as string) ?? DEFAULT_PROTOCOL
        return result(req.id, {
          protocolVersion: requested,
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
          instructions:
            'SkillShelf gives access to curated Claude skills and packs. ' +
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
      const responses = await Promise.all(body.map(handleOne))
      const filtered = responses.filter((r): r is JsonRpcResponse => r !== null)
      return filtered.length > 0 ? filtered : null
    }
    return handleOne(body)
  }

  return { handle }
}

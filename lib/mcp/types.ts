import type { MCPToolResult } from '../types'

export interface ToolContext {
  /**
   * The caller's bearer identity, or null when no identifying header was
   * presented. Read-only catalog tools ignore it; user-scoped tools must
   * reject a null token (use `requireToken`).
   */
  userToken: string | null
}

/**
 * Guard for user-scoped tools: returns the token when present, or a ready-to-
 * return error result when the caller is unidentified. Keeps state-changing
 * tools from operating on a missing/anonymous identity.
 */
export function requireToken(
  ctx: ToolContext
): { token: string } | { error: MCPToolResult } {
  if (!ctx.userToken) {
    return {
      error: text(
        'This action needs an active Skill Me connection. Reconnect the Skill Me connector and try again.',
        true
      ),
    }
  }
  return { token: ctx.userToken }
}

/**
 * MCP tool annotations (spec 2025-11-25). Behaviour hints clients surface in
 * their UI; required by the Claude connector directory. Hints are advisory.
 */
export interface ToolAnnotations {
  title?: string
  readOnlyHint?: boolean
  destructiveHint?: boolean
  idempotentHint?: boolean
  openWorldHint?: boolean
}

export interface ToolDefinition {
  name: string
  description: string
  annotations?: ToolAnnotations
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export interface Tool<TArgs = Record<string, unknown>> {
  definition: ToolDefinition
  handler: (args: TArgs, ctx: ToolContext) => Promise<MCPToolResult>
}

export function text(value: string, isError = false): MCPToolResult {
  return { content: [{ type: 'text', text: value }], isError }
}

export function json(value: unknown, isError = false): MCPToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }], isError }
}

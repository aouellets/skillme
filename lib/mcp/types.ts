import type { MCPToolResult } from '../types'

export interface ToolContext {
  userToken: string
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

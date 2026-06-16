import type { MCPToolResult } from '../types'

export interface ToolContext {
  userToken: string
}

export interface ToolDefinition {
  name: string
  description: string
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

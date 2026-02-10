/**
 * OpenClaw integration types
 */

export interface OpenClawTool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  outputSchema?: ToolOutputSchema;
}

export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, PropertySchema>;
  required?: string[];
}

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
  enum?: string[];
  default?: unknown;
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
}

export interface ToolOutputSchema {
  type: 'object';
  properties: Record<string, PropertySchema>;
}

export interface ToolInvocationRequest {
  tool: string;
  parameters: Record<string, unknown>;
  context?: ToolContext;
}

export interface ToolContext {
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface ToolInvocationResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    executionTime: number;
    timestamp: number;
  };
}

export interface OpenClawPluginConfig {
  name: string;
  version: string;
  description: string;
  tools: OpenClawTool[];
  requiresAuth: boolean;
  apiEndpoint?: string;
}

export interface OpenClawMiddlewareContext {
  request: ToolInvocationRequest;
  startTime: number;
  authenticated: boolean;
}

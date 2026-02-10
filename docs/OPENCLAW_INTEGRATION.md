# OpenClaw Integration Guide

This guide explains how to integrate the Perplexity plugin with the OpenClaw framework.

## Overview

The Perplexity OpenClaw plugin provides seamless integration with the OpenClaw framework, allowing AI agents to use Perplexity's search, research, and chat capabilities.

## Installation

```bash
npm install perplexity-openclaw-plugin
```

## Basic Setup

### Programmatic Usage

```javascript
import { initializePlugin, invokeTool } from 'perplexity-openclaw-plugin';

// Initialize the plugin
const config = initializePlugin();
console.log(`Plugin: ${config.name} v${config.version}`);

// List available tools
const tools = config.tools;
console.log('Available tools:', tools.map(t => t.name));
```

### Invoke Tools

```javascript
import { invokeTool } from 'perplexity-openclaw-plugin';

// Perform a search
const searchResult = await invokeTool({
  tool: 'perplexity_search',
  parameters: {
    query: 'TypeScript best practices',
    mode: 'detailed',
    focus: 'internet'
  }
});

console.log(searchResult.data);
```

## Available Tools

### 1. perplexity_search

Perform web searches using Perplexity AI.

**Parameters:**
- `query` (required): Search query string
- `mode` (optional): 'concise' or 'detailed' (default: 'concise')
- `focus` (optional): 'internet', 'academic', 'writing', 'wolfram', 'youtube', 'reddit'
- `proSearch` (optional): Enable Pro search features (default: false)

**Example:**

```javascript
const result = await invokeTool({
  tool: 'perplexity_search',
  parameters: {
    query: 'What is machine learning?',
    mode: 'detailed',
    focus: 'academic'
  }
});
```

### 2. perplexity_research

Perform deep research on topics.

**Parameters:**
- `topic` (required): Research topic
- `deep` (optional): Enable deep research mode (default: false)
- `maxDepth` (optional): Maximum research depth (default: 3)

**Example:**

```javascript
const result = await invokeTool({
  tool: 'perplexity_research',
  parameters: {
    topic: 'Climate change impacts',
    deep: true,
    maxDepth: 5
  }
});
```

### 3. perplexity_chat

Send chat messages to Perplexity AI.

**Parameters:**
- `message` (required): Chat message
- `conversationId` (optional): Continue existing conversation
- `model` (optional): 'default', 'opus-4.5', 'gpt-5.2', 'gemini-3.0'
- `modelCouncil` (optional): Use Model Council (default: false)

**Example:**

```javascript
const result = await invokeTool({
  tool: 'perplexity_chat',
  parameters: {
    message: 'Explain quantum computing',
    model: 'opus-4.5'
  }
});
```

### 4. perplexity_extract_url

Extract content from URLs.

**Parameters:**
- `url` (required): URL to extract content from
- `depth` (optional): Extraction depth (default: 1)
- `includeLinks` (optional): Include links in extraction (default: false)

**Example:**

```javascript
const result = await invokeTool({
  tool: 'perplexity_extract_url',
  parameters: {
    url: 'https://example.com/article',
    depth: 2,
    includeLinks: true
  }
});
```

## HTTP Server Mode

Run the plugin as an HTTP server for OpenClaw integration:

```javascript
import { startHttpServer } from 'perplexity-openclaw-plugin';

// Start HTTP server
await startHttpServer(3000, 'localhost');
console.log('OpenClaw plugin server running on http://localhost:3000');
```

### API Endpoints

#### GET /health

Health check endpoint.

```bash
curl http://localhost:3000/health
```

#### GET /plugin

Get plugin information.

```bash
curl http://localhost:3000/plugin
```

#### GET /tools

List available tools.

```bash
curl http://localhost:3000/tools
```

#### POST /tools/invoke

Invoke a tool.

```bash
curl -X POST http://localhost:3000/tools/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "perplexity_search",
    "parameters": {
      "query": "AI trends 2024"
    }
  }'
```

## Configuration

### OpenClaw Configuration File

Create a configuration file for OpenClaw:

```json
{
  "name": "perplexity-openclaw-plugin",
  "version": "1.0.0",
  "description": "Perplexity AI integration",
  "tools": [
    {
      "name": "perplexity_search",
      "enabled": true
    },
    {
      "name": "perplexity_research",
      "enabled": true
    },
    {
      "name": "perplexity_chat",
      "enabled": true
    },
    {
      "name": "perplexity_extract_url",
      "enabled": true
    }
  ],
  "server": {
    "host": "localhost",
    "port": 3000,
    "apiEndpoint": "/tools/invoke"
  }
}
```

See [examples/openclaw-config.json](../examples/openclaw-config.json) for a complete example.

## Authentication

Before using the plugin, authenticate using one of the three methods:

```bash
# Method 1: Manual cookie export
perplexity-cli login --manual

# Method 2: Automated login
perplexity-cli login --auto

# Method 3: Profile reuse
perplexity-cli login --profile ~/.perplexity-mcp
```

See [Authentication Guide](./AUTHENTICATION.md) for details.

## Error Handling

The plugin returns structured error responses:

```javascript
{
  "success": false,
  "error": "Error message",
  "metadata": {
    "executionTime": 0,
    "timestamp": 1234567890
  }
}
```

## Best Practices

1. **Authentication**: Always authenticate before invoking tools
2. **Error Handling**: Implement proper error handling for all tool invocations
3. **Rate Limiting**: Be mindful of Perplexity's usage limits
4. **Session Management**: Refresh sessions periodically
5. **Logging**: Enable logging for debugging and monitoring

## Examples

See the [examples](../examples/) directory for complete integration examples.

## Troubleshooting

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues and solutions.

# Perplexity OpenClaw Plugin

A production-ready TypeScript project providing both a standalone CLI tool and OpenClaw framework integration for Perplexity AI, with browser automation fallback and multiple authentication methods.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## Features

### 🚀 Dual Interface
- **Standalone CLI Tool** - Use Perplexity from the command line
- **OpenClaw Plugin** - Seamlessly integrate with OpenClaw framework

### 🔐 Three Authentication Methods
1. **Manual Cookie Export** - Export cookies from browser manually
2. **Automated Login** - Login with email/password via Puppeteer
3. **Profile Reuse** - Reuse existing browser profiles

### 🔄 Fallback Architecture
- **Primary**: Direct HTTP API calls to Perplexity backend
- **Fallback**: Browser automation with Puppeteer
- **Automatic**: Transparent fallback on API failures

### ⭐ Perplexity Pro Support
- Deep Research mode
- Model Council (multi-model synthesis)
- Advanced models (Opus 4.5, GPT-5.2, Gemini 3.0)
- Higher usage limits

### 📦 Core Capabilities
- Web search with multiple focus modes
- Deep research on topics
- Interactive chat conversations
- URL content extraction
- Multiple output formats (JSON, table, text)

## Quick Start (5 Minutes)

### Installation

```bash
npm install -g perplexity-openclaw-plugin
```

Or for development:

```bash
git clone https://github.com/ETHNHUNT/perplexity-openclaw-plugin.git
cd perplexity-openclaw-plugin
npm install
npm run build
npm link
```

### Basic Usage

```bash
# Login (choose your preferred method)
perplexity-cli login

# Perform a search
perplexity-cli search "What is TypeScript?"

# Deep research
perplexity-cli research "Climate change impacts" --deep

# Chat
perplexity-cli chat "Explain quantum computing"

# Extract URL content
perplexity-cli extract-url "https://example.com/article"

# Check status
perplexity-cli status

# Logout
perplexity-cli logout
```

## CLI Commands

### Authentication Commands

```bash
# Manual login (export cookies from browser)
perplexity-cli login --manual

# Automated login (email/password)
perplexity-cli login --auto

# Profile-based login (reuse existing profile)
perplexity-cli login --profile ~/.perplexity-mcp

# Check authentication status
perplexity-cli status

# Logout
perplexity-cli logout
```

### Search & Research

```bash
# Basic search
perplexity-cli search "machine learning basics"

# Search with options
perplexity-cli search "AI trends 2024" --mode detailed --output json

# Focus modes: internet, academic, writing, wolfram, youtube, reddit
perplexity-cli search "neural networks" --focus academic

# Deep research (Pro)
perplexity-cli research "sustainable energy" --deep --output table

# Regular research
perplexity-cli research "history of computing" --max-depth 3
```

### Chat & Conversations

```bash
# Single message
perplexity-cli chat "What are the benefits of TypeScript?"

# Continue conversation
perplexity-cli chat "Can you give examples?" --conversation-id abc123

# Use specific model (Pro)
perplexity-cli chat "Explain quantum entanglement" --model opus-4.5

# Model Council (Pro)
perplexity-cli chat "Compare programming paradigms" --model-council
```

### URL Extraction

```bash
# Extract content from URL
perplexity-cli extract-url "https://example.com/article"

# Include links
perplexity-cli extract-url "https://example.com" --include-links

# Specify depth
perplexity-cli extract-url "https://example.com" --depth 2
```

## OpenClaw Integration

### Setup

```javascript
import { initializePlugin, invokeTool } from 'perplexity-openclaw-plugin';

// Initialize the plugin
const config = initializePlugin();
console.log(`Plugin: ${config.name} v${config.version}`);

// Invoke a tool
const response = await invokeTool({
  tool: 'perplexity_search',
  parameters: {
    query: 'TypeScript best practices',
    mode: 'detailed'
  }
});

console.log(response.data);
```

### HTTP Server Mode

```javascript
import { startHttpServer } from 'perplexity-openclaw-plugin';

// Start HTTP server for OpenClaw
await startHttpServer(3000, 'localhost');

// POST http://localhost:3000/tools/invoke
// {
//   "tool": "perplexity_search",
//   "parameters": { "query": "AI trends" }
// }
```

## Configuration

Create a `.env` file:

```bash
# Perplexity
PERPLEXITY_BASE_URL=https://www.perplexity.ai
PERPLEXITY_API_URL=https://www.perplexity.ai/api

# Authentication
AUTH_STORAGE_PATH=~/.perplexity/credentials.json
AUTH_ENCRYPTION_KEY=your-secret-key
SESSION_TIMEOUT=86400000
ENCRYPTION_ENABLED=true

# Browser
HEADLESS_BROWSER=true
BROWSER_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000

# Logging
LOG_LEVEL=info
LOG_PRETTY=true

# OpenClaw
OPENCLAW_PORT=3000
OPENCLAW_HOST=localhost

# Performance
HTTP_TIMEOUT=10000
MAX_RETRIES=3
RETRY_DELAY=1000

# Pro Features
ENABLE_PRO_FEATURES=false
```

## Documentation

- [CLI Usage Guide](./docs/CLI_USAGE.md) - Complete CLI reference
- [OpenClaw Integration](./docs/OPENCLAW_INTEGRATION.md) - Integration guide
- [Authentication Methods](./docs/AUTHENTICATION.md) - Detailed auth setup
- [Architecture](./docs/ARCHITECTURE.md) - System design
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues
- [Configuration](./docs/CONFIGURATION.md) - Environment variables
- [Contributing](./docs/CONTRIBUTING.md) - Development guidelines

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint and format
npm run lint
npm run lint:fix
npm run format
```

## Project Structure

```
perplexity-openclaw-plugin/
├── src/
│   ├── auth/              # Authentication system (3 methods)
│   ├── perplexity/        # Perplexity API & browser integration
│   ├── cli/               # CLI tool implementation
│   ├── openclaw-plugin/   # OpenClaw framework integration
│   ├── utils/             # Shared utilities
│   └── types/             # TypeScript type definitions
├── tests/                 # Test suites
├── docs/                  # Documentation
├── examples/              # Usage examples
└── .github/workflows/     # CI/CD pipelines
```

## Requirements

- Node.js 18 or higher
- TypeScript 5.3 or higher
- Active Perplexity account

## License

MIT License - see [LICENSE](./LICENSE) for details

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## Support

- **Issues**: [GitHub Issues](https://github.com/ETHNHUNT/perplexity-openclaw-plugin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ETHNHUNT/perplexity-openclaw-plugin/discussions)

## Acknowledgments

- Perplexity AI for their excellent search and research platform
- OpenClaw framework for the integration architecture
- The TypeScript and Node.js communities

---

Made with ❤️ by ETHNHUNT

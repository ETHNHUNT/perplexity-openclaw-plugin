# CLI Usage Guide

Complete reference for the Perplexity CLI tool.

## Installation

```bash
npm install -g perplexity-openclaw-plugin
```

## Authentication

### Manual Cookie Export

Export cookies from your browser and import them:

```bash
perplexity-cli login --manual
```

**Steps:**
1. Open https://www.perplexity.ai in your browser
2. Log in to your account
3. Open Developer Tools (F12)
4. Go to Application/Storage > Cookies
5. Export cookies as JSON
6. Run the command and provide the file path

### Automated Login

Login with email and password:

```bash
perplexity-cli login --auto
```

The CLI will prompt for your email and password and automatically handle the login process.

### Profile Reuse

Reuse an existing browser profile:

```bash
perplexity-cli login --profile ~/.perplexity-mcp
```

### Check Status

View your authentication status:

```bash
perplexity-cli status
```

### Logout

Clear credentials:

```bash
perplexity-cli logout
```

## Search Operations

### Basic Search

```bash
perplexity-cli search "What is TypeScript?"
```

### Search with Options

```bash
# Detailed mode
perplexity-cli search "AI trends 2024" --mode detailed

# JSON output
perplexity-cli search "machine learning" --output json

# Table output
perplexity-cli search "quantum computing" --output table

# Academic focus
perplexity-cli search "neural networks" --focus academic

# Available focus modes: internet, academic, writing, wolfram, youtube, reddit
```

### Pro Search

Requires Perplexity Pro account:

```bash
perplexity-cli search "complex topic" --pro
```

## Research Operations

### Basic Research

```bash
perplexity-cli research "Climate change impacts"
```

### Deep Research (Pro)

```bash
perplexity-cli research "Quantum computing applications" --deep
```

### Research with Options

```bash
# JSON output
perplexity-cli research "AI ethics" --output json

# Table output
perplexity-cli research "Blockchain technology" --output table

# Custom depth
perplexity-cli research "Space exploration" --max-depth 5
```

## Chat Operations

### Send a Message

```bash
perplexity-cli chat "Explain machine learning in simple terms"
```

### Continue Conversation

```bash
perplexity-cli chat "Can you give examples?" --conversation-id abc123
```

### Use Specific Model (Pro)

```bash
# Available models: default, opus-4.5, gpt-5.2, gemini-3.0
perplexity-cli chat "Explain quantum physics" --model opus-4.5
```

### Model Council (Pro)

Get responses from multiple models:

```bash
perplexity-cli chat "Compare programming paradigms" --model-council
```

## URL Extraction

### Extract Content from URL

```bash
perplexity-cli extract-url "https://example.com/article"
```

### Include Links

```bash
perplexity-cli extract-url "https://example.com" --include-links
```

### Specify Depth

```bash
perplexity-cli extract-url "https://example.com" --depth 2
```

## Output Formats

The CLI supports three output formats:

### JSON

```bash
perplexity-cli search "example" --output json
```

Returns structured JSON data.

### Table

```bash
perplexity-cli search "example" --output table
```

Returns formatted table output.

### Text (Default)

```bash
perplexity-cli search "example" --output text
```

Returns human-readable text output.

## Environment Variables

Configure the CLI with environment variables:

```bash
# Authentication
export AUTH_ENCRYPTION_KEY="your-secret-key"
export AUTH_STORAGE_PATH="~/.perplexity/credentials.json"

# Browser settings
export HEADLESS_BROWSER=true
export BROWSER_TIMEOUT=30000

# Logging
export LOG_LEVEL=info
export LOG_PRETTY=true
```

See [Configuration Guide](./CONFIGURATION.md) for complete list.

## Troubleshooting

### Authentication Issues

If login fails, try:

1. Clear existing credentials: `perplexity-cli logout`
2. Try manual cookie export method
3. Check if cookies are expired
4. Ensure Perplexity account is active

### Browser Automation Issues

If automated login fails:

1. Ensure Puppeteer dependencies are installed
2. Try running in non-headless mode: `HEADLESS_BROWSER=false`
3. Check network connectivity
4. Verify selectors are up-to-date

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more details.

## Examples

See the [examples](../examples/) directory for more usage examples.

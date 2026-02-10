# Configuration Guide

Complete reference for configuring the Perplexity OpenClaw plugin.

## Environment Variables

### Authentication

**AUTH_STORAGE_PATH**
- Description: Path to store credentials
- Default: `~/.perplexity/credentials.json`
- Example: `export AUTH_STORAGE_PATH="/custom/path/credentials.json"`

**AUTH_ENCRYPTION_KEY**
- Description: Encryption key for credentials
- Default: none (stores unencrypted with warning)
- Example: `export AUTH_ENCRYPTION_KEY="your-secret-key"`
- **Security**: Use a strong, unique key in production

**SESSION_TIMEOUT**
- Description: Session expiration time in milliseconds
- Default: `86400000` (24 hours)
- Example: `export SESSION_TIMEOUT=172800000` # 48 hours

**ENCRYPTION_ENABLED**
- Description: Enable/disable encryption
- Default: `true`
- Example: `export ENCRYPTION_ENABLED=true`

### Perplexity

**PERPLEXITY_BASE_URL**
- Description: Base URL for Perplexity
- Default: `https://www.perplexity.ai`
- Example: `export PERPLEXITY_BASE_URL="https://www.perplexity.ai"`

**PERPLEXITY_API_URL**
- Description: API URL for Perplexity
- Default: `https://www.perplexity.ai/api`
- Example: `export PERPLEXITY_API_URL="https://www.perplexity.ai/api"`

### Browser Automation

**HEADLESS_BROWSER**
- Description: Run browser in headless mode
- Default: `true`
- Example: `export HEADLESS_BROWSER=false` # for debugging

**BROWSER_TIMEOUT**
- Description: Browser operation timeout in milliseconds
- Default: `30000` (30 seconds)
- Example: `export BROWSER_TIMEOUT=60000`

**NAVIGATION_TIMEOUT**
- Description: Page navigation timeout in milliseconds
- Default: `30000` (30 seconds)
- Example: `export NAVIGATION_TIMEOUT=45000`

### Logging

**LOG_LEVEL**
- Description: Logging level
- Default: `info`
- Options: `debug`, `info`, `warn`, `error`
- Example: `export LOG_LEVEL=debug`

**LOG_PRETTY**
- Description: Pretty print logs
- Default: `true`
- Example: `export LOG_PRETTY=false`

### OpenClaw Integration

**OPENCLAW_PORT**
- Description: HTTP server port
- Default: `3000`
- Example: `export OPENCLAW_PORT=8080`

**OPENCLAW_HOST**
- Description: HTTP server host
- Default: `localhost`
- Example: `export OPENCLAW_HOST=0.0.0.0`

### Performance

**HTTP_TIMEOUT**
- Description: HTTP request timeout in milliseconds
- Default: `10000` (10 seconds)
- Example: `export HTTP_TIMEOUT=15000`

**MAX_RETRIES**
- Description: Maximum number of retries for failed requests
- Default: `3`
- Example: `export MAX_RETRIES=5`

**RETRY_DELAY**
- Description: Delay between retries in milliseconds
- Default: `1000` (1 second)
- Example: `export RETRY_DELAY=2000`

### Pro Features

**ENABLE_PRO_FEATURES**
- Description: Enable Perplexity Pro features
- Default: `false`
- Example: `export ENABLE_PRO_FEATURES=true`

## Configuration File

Create a `.env` file in your project root:

```bash
# Perplexity Configuration
PERPLEXITY_BASE_URL=https://www.perplexity.ai
PERPLEXITY_API_URL=https://www.perplexity.ai/api

# Authentication
AUTH_STORAGE_PATH=~/.perplexity/credentials.json
AUTH_ENCRYPTION_KEY=your-secret-key-here
SESSION_TIMEOUT=86400000
ENCRYPTION_ENABLED=true

# Browser Automation
HEADLESS_BROWSER=true
BROWSER_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000

# Logging
LOG_LEVEL=info
LOG_PRETTY=true

# OpenClaw Plugin
OPENCLAW_PORT=3000
OPENCLAW_HOST=localhost

# Performance
HTTP_TIMEOUT=10000
MAX_RETRIES=3
RETRY_DELAY=1000

# Pro Features
ENABLE_PRO_FEATURES=false
```

## OpenClaw Configuration

Create an `openclaw-config.json` file:

```json
{
  "name": "perplexity-openclaw-plugin",
  "version": "1.0.0",
  "description": "Perplexity AI integration for OpenClaw framework",
  "tools": [
    {
      "name": "perplexity_search",
      "description": "Perform web searches using Perplexity AI",
      "enabled": true,
      "config": {
        "defaultMode": "concise",
        "defaultFocus": "internet",
        "timeout": 30000
      }
    },
    {
      "name": "perplexity_research",
      "description": "Perform deep research on topics",
      "enabled": true,
      "config": {
        "defaultDepth": 3,
        "timeout": 60000
      }
    },
    {
      "name": "perplexity_chat",
      "description": "Interactive chat with Perplexity AI",
      "enabled": true,
      "config": {
        "defaultModel": "default",
        "timeout": 20000
      }
    },
    {
      "name": "perplexity_extract_url",
      "description": "Extract content from URLs",
      "enabled": true,
      "config": {
        "defaultDepth": 1,
        "timeout": 15000
      }
    }
  ],
  "authentication": {
    "method": "cookie",
    "storagePath": "~/.perplexity/credentials.json"
  },
  "server": {
    "host": "localhost",
    "port": 3000,
    "apiEndpoint": "/tools/invoke"
  },
  "logging": {
    "level": "info",
    "pretty": true
  }
}
```

## Programmatic Configuration

Configure the plugin programmatically:

```javascript
import { config } from 'perplexity-openclaw-plugin';

// Access configuration
console.log('Auth storage path:', config.authStoragePath);
console.log('Session timeout:', config.sessionTimeout);

// Validate configuration
import { validateConfig } from 'perplexity-openclaw-plugin';

const errors = validateConfig(config);
if (errors.length > 0) {
  console.error('Configuration errors:', errors);
}
```

## Best Practices

### Security

1. **Never commit secrets**: Don't commit `.env` files or credentials
2. **Use environment variables**: Store sensitive data in environment variables
3. **Rotate keys regularly**: Change encryption keys periodically
4. **Limit access**: Use appropriate file permissions (chmod 600)

### Performance

1. **Adjust timeouts**: Increase timeouts for slow connections
2. **Configure retries**: Set appropriate retry counts for your use case
3. **Monitor logs**: Enable debug logging for troubleshooting

### Production

1. **Enable encryption**: Always use AUTH_ENCRYPTION_KEY in production
2. **Headless mode**: Use HEADLESS_BROWSER=true in production
3. **Error handling**: Implement proper error handling
4. **Monitoring**: Enable logging and monitor for issues

## Validation

The plugin validates configuration on startup. Common validation errors:

- **Missing required values**: Ensure PERPLEXITY_BASE_URL is set
- **Invalid timeouts**: Timeouts must be positive numbers
- **Invalid paths**: Storage paths must be valid

## Troubleshooting

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for configuration-related issues.

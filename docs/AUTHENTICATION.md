# Authentication Guide

Complete guide to the three authentication methods supported by the Perplexity OpenClaw plugin.

## Overview

The plugin supports three authentication methods:

1. **Manual Cookie Export** - Export cookies from your browser
2. **Automated Login** - Login with email/password via Puppeteer
3. **Profile Reuse** - Reuse existing browser profiles

## Method 1: Manual Cookie Export

### Pros
- Works reliably across different environments
- No need for browser automation
- Full control over cookies
- Works with 2FA/CAPTCHA protected accounts

### Cons
- Manual process required
- Cookies expire and need to be re-exported
- Requires browser developer tools knowledge

### Setup Steps

1. **Login to Perplexity**
   - Open https://www.perplexity.ai in your browser
   - Log in to your account

2. **Open Developer Tools**
   - Press F12 or right-click and select "Inspect"
   - Go to the Application/Storage tab

3. **Export Cookies**
   - Navigate to Cookies > https://www.perplexity.ai
   - Copy all cookies or use a browser extension to export as JSON

4. **Save Cookie File**
   ```json
   [
     {
       "name": "session",
       "value": "your-session-value",
       "domain": ".perplexity.ai",
       "path": "/",
       "expires": 1234567890000,
       "httpOnly": true,
       "secure": true
     }
   ]
   ```

5. **Run Login Command**
   ```bash
   perplexity-cli login --manual
   ```

6. **Provide File Path**
   - Enter the path to your cookies.json file when prompted

### Cookie Format

The cookies file should be a JSON array with the following structure:

```typescript
interface Cookie {
  name: string;           // Cookie name
  value: string;          // Cookie value
  domain: string;         // Domain (e.g., ".perplexity.ai")
  path: string;           // Path (usually "/")
  expires?: number;       // Unix timestamp in milliseconds
  httpOnly?: boolean;     // HTTP only flag
  secure?: boolean;       // Secure flag
  sameSite?: 'Strict' | 'Lax' | 'None';
}
```

**Important:** The `expires` field should be in milliseconds. If your export tool uses seconds, the plugin will automatically normalize values < 1e12 by multiplying by 1000.

## Method 2: Automated Login

### Pros
- Fully automated
- No manual cookie export needed
- Works well for accounts without 2FA
- Stores cookies automatically

### Cons
- Requires Puppeteer and browser dependencies
- May fail with 2FA/CAPTCHA
- Slower than manual method
- Depends on page selectors (may break with UI changes)

### Setup Steps

1. **Run Login Command**
   ```bash
   perplexity-cli login --auto
   ```

2. **Enter Credentials**
   - Email: Enter your Perplexity email
   - Password: Enter your password (masked)

3. **Wait for Completion**
   - The CLI will launch a browser and automate the login
   - Cookies are automatically stored

### Configuration

You can configure browser behavior with environment variables:

```bash
# Run in visible mode (for debugging)
export HEADLESS_BROWSER=false

# Increase timeout for slow connections
export BROWSER_TIMEOUT=60000
export NAVIGATION_TIMEOUT=60000
```

### Troubleshooting Automated Login

If automated login fails:

1. **Run in Non-Headless Mode**
   ```bash
   HEADLESS_BROWSER=false perplexity-cli login --auto
   ```
   This lets you see what's happening in the browser.

2. **Check Selectors**
   - The plugin uses specific selectors to find login elements
   - If Perplexity changes their UI, selectors may need updates

3. **Handle 2FA/CAPTCHA**
   - If your account has 2FA, use manual cookie export instead
   - CAPTCHA detection is supported but not automated

## Method 3: Profile Reuse

### Pros
- Instant setup if you have an existing profile
- No re-authentication needed
- Preserves all browser settings
- Works with complex authentication

### Cons
- Requires existing browser profile
- Profile path must be accessible
- May have compatibility issues across systems

### Setup Steps

1. **Locate Your Profile**
   
   Common profile locations:
   - `~/.perplexity-mcp` (if you use perplexity-mcp-server)
   - `~/.config/perplexity`
   - `~/.perplexity`

2. **Run Login Command**
   ```bash
   perplexity-cli login --profile ~/.perplexity-mcp
   ```

3. **Automatic Discovery**
   ```bash
   perplexity-cli login --profile
   ```
   The CLI will search common locations and let you choose.

### Supported Profile Formats

The plugin can read cookies from:
- JSON cookie files (cookies.json)
- Browser cookie databases (Cookies)
- Profile directories with cookies

## Session Management

### Session Storage

Credentials are stored in:
```
~/.perplexity/credentials.json
```

You can change this location with:
```bash
export AUTH_STORAGE_PATH="/custom/path/credentials.json"
```

### Session Encryption

Sessions are encrypted by default. Set an encryption key:

```bash
export AUTH_ENCRYPTION_KEY="your-secret-key"
```

If no key is provided, data is stored unencrypted (with a warning).

### Session Expiration

Sessions expire after 24 hours by default. Configure with:

```bash
export SESSION_TIMEOUT=86400000  # 24 hours in milliseconds
```

### Check Session Status

```bash
perplexity-cli status
```

Output:
```
Authentication Status

✓ Authenticated

Session Information:
  User: user@example.com
  Expires: 2/11/2024, 8:00:00 PM
  Time Remaining: 23 hours
```

### Logout

Clear your session:

```bash
perplexity-cli logout
```

This deletes the credentials file.

## Security Best Practices

1. **Use Encryption**
   - Always set AUTH_ENCRYPTION_KEY in production
   - Use a strong, unique key

2. **Protect Credentials**
   - Don't commit credentials.json to version control
   - Use appropriate file permissions (chmod 600)

3. **Regular Rotation**
   - Re-authenticate periodically
   - Monitor session expiration

4. **Environment Variables**
   - Store sensitive config in environment variables
   - Use .env files (don't commit them)

5. **Audit Access**
   - Check session status regularly
   - Logout when done

## Comparison Matrix

| Feature | Manual | Automated | Profile |
|---------|--------|-----------|---------|
| Setup Time | Medium | Fast | Instant |
| Reliability | High | Medium | High |
| 2FA Support | Yes | No | Yes |
| CAPTCHA Support | Yes | Detection only | Yes |
| Browser Required | For export | Yes | No |
| Automation Friendly | No | Yes | Yes |
| Best For | Production | Development | Existing setups |

## Recommendation

- **Development**: Use automated login for quick testing
- **Production**: Use manual cookie export for reliability
- **Existing Systems**: Use profile reuse for seamless integration

## Troubleshooting

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for common authentication issues and solutions.

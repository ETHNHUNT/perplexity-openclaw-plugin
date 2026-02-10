# Troubleshooting Guide

Common issues and solutions for the Perplexity OpenClaw plugin.

## Authentication Issues

### Issue: Login fails with "Not authenticated"

**Symptoms:**
- Cannot login with any method
- "Not authenticated" error when running commands

**Solutions:**

1. Clear existing credentials:
   ```bash
   perplexity-cli logout
   ```

2. Try manual cookie export:
   ```bash
   perplexity-cli login --manual
   ```

3. Check if cookies are expired:
   ```bash
   perplexity-cli status
   ```

4. Verify Perplexity account is active by logging in via browser

### Issue: Cookies expire immediately

**Symptoms:**
- Login succeeds but session expires quickly
- Constant re-authentication needed

**Solutions:**

1. Check cookie format - expires should be in milliseconds
2. Ensure cookies include session tokens
3. Export all cookies from Perplexity domain
4. Try logging in with --auto method instead

### Issue: "Invalid cookie format" error

**Symptoms:**
- Error when loading cookie file
- JSON parse errors

**Solutions:**

1. Ensure cookie file is valid JSON:
   ```json
   [
     {
       "name": "session",
       "value": "...",
       "domain": ".perplexity.ai",
       "path": "/"
     }
   ]
   ```

2. Check required fields: name, value, domain, path
3. Validate JSON syntax with a JSON validator
4. Ensure file encoding is UTF-8

### Issue: Encryption/decryption errors

**Symptoms:**
- "Failed to decrypt" errors
- Cannot load stored credentials

**Solutions:**

1. Set encryption key:
   ```bash
   export AUTH_ENCRYPTION_KEY="your-key"
   ```

2. Use same key that was used to encrypt
3. Clear and re-login if key is lost:
   ```bash
   perplexity-cli logout
   perplexity-cli login
   ```

## Browser Automation Issues

### Issue: Puppeteer fails to launch

**Symptoms:**
- "Failed to launch browser" error
- Missing browser executable

**Solutions:**

1. Install Puppeteer dependencies:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install -y \
     chromium-browser \
     libx11-xcb1 \
     libxcomposite1 \
     libxcursor1 \
     libxdamage1 \
     libxi6 \
     libxtst6 \
     libnss3 \
     libcups2 \
     libxss1 \
     libxrandr2 \
     libasound2 \
     libpangocairo-1.0-0 \
     libatk1.0-0 \
     libatk-bridge2.0-0 \
     libgtk-3-0
   ```

2. Set Puppeteer to skip download:
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true npm install
   ```

3. Use system Chrome:
   ```bash
   export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
   ```

### Issue: Automated login hangs or times out

**Symptoms:**
- Login process never completes
- Browser opens but nothing happens

**Solutions:**

1. Run in non-headless mode to debug:
   ```bash
   HEADLESS_BROWSER=false perplexity-cli login --auto
   ```

2. Increase timeouts:
   ```bash
   export BROWSER_TIMEOUT=60000
   export NAVIGATION_TIMEOUT=60000
   ```

3. Check network connectivity
4. Verify selectors are still valid

### Issue: "Selector not found" errors

**Symptoms:**
- Browser opens but can't find elements
- "waitForSelector failed" errors

**Solutions:**

1. UI may have changed - try manual login instead
2. Check if selectors need updating
3. Report issue on GitHub with screenshots
4. Use --manual method as workaround

### Issue: CAPTCHA/2FA blocking automated login

**Symptoms:**
- Login stops at CAPTCHA page
- 2FA code required

**Solutions:**

1. Use manual cookie export method instead
2. Complete CAPTCHA/2FA manually in browser
3. Export cookies after manual login
4. Use profile reuse method if available

## Search and Research Issues

### Issue: "Search failed" or empty results

**Symptoms:**
- No search results returned
- Error messages from API

**Solutions:**

1. Check authentication status:
   ```bash
   perplexity-cli status
   ```

2. Verify query is not empty
3. Try with different output format:
   ```bash
   perplexity-cli search "query" --output json
   ```

4. Check network connectivity
5. Try browser fallback by running again

### Issue: API calls fail, no fallback

**Symptoms:**
- All searches fail immediately
- No browser automation attempted

**Solutions:**

1. API may be down - check Perplexity status
2. Network issues - verify connectivity
3. Authentication may be invalid - re-login
4. Check logs for specific error:
   ```bash
   LOG_LEVEL=debug perplexity-cli search "test"
   ```

### Issue: Slow research operations

**Symptoms:**
- Research takes very long
- Timeouts on deep research

**Solutions:**

1. Reduce max depth:
   ```bash
   perplexity-cli research "topic" --max-depth 2
   ```

2. Increase timeout:
   ```bash
   export HTTP_TIMEOUT=30000
   ```

3. Use concise mode instead of detailed
4. Check network speed

## OpenClaw Integration Issues

### Issue: HTTP server won't start

**Symptoms:**
- "Port already in use" error
- Server startup fails

**Solutions:**

1. Check if port is available:
   ```bash
   lsof -i :3000
   ```

2. Use different port:
   ```bash
   export OPENCLAW_PORT=8080
   ```

3. Kill existing process on port:
   ```bash
   kill -9 $(lsof -t -i:3000)
   ```

### Issue: Tool invocation fails

**Symptoms:**
- 400/500 errors from HTTP API
- Invalid parameters errors

**Solutions:**

1. Validate request format:
   ```json
   {
     "tool": "perplexity_search",
     "parameters": {
       "query": "test"
     }
   }
   ```

2. Check required parameters are provided
3. Verify authentication is set up
4. Check server logs for details

### Issue: "Not authenticated" in OpenClaw

**Symptoms:**
- Tools require authentication
- Session not found

**Solutions:**

1. Authenticate before starting server:
   ```bash
   perplexity-cli login
   ```

2. Check credentials exist:
   ```bash
   ls -la ~/.perplexity/credentials.json
   ```

3. Verify session is valid:
   ```bash
   perplexity-cli status
   ```

## Build and Installation Issues

### Issue: TypeScript compilation errors

**Symptoms:**
- `npm run build` fails
- Type errors

**Solutions:**

1. Ensure TypeScript is installed:
   ```bash
   npm install -D typescript
   ```

2. Clean and rebuild:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

3. Check Node.js version (requires >=18):
   ```bash
   node --version
   ```

### Issue: ESM import errors

**Symptoms:**
- "Cannot use import statement outside module"
- Module resolution errors

**Solutions:**

1. Ensure package.json has "type": "module"
2. Use .js extensions in imports
3. Check tsconfig.json moduleResolution is "NodeNext"

### Issue: Missing dependencies

**Symptoms:**
- Module not found errors
- Import errors

**Solutions:**

1. Install all dependencies:
   ```bash
   npm install
   ```

2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

## Performance Issues

### Issue: Slow operations

**Symptoms:**
- Commands take very long
- Timeouts

**Solutions:**

1. Check network speed
2. Increase timeouts
3. Use headless browser (faster)
4. Reduce retry attempts:
   ```bash
   export MAX_RETRIES=1
   ```

### Issue: High memory usage

**Symptoms:**
- Process uses lots of memory
- System becomes slow

**Solutions:**

1. Close browser after operations
2. Limit concurrent operations
3. Use API calls instead of browser when possible
4. Monitor with:
   ```bash
   ps aux | grep node
   ```

## Logging and Debugging

### Enable Debug Logging

```bash
export LOG_LEVEL=debug
export LOG_PRETTY=true
```

### Check Logs

Logs are written to console by default. For file logging:

```bash
perplexity-cli search "test" 2>&1 | tee debug.log
```

### Common Log Messages

- "Session expired" - Re-authenticate
- "Selector not found" - UI may have changed
- "Network error" - Check connectivity
- "Authentication failed" - Check credentials

## Getting Help

If you can't resolve an issue:

1. Check [GitHub Issues](https://github.com/ETHNHUNT/perplexity-openclaw-plugin/issues)
2. Enable debug logging and collect logs
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version)
   - Debug logs

## Known Issues

### Browser Selectors May Break

Perplexity may update their UI, breaking selectors. Use manual login as workaround.

### Rate Limiting

Perplexity may rate limit requests. Add delays between operations if needed.

### Pro Features

Some features require Perplexity Pro account. Check account status if features don't work.

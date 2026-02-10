# Perplexity OpenClaw Plugin

Perplexity model provider plugin for the [OpenClaw](https://github.com/openclaw/openclaw) gateway. It registers Perplexity's OpenAI-compatible chat/completions API as a provider so you can pick Perplexity models the same way you pick Anthropic or OpenAI in OpenClaw.

## Install

1) Add the plugin to the workspace where you run OpenClaw (e.g. `pnpm add perplexity-openclaw-plugin` or copy this repo into `~/.openclaw/extensions/perplexity-openclaw-plugin`).
2) Make sure OpenClaw can discover the extension:
   - If you copied the repo under `~/.openclaw/extensions`, it is auto-discovered, or
   - Add the extension entry to `plugins.loadPaths` in your config, pointing at `path/to/node_modules/perplexity-openclaw-plugin/index.ts`.

## Authenticate & configure models

Run:

```
openclaw models auth login --provider perplexity --set-default
```

The wizard will prompt for your Perplexity API key, base URL (defaults to `https://api.perplexity.ai`), and the model IDs you want to expose (default: `sonar-pro`). The plugin writes the provider config, registers the models, and wires them into your agent defaults so they show up like other providers.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-10

### Added
- Initial release of perplexity-openclaw-plugin
- Standalone CLI tool for Perplexity AI
- OpenClaw framework integration
- Three authentication methods:
  - Manual cookie export
  - Automated login with Puppeteer
  - Profile reuse from existing installations
- CLI commands:
  - `login` with --manual, --auto, --profile flags
  - `logout` to clear credentials
  - `status` to show authentication status
  - `search` for web searches
  - `research` for deep research
  - `chat` for conversations
  - `extract-url` for URL content extraction
- Dual API/Browser architecture with automatic fallback
- Perplexity Pro support (Deep Research, Model Council, etc.)
- Comprehensive error handling and logging
- Full TypeScript support with strict mode
- Complete test coverage
- Detailed documentation

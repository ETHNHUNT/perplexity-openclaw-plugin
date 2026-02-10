# Architecture

System design and architecture overview of the Perplexity OpenClaw plugin.

## Overview

The Perplexity OpenClaw plugin is designed as a dual-interface application:

1. **Standalone CLI Tool** - Command-line interface for direct usage
2. **OpenClaw Plugin** - Integration module for OpenClaw framework

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
├──────────────────────────┬──────────────────────────────────┤
│   CLI Commands           │   OpenClaw HTTP API              │
│   - login                │   - POST /tools/invoke           │
│   - search               │   - GET /tools                   │
│   - research             │   - GET /plugin                  │
│   - chat                 │   - GET /health                  │
│   - extract-url          │                                  │
└──────────────────────────┴──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                     Core Business Logic                      │
├─────────────────────────────────────────────────────────────┤
│  Search Engine (with fallback)                              │
│  ├─ API Client (primary)                                    │
│  └─ Browser Fallback (secondary)                            │
│                                                              │
│  Authentication System                                       │
│  ├─ Manual Cookie Manager                                   │
│  ├─ Automated Login                                         │
│  ├─ Profile Manager                                         │
│  └─ Session Manager                                         │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                   Infrastructure Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Utilities                                                   │
│  ├─ HTTP Client (with retry logic)                          │
│  ├─ Puppeteer Utils (browser automation)                    │
│  ├─ Logger (structured logging)                             │
│  ├─ Config (environment management)                         │
│  ├─ Error Handler (centralized errors)                      │
│  └─ Validators (input validation)                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. CLI Layer (`src/cli/`)

**Purpose**: User-facing command-line interface

**Components**:
- `index.ts` - Main CLI entry point, command routing
- `commands/` - Individual command implementations
  - `login.ts` - Authentication command
  - `search.ts` - Search command
  - `research.ts` - Research command
  - `chat.ts` - Chat command
  - `extract-url.ts` - URL extraction command
  - `logout.ts` - Logout command
  - `status.ts` - Status command
- `utils/` - CLI-specific utilities
  - `formatter.ts` - Output formatting (JSON/table/text)
  - `spinner.ts` - Loading indicators
  - `prompts.ts` - Interactive prompts

**Design Patterns**:
- Command pattern for CLI commands
- Strategy pattern for output formatting

### 2. OpenClaw Plugin Layer (`src/openclaw-plugin/`)

**Purpose**: Integration with OpenClaw framework

**Components**:
- `index.ts` - Plugin entry point and HTTP server
- `tools.ts` - Tool definitions and registry
- `handlers.ts` - Tool execution handlers
- `middleware.ts` - Request/response middleware
- `schema.ts` - Input/output schemas

**Design Patterns**:
- Factory pattern for tool creation
- Chain of responsibility for middleware
- Adapter pattern for OpenClaw integration

### 3. Authentication Layer (`src/auth/`)

**Purpose**: Multi-method authentication system

**Components**:
- `cookie-manager.ts` - Manual cookie handling
- `auto-login.ts` - Automated browser login
- `profile-manager.ts` - Browser profile reuse
- `session-manager.ts` - Session lifecycle management
- `storage.ts` - Encrypted credential storage
- `types.ts` - Authentication type definitions

**Authentication Flow**:
```
User Request
    │
    ├─→ Manual Cookie Export
    │   └─→ Load from JSON → Validate → Store
    │
    ├─→ Automated Login
    │   └─→ Browser Automation → Extract Cookies → Store
    │
    └─→ Profile Reuse
        └─→ Load from Profile → Extract Cookies → Store
                │
                ↓
          Session Manager
                │
                ├─→ Validate Session
                ├─→ Check Expiration
                └─→ Store Encrypted
```

**Design Patterns**:
- Strategy pattern for authentication methods
- Singleton pattern for session manager
- Template method for authentication flow

### 4. Perplexity Integration Layer (`src/perplexity/`)

**Purpose**: Core integration with Perplexity AI

**Components**:
- `search-engine.ts` - High-level search abstraction
- `api-client.ts` - Direct HTTP API calls
- `browser-fallback.ts` - Browser automation fallback
- `answer-extractor.ts` - Answer extraction logic
- `selector-detector.ts` - Dynamic selector detection
- `constants.ts` - API endpoints and selectors

**Dual Architecture**:
```
Search Request
    │
    ├─→ Try API Client
    │   ├─ Success → Return Result
    │   └─ Failure ↓
    │
    └─→ Browser Fallback
        ├─ Launch Browser
        ├─ Navigate to Perplexity
        ├─ Perform Search
        ├─ Extract Answer
        └─ Return Result
```

**Design Patterns**:
- Fallback pattern for API/browser switching
- Facade pattern for search engine
- Observer pattern for answer extraction

### 5. Utility Layer (`src/utils/`)

**Purpose**: Shared infrastructure utilities

**Components**:
- `config.ts` - Environment configuration
- `logger.ts` - Structured logging (Pino)
- `error-handler.ts` - Centralized error handling
- `http-client.ts` - HTTP client with retries
- `puppeteer-utils.ts` - Browser automation helpers
- `validators.ts` - Input validation

**Design Patterns**:
- Singleton pattern for logger and config
- Decorator pattern for HTTP retry logic
- Factory pattern for error creation

## Data Flow

### Search Operation Flow

```
1. User Input (CLI or API)
   ↓
2. Input Validation
   ↓
3. Authentication Check
   ↓
4. API Call Attempt
   ├─ Success → Extract Data → Format → Return
   └─ Failure ↓
5. Browser Fallback
   ├─ Launch Browser
   ├─ Set Cookies
   ├─ Navigate & Search
   ├─ Extract Answer
   └─ Return Result
   ↓
6. Format Output
   ↓
7. Return to User
```

### Authentication Flow

```
1. User Chooses Method
   ↓
2. Execute Authentication
   ├─ Manual: Load Cookie File
   ├─ Auto: Browser Automation
   └─ Profile: Load from Directory
   ↓
3. Validate Cookies
   ↓
4. Create Session
   ↓
5. Encrypt & Store
   ↓
6. Return Success
```

## Type System

The plugin uses TypeScript with strict mode enabled. Key type hierarchies:

### Core Types (`src/types/`)

```typescript
// Common types
interface User
interface Session
interface Cookie
interface Config

// Perplexity types
interface SearchOptions → SearchResult
interface ResearchOptions → ResearchResult
interface ChatOptions → ChatResult
interface ExtractUrlOptions → ExtractUrlResult

// OpenClaw types
interface OpenClawTool
interface ToolInvocationRequest → ToolInvocationResponse

// CLI types
interface *CommandOptions
```

## Error Handling Strategy

### Error Hierarchy

```
Error (base)
  │
  ├─ AppError (application errors)
  │  ├─ AuthenticationError (401)
  │  ├─ ValidationError (400)
  │  ├─ NotFoundError (404)
  │  ├─ NetworkError (503)
  │  └─ BrowserError (500)
  │
  └─ Native Errors (system errors)
```

### Error Flow

```
Operation
  │
  ├─ Try Operation
  │  └─ Error Thrown
  │     ↓
  ├─ Catch Error
  │  ├─ Log Error
  │  ├─ Convert to ErrorResponse
  │  └─ Return or Rethrow
  │
  └─ Retry Logic (if applicable)
```

## Security Architecture

### Authentication Security

1. **Encryption**: AES-256-GCM for credential storage
2. **Key Management**: Environment variable based
3. **Session Management**: Time-based expiration
4. **Cookie Handling**: Secure cookie storage

### Security Layers

```
┌─────────────────────────────────────┐
│   Input Validation Layer            │
│   (Prevent injection attacks)       │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│   Authentication Layer               │
│   (Verify user identity)            │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│   Encryption Layer                   │
│   (Protect stored data)             │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│   Communication Layer                │
│   (HTTPS, secure cookies)           │
└─────────────────────────────────────┘
```

## Scalability Considerations

### Performance Optimizations

1. **Connection Pooling**: HTTP client reuses connections
2. **Retry Logic**: Exponential backoff for failed requests
3. **Caching**: Session caching to avoid re-authentication
4. **Browser Reuse**: Minimize browser launches

### Extensibility Points

1. **New Authentication Methods**: Add to auth strategy
2. **New Commands**: Add to CLI commands directory
3. **New Tools**: Add to OpenClaw tools registry
4. **Custom Selectors**: Extend selector detector

## Testing Strategy

### Test Layers

```
┌─────────────────────────────────────┐
│   Unit Tests                         │
│   (Individual components)            │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│   Integration Tests                  │
│   (Component interaction)            │
└─────────────────────────────────────┘
           │
┌─────────────────────────────────────┐
│   End-to-End Tests                   │
│   (Full workflows)                   │
└─────────────────────────────────────┘
```

### Test Coverage Goals

- Unit Tests: >80% coverage
- Integration Tests: Critical paths
- E2E Tests: Main user workflows

## Deployment Architecture

### CLI Distribution

```
npm publish
    │
    └─→ npm registry
        │
        └─→ User Install
            ├─ npm install -g
            └─ Binary available: perplexity-cli
```

### OpenClaw Plugin

```
Import as Module
    │
    └─→ Application Code
        ├─ Initialize Plugin
        ├─ Start HTTP Server
        └─ Invoke Tools
```

## Configuration Management

### Configuration Layers

1. **Defaults**: Hard-coded in config.ts
2. **Environment Variables**: Override defaults
3. **Config Files**: .env file support
4. **Runtime**: Programmatic configuration

### Configuration Flow

```
Load Defaults
    ↓
Load .env File
    ↓
Load Environment Variables
    ↓
Validate Configuration
    ↓
Apply to Application
```

## Monitoring and Observability

### Logging Strategy

- **Structured Logging**: JSON format with Pino
- **Log Levels**: debug, info, warn, error
- **Context**: Enriched with request/user context
- **Performance**: Execution time tracking

### Metrics

- Authentication success/failure rate
- API vs Browser fallback usage
- Request latency
- Error rates by type

## Future Architecture Considerations

### Potential Enhancements

1. **Caching Layer**: Redis for result caching
2. **Queue System**: Bull/BullMQ for async operations
3. **Database**: Persistent session storage
4. **Microservices**: Separate auth/search services
5. **GraphQL API**: Alternative to REST
6. **WebSocket**: Real-time updates

### Scalability Path

```
Current (Single Process)
    ↓
Multi-Process (Cluster)
    ↓
Multi-Server (Load Balanced)
    ↓
Microservices (Distributed)
```

# Contributing Guide

Thank you for your interest in contributing to the Perplexity OpenClaw plugin!

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git
- TypeScript knowledge

### Setup Development Environment

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/perplexity-openclaw-plugin.git
   cd perplexity-openclaw-plugin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the Project**
   ```bash
   npm run build
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes

### 2. Make Changes

Follow the code style guidelines below.

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run specific test
npm test -- tests/auth/cookie-manager.test.ts

# Run with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### 4. Commit Your Changes

We use conventional commits:

```bash
git commit -m "feat: add new authentication method"
git commit -m "fix: resolve cookie expiration issue"
git commit -m "docs: update CLI usage guide"
git commit -m "test: add tests for search engine"
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style/formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/tooling

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style Guidelines

### TypeScript

1. **Use Strict Mode**
   - All code must compile with strict TypeScript settings
   - No `any` types (use `unknown` if needed)
   - Explicit return types for functions

2. **Naming Conventions**
   - `camelCase` for variables and functions
   - `PascalCase` for classes and types
   - `UPPER_SNAKE_CASE` for constants
   - Descriptive names (avoid abbreviations)

3. **File Organization**
   ```typescript
   // 1. Imports
   import { ... } from '...';
   
   // 2. Constants
   const CONSTANT_VALUE = ...;
   
   // 3. Types/Interfaces
   interface MyInterface { ... }
   
   // 4. Functions/Classes
   export function myFunction() { ... }
   
   // 5. Exports
   export { ... };
   ```

4. **ESM Imports**
   - Always use `.js` extension for relative imports
   - Use named imports when possible
   ```typescript
   import { function } from './module.js';  // ✓ Good
   import * as module from './module.js';   // ✗ Avoid
   ```

5. **Error Handling**
   - Use custom error classes
   - Always log errors
   - Provide context in error messages
   ```typescript
   throw new ValidationError('Invalid input', { field: 'email' });
   ```

### Code Quality

1. **Functions**
   - Single responsibility
   - Max 50 lines per function
   - Descriptive names
   - Document complex logic

2. **Comments**
   - JSDoc for public APIs
   - Inline comments for complex logic
   - Keep comments up-to-date

3. **Testing**
   - Write tests for new features
   - Maintain test coverage >80%
   - Use descriptive test names
   ```typescript
   describe('Cookie Manager', () => {
     it('should normalize cookie expiration from seconds to milliseconds', () => {
       // Test implementation
     });
   });
   ```

## Project Structure

```
perplexity-openclaw-plugin/
├── src/
│   ├── auth/              # Authentication system
│   ├── perplexity/        # Perplexity integration
│   ├── cli/               # CLI tool
│   ├── openclaw-plugin/   # OpenClaw plugin
│   ├── utils/             # Shared utilities
│   └── types/             # Type definitions
├── tests/                 # Test files
├── docs/                  # Documentation
├── examples/              # Usage examples
└── .github/workflows/     # CI/CD
```

## Adding New Features

### New CLI Command

1. Create command file in `src/cli/commands/`
2. Implement command function
3. Add to `src/cli/index.ts`
4. Add tests in `tests/cli/`
5. Update documentation

Example:
```typescript
// src/cli/commands/my-command.ts
export async function myCommand(options: MyCommandOptions): Promise<void> {
  // Implementation
}
```

### New Authentication Method

1. Create method in `src/auth/`
2. Implement authentication interface
3. Add to session manager
4. Add tests
5. Update documentation

### New OpenClaw Tool

1. Define schema in `src/openclaw-plugin/schema.ts`
2. Add tool definition in `src/openclaw-plugin/tools.ts`
3. Implement handler in `src/openclaw-plugin/handlers.ts`
4. Add tests
5. Update documentation

## Testing Guidelines

### Unit Tests

- Test individual functions/components
- Mock external dependencies
- Use descriptive test names

```typescript
describe('formatCookiesForHttp', () => {
  it('should format cookies as HTTP header string', () => {
    const cookies = [{ name: 'session', value: 'abc' }];
    const result = formatCookiesForHttp(cookies);
    expect(result).toBe('session=abc');
  });
});
```

### Integration Tests

- Test component interactions
- Use real dependencies where possible
- Test error handling

### End-to-End Tests

- Test complete workflows
- Test CLI commands
- Test API endpoints

## Documentation

### Update Documentation When:

1. Adding new features
2. Changing APIs
3. Fixing bugs
4. Updating configuration

### Documentation Files

- `README.md` - Project overview
- `docs/CLI_USAGE.md` - CLI reference
- `docs/OPENCLAW_INTEGRATION.md` - Integration guide
- `docs/AUTHENTICATION.md` - Auth guide
- `docs/ARCHITECTURE.md` - Architecture
- `docs/TROUBLESHOOTING.md` - Common issues
- `docs/CONFIGURATION.md` - Configuration reference

## Pull Request Guidelines

### Before Submitting

- [ ] Code builds successfully
- [ ] All tests pass
- [ ] Linting passes
- [ ] Code is formatted
- [ ] Documentation is updated
- [ ] Changelog is updated (for significant changes)

### PR Description

Include:
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots (for UI changes)
- Related issues

Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changelog updated
```

## Review Process

1. **Automated Checks**
   - CI runs tests
   - Lint checks
   - Build verification

2. **Code Review**
   - Maintainer reviews code
   - Feedback provided
   - Changes requested if needed

3. **Approval and Merge**
   - Approved by maintainer
   - Squash and merge to main

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Publish to npm (maintainers only)

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Security**: Email security@example.com

## Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Recognized in release notes
- Added to contributors list

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Perplexity OpenClaw plugin!

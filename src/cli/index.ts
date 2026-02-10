#!/usr/bin/env node
/**
 * Main CLI entry point
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { loginCommand } from './commands/login.js';
import { logoutCommand } from './commands/logout.js';
import { statusCommand } from './commands/status.js';
import { searchCommand } from './commands/search.js';
import { researchCommand } from './commands/research.js';
import { chatCommand } from './commands/chat.js';
import { extractUrlCommand } from './commands/extract-url.js';
import { logger } from '../utils/logger.js';

const program = new Command();

program
  .name('perplexity-cli')
  .description('Standalone CLI tool for Perplexity AI with OpenClaw integration')
  .version('1.0.0');

// Login command
program
  .command('login')
  .description('Login to Perplexity AI')
  .option('--manual', 'Login with manual cookie export')
  .option('--auto', 'Login with automated email/password')
  .option('--profile <path>', 'Login by reusing existing profile')
  .action(loginCommand);

// Logout command
program
  .command('logout')
  .description('Logout and clear credentials')
  .action(logoutCommand);

// Status command
program
  .command('status')
  .description('Show authentication and session status')
  .option('-o, --output <format>', 'Output format (json|text)', 'text')
  .action(statusCommand);

// Search command
program
  .command('search <query>')
  .description('Perform a web search')
  .option('-o, --output <format>', 'Output format (json|table|text)', 'text')
  .option('-m, --mode <mode>', 'Search mode (concise|detailed)', 'concise')
  .option('-f, --focus <focus>', 'Focus mode (internet|academic|writing|wolfram|youtube|reddit)')
  .option('--pro', 'Use Pro search features')
  .action(searchCommand);

// Research command
program
  .command('research <topic>')
  .description('Perform deep research on a topic')
  .option('-o, --output <format>', 'Output format (json|table|text)', 'text')
  .option('-d, --deep', 'Enable deep research mode (Pro)')
  .option('--max-depth <number>', 'Maximum research depth', '3')
  .action((topic, options) => {
    researchCommand(topic, {
      ...options,
      maxDepth: Number.parseInt(options.maxDepth, 10),
    });
  });

// Chat command
program
  .command('chat <message>')
  .description('Send a chat message')
  .option('-o, --output <format>', 'Output format (json|text)', 'text')
  .option('-c, --conversation-id <id>', 'Continue existing conversation')
  .option('-m, --model <model>', 'Model to use (default|opus-4.5|gpt-5.2|gemini-3.0)')
  .option('--model-council', 'Use Model Council (Pro)')
  .action(chatCommand);

// Extract URL command
program
  .command('extract-url <url>')
  .description('Extract content from a URL')
  .option('-o, --output <format>', 'Output format (json|text)', 'text')
  .option('-d, --depth <number>', 'Extraction depth', '1')
  .option('--include-links', 'Include links in extraction')
  .action((url, options) => {
    extractUrlCommand(url, {
      ...options,
      depth: Number.parseInt(options.depth, 10),
    });
  });

// Error handling
program.exitOverride((err) => {
  if (err.code === 'commander.helpDisplayed') {
    process.exit(0);
  }
  
  logger.error({ error: err }, 'CLI error');
  console.error(chalk.red(`Error: ${err.message}`));
  process.exit(1);
});

// Parse arguments
program.parse();

// Show help if no arguments
if (process.argv.length === 2) {
  program.help();
}

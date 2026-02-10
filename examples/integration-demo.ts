/**
 * Programmatic usage example for Perplexity OpenClaw Plugin
 */

import { initializePlugin, invokeTool, startHttpServer } from 'perplexity-openclaw-plugin';

/**
 * Example 1: Initialize Plugin
 */
async function initializePluginExample() {
  console.log('=== Example 1: Initialize Plugin ===');

  const config = initializePlugin();
  console.log(`Plugin Name: ${config.name}`);
  console.log(`Version: ${config.version}`);
  console.log(`Available Tools: ${config.tools.map((t) => t.name).join(', ')}`);
  console.log();
}

/**
 * Example 2: Search Operation
 */
async function searchExample() {
  console.log('=== Example 2: Search Operation ===');

  try {
    const result = await invokeTool({
      tool: 'perplexity_search',
      parameters: {
        query: 'What is TypeScript?',
        mode: 'detailed',
        focus: 'internet',
      },
    });

    if (result.success) {
      console.log('Search Result:', result.data);
      console.log(`Execution Time: ${result.metadata.executionTime}ms`);
    } else {
      console.error('Search failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  console.log();
}

/**
 * Example 3: Research Operation
 */
async function researchExample() {
  console.log('=== Example 3: Research Operation ===');

  try {
    const result = await invokeTool({
      tool: 'perplexity_research',
      parameters: {
        topic: 'Sustainable energy solutions',
        deep: false,
        maxDepth: 3,
      },
    });

    if (result.success) {
      console.log('Research Result:', result.data);
    } else {
      console.error('Research failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  console.log();
}

/**
 * Example 4: Chat Operation
 */
async function chatExample() {
  console.log('=== Example 4: Chat Operation ===');

  try {
    const result = await invokeTool({
      tool: 'perplexity_chat',
      parameters: {
        message: 'Explain quantum computing in simple terms',
        model: 'default',
      },
    });

    if (result.success) {
      console.log('Chat Response:', result.data);
    } else {
      console.error('Chat failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  console.log();
}

/**
 * Example 5: URL Extraction
 */
async function extractUrlExample() {
  console.log('=== Example 5: URL Extraction ===');

  try {
    const result = await invokeTool({
      tool: 'perplexity_extract_url',
      parameters: {
        url: 'https://example.com',
        depth: 1,
        includeLinks: true,
      },
    });

    if (result.success) {
      console.log('Extracted Content:', result.data);
    } else {
      console.error('Extraction failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  console.log();
}

/**
 * Example 6: HTTP Server Mode
 */
async function httpServerExample() {
  console.log('=== Example 6: HTTP Server Mode ===');

  try {
    const server = await startHttpServer(3000, 'localhost');
    console.log('OpenClaw plugin server running on http://localhost:3000');
    console.log('Available endpoints:');
    console.log('  GET  /health - Health check');
    console.log('  GET  /plugin - Plugin information');
    console.log('  GET  /tools - List available tools');
    console.log('  POST /tools/invoke - Invoke a tool');

    // Example API call (using fetch or axios)
    console.log('\nExample API call:');
    console.log(`
    fetch('http://localhost:3000/tools/invoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: 'perplexity_search',
        parameters: { query: 'AI trends 2024' }
      })
    })
    `);

    // Keep server running for demo
    // server.close() to stop
  } catch (error) {
    console.error('Error starting server:', error);
  }
  console.log();
}

/**
 * Example 7: Error Handling
 */
async function errorHandlingExample() {
  console.log('=== Example 7: Error Handling ===');

  try {
    const result = await invokeTool({
      tool: 'perplexity_search',
      parameters: {
        query: '', // Invalid: empty query
      },
    });

    if (!result.success) {
      console.log('Expected error:', result.error);
      console.log('Error metadata:', result.metadata);
    }
  } catch (error) {
    console.error('Caught error:', error);
  }
  console.log();
}

/**
 * Example 8: Batch Operations
 */
async function batchOperationsExample() {
  console.log('=== Example 8: Batch Operations ===');

  const queries = [
    'What is machine learning?',
    'What is TypeScript?',
    'What is quantum computing?',
  ];

  try {
    const results = await Promise.all(
      queries.map((query) =>
        invokeTool({
          tool: 'perplexity_search',
          parameters: { query, mode: 'concise' },
        }),
      ),
    );

    results.forEach((result, index) => {
      if (result.success) {
        console.log(`Query ${index + 1}: ${queries[index]}`);
        console.log(`Answer: ${result.data.answer?.substring(0, 100)}...`);
        console.log();
      }
    });
  } catch (error) {
    console.error('Batch operation error:', error);
  }
  console.log();
}

/**
 * Run all examples
 */
async function main() {
  console.log('Perplexity OpenClaw Plugin - Integration Examples\n');
  console.log('='.repeat(50));
  console.log();

  // Run examples sequentially
  await initializePluginExample();

  // Note: The following examples require authentication
  // Run: perplexity-cli login before executing

  // await searchExample();
  // await researchExample();
  // await chatExample();
  // await extractUrlExample();
  // await errorHandlingExample();
  // await batchOperationsExample();

  // Uncomment to start HTTP server
  // await httpServerExample();

  console.log('='.repeat(50));
  console.log('\nExamples completed!');
  console.log('\nNote: Authentication required for most operations.');
  console.log('Run: perplexity-cli login');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  initializePluginExample,
  searchExample,
  researchExample,
  chatExample,
  extractUrlExample,
  httpServerExample,
  errorHandlingExample,
  batchOperationsExample,
};

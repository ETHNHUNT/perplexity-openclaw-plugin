# Real-World Usage Scenarios

This document provides real-world scenarios and use cases for the Perplexity OpenClaw plugin.

## Scenario 1: Research Assistant for Content Creation

**Use Case**: A content creator wants to research a topic before writing an article.

```bash
# Step 1: Deep research on the topic
perplexity-cli research "Impact of AI on healthcare" --deep --output json > research.json

# Step 2: Extract specific aspects
perplexity-cli search "AI in medical diagnosis" --focus academic --output table

# Step 3: Get recent developments
perplexity-cli search "latest AI healthcare breakthroughs 2024" --mode detailed
```

**Programmatic Usage**:

```javascript
import { invokeTool } from 'perplexity-openclaw-plugin';

async function researchTopic(topic) {
  // Deep research
  const research = await invokeTool({
    tool: 'perplexity_research',
    parameters: { topic, deep: true, maxDepth: 5 }
  });
  
  // Get specific insights
  const insights = await invokeTool({
    tool: 'perplexity_search',
    parameters: {
      query: `${topic} latest developments`,
      focus: 'academic'
    }
  });
  
  return {
    mainResearch: research.data,
    insights: insights.data
  };
}
```

## Scenario 2: Technical Documentation Analyzer

**Use Case**: Analyze and summarize technical documentation from multiple URLs.

```bash
# Extract content from documentation pages
perplexity-cli extract-url "https://docs.example.com/api" --depth 2 --include-links > api-docs.json

# Summarize the documentation
perplexity-cli chat "Summarize the key points from the API documentation" --output text
```

**Programmatic Usage**:

```javascript
async function analyzeDocs(urls) {
  const extractions = await Promise.all(
    urls.map(url => invokeTool({
      tool: 'perplexity_extract_url',
      parameters: { url, depth: 2, includeLinks: true }
    }))
  );
  
  // Combine and summarize
  const summary = await invokeTool({
    tool: 'perplexity_chat',
    parameters: {
      message: `Summarize these documentation pages: ${JSON.stringify(extractions)}`
    }
  });
  
  return summary.data;
}
```

## Scenario 3: Academic Research Pipeline

**Use Case**: A researcher needs to gather information from multiple sources.

```bash
# Phase 1: Literature review
perplexity-cli search "quantum entanglement recent papers" --focus academic --output json

# Phase 2: Deep dive into specific topics
perplexity-cli research "quantum entanglement applications" --deep --max-depth 5

# Phase 3: Get expert perspectives
perplexity-cli chat "What are the current challenges in quantum entanglement research?" --model opus-4.5
```

## Scenario 4: Competitive Intelligence

**Use Case**: Monitor and analyze competitor information.

```bash
# Extract competitor website content
perplexity-cli extract-url "https://competitor.com" --depth 3 --include-links

# Research market trends
perplexity-cli research "SaaS market trends 2024" --output json

# Get industry insights
perplexity-cli search "enterprise software adoption rates" --focus internet
```

## Scenario 5: Educational Q&A Bot

**Use Case**: Build an educational chatbot using OpenClaw integration.

```javascript
import { startHttpServer } from 'perplexity-openclaw-plugin';

// Start server
await startHttpServer(3000);

// Example client code
async function askEducationalQuestion(question, studentId) {
  const response = await fetch('http://localhost:3000/tools/invoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: 'perplexity_chat',
      parameters: {
        message: question,
        mode: 'detailed',
        focus: 'academic'
      }
    })
  });
  
  const result = await response.json();
  
  // Log for analytics
  console.log(`Student ${studentId} asked: ${question}`);
  
  return result.data;
}
```

## Scenario 6: News Aggregation and Summarization

**Use Case**: Aggregate news from multiple sources and create summaries.

```bash
# Get latest news on a topic
perplexity-cli search "AI regulation news 2024" --mode detailed --output json > news.json

# Analyze specific articles
perplexity-cli extract-url "https://news-site.com/article" --depth 1

# Generate summary
perplexity-cli chat "Provide a summary of AI regulation changes in 2024"
```

## Scenario 7: Code Documentation Generator

**Use Case**: Generate documentation for code repositories.

```javascript
async function generateCodeDocs(repoUrl) {
  // Extract README and code structure
  const repoContent = await invokeTool({
    tool: 'perplexity_extract_url',
    parameters: { url: repoUrl, depth: 2 }
  });
  
  // Generate documentation
  const docs = await invokeTool({
    tool: 'perplexity_chat',
    parameters: {
      message: `Generate comprehensive documentation for this code repository: ${repoContent.data}`
    }
  });
  
  return docs.data;
}
```

## Scenario 8: Market Research Automation

**Use Case**: Automate market research for business decisions.

```bash
# Market size research
perplexity-cli research "global SaaS market size 2024" --output json

# Competitor analysis
perplexity-cli search "top SaaS companies revenue comparison" --focus internet

# Trend analysis
perplexity-cli search "SaaS industry trends predictions 2025" --mode detailed
```

## Scenario 9: Personal Knowledge Base

**Use Case**: Build a personal knowledge base with research capabilities.

```javascript
class PersonalKnowledgeBase {
  async addTopic(topic) {
    const research = await invokeTool({
      tool: 'perplexity_research',
      parameters: { topic, maxDepth: 3 }
    });
    
    // Store in database
    await this.db.store(topic, research.data);
    return research.data;
  }
  
  async queryKnowledge(question) {
    const result = await invokeTool({
      tool: 'perplexity_search',
      parameters: { query: question, mode: 'detailed' }
    });
    
    return result.data;
  }
}
```

## Scenario 10: Automated Report Generation

**Use Case**: Generate weekly reports on specific topics.

```javascript
async function generateWeeklyReport(topics) {
  const report = {
    date: new Date().toISOString(),
    topics: []
  };
  
  for (const topic of topics) {
    const research = await invokeTool({
      tool: 'perplexity_research',
      parameters: { topic, deep: true }
    });
    
    const summary = await invokeTool({
      tool: 'perplexity_chat',
      parameters: {
        message: `Summarize the key findings about ${topic}`
      }
    });
    
    report.topics.push({
      topic,
      research: research.data,
      summary: summary.data
    });
  }
  
  return report;
}

// Usage
const report = await generateWeeklyReport([
  'AI trends in healthcare',
  'Blockchain adoption rates',
  'Climate tech innovations'
]);

console.log(JSON.stringify(report, null, 2));
```

## Best Practices for Real-World Usage

### 1. Error Handling

Always implement proper error handling:

```javascript
try {
  const result = await invokeTool({ tool: 'perplexity_search', parameters });
  if (!result.success) {
    console.error('Operation failed:', result.error);
    // Implement fallback or retry logic
  }
} catch (error) {
  console.error('Unexpected error:', error);
  // Log to monitoring service
}
```

### 2. Rate Limiting

Implement rate limiting for batch operations:

```javascript
async function batchSearch(queries, delayMs = 1000) {
  const results = [];
  for (const query of queries) {
    const result = await invokeTool({
      tool: 'perplexity_search',
      parameters: { query }
    });
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return results;
}
```

### 3. Caching

Implement caching for frequently accessed data:

```javascript
const cache = new Map();

async function cachedSearch(query, ttl = 3600000) {
  const cacheKey = `search:${query}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const result = await invokeTool({
    tool: 'perplexity_search',
    parameters: { query }
  });
  
  cache.set(cacheKey, {
    data: result.data,
    timestamp: Date.now()
  });
  
  return result.data;
}
```

### 4. Monitoring

Log operations for monitoring:

```javascript
async function monitoredInvoke(tool, parameters) {
  const startTime = Date.now();
  
  try {
    const result = await invokeTool({ tool, parameters });
    const duration = Date.now() - startTime;
    
    // Log to monitoring service
    logger.info({
      tool,
      success: result.success,
      duration,
      timestamp: new Date()
    });
    
    return result;
  } catch (error) {
    logger.error({
      tool,
      error: error.message,
      duration: Date.now() - startTime
    });
    throw error;
  }
}
```

## Performance Tips

1. Use **concise mode** for quick answers
2. Use **JSON output** for programmatic processing
3. Implement **caching** for repeated queries
4. Use **batch operations** with delays
5. Monitor **API usage** to avoid rate limits
6. Use **Pro features** for complex research

## Security Considerations

1. Never commit `.env` files with credentials
2. Use environment variables for sensitive data
3. Implement proper access controls for OpenClaw server
4. Validate all user inputs
5. Log security events
6. Rotate encryption keys regularly

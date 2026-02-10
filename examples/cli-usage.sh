#!/bin/bash
# CLI Usage Examples for Perplexity OpenClaw Plugin

echo "=== Perplexity CLI Usage Examples ==="
echo

# Authentication Examples
echo "1. Authentication Examples"
echo "=========================="
echo

echo "Manual login (export cookies from browser):"
echo "$ perplexity-cli login --manual"
echo

echo "Automated login (email/password):"
echo "$ perplexity-cli login --auto"
echo

echo "Profile-based login (reuse existing profile):"
echo "$ perplexity-cli login --profile ~/.perplexity-mcp"
echo

echo "Check authentication status:"
echo "$ perplexity-cli status"
echo

# Search Examples
echo "2. Search Examples"
echo "=================="
echo

echo "Basic search:"
echo "$ perplexity-cli search 'What is TypeScript?'"
echo

echo "Detailed search with JSON output:"
echo "$ perplexity-cli search 'machine learning basics' --mode detailed --output json"
echo

echo "Academic-focused search:"
echo "$ perplexity-cli search 'neural networks' --focus academic --output table"
echo

echo "Pro search (requires Perplexity Pro):"
echo "$ perplexity-cli search 'complex quantum physics topic' --pro"
echo

# Research Examples
echo "3. Research Examples"
echo "===================="
echo

echo "Basic research:"
echo "$ perplexity-cli research 'Climate change impacts'"
echo

echo "Deep research (Pro):"
echo "$ perplexity-cli research 'Sustainable energy solutions' --deep --output json"
echo

echo "Research with custom depth:"
echo "$ perplexity-cli research 'History of computing' --max-depth 5 --output table"
echo

# Chat Examples
echo "4. Chat Examples"
echo "================"
echo

echo "Single message:"
echo "$ perplexity-cli chat 'Explain quantum computing in simple terms'"
echo

echo "Continue conversation:"
echo "$ perplexity-cli chat 'Can you give me examples?' --conversation-id abc123"
echo

echo "Use specific model (Pro):"
echo "$ perplexity-cli chat 'Compare programming paradigms' --model opus-4.5"
echo

echo "Model Council (Pro - multiple models):"
echo "$ perplexity-cli chat 'What are the implications of AGI?' --model-council"
echo

# URL Extraction Examples
echo "5. URL Extraction Examples"
echo "=========================="
echo

echo "Extract content from URL:"
echo "$ perplexity-cli extract-url 'https://example.com/article'"
echo

echo "Extract with links included:"
echo "$ perplexity-cli extract-url 'https://example.com' --include-links"
echo

echo "Extract with custom depth:"
echo "$ perplexity-cli extract-url 'https://example.com' --depth 2 --output json"
echo

# Output Format Examples
echo "6. Output Format Examples"
echo "========================="
echo

echo "JSON output (for programmatic use):"
echo "$ perplexity-cli search 'AI trends' --output json"
echo

echo "Table output (readable format):"
echo "$ perplexity-cli search 'blockchain technology' --output table"
echo

echo "Text output (default, human-readable):"
echo "$ perplexity-cli search 'web3 explained' --output text"
echo

# Advanced Examples
echo "7. Advanced Examples"
echo "===================="
echo

echo "Search with all options:"
echo "$ perplexity-cli search 'TypeScript vs JavaScript' \\"
echo "  --mode detailed \\"
echo "  --focus internet \\"
echo "  --output json \\"
echo "  --pro"
echo

echo "Research pipeline (save to file):"
echo "$ perplexity-cli research 'AI ethics' --deep --output json > research-output.json"
echo

echo "Check status and logout:"
echo "$ perplexity-cli status"
echo "$ perplexity-cli logout"
echo

echo "=== End of Examples ==="

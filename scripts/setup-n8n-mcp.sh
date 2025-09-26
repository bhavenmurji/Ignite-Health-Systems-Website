#!/bin/bash

# n8n MCP Setup Script for Claude Desktop

echo "Setting up n8n MCP for Claude Desktop..."

# Set environment variables
export N8N_API_URL="https://bhavenmurji.app.n8n.cloud"
export N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NjUzYzczZi1lMTU4LTQwOTYtOGYzNy1kMjk5MDg5ZWI0NmMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU4ODQ2OTA2LCJleHAiOjE3NjEzNjQ4MDB9.WajdO8mMiCnjYUz1qSFBZ2_ixwW6HDZhV7eBAJPkbi8="

echo "Environment variables set:"
echo "N8N_API_URL=$N8N_API_URL"
echo "N8N_API_KEY=***configured***"

# Test the connection
echo ""
echo "Testing n8n API connection..."
curl -X GET "$N8N_API_URL/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Accept: application/json" \
  --silent --show-error | head -c 100

echo ""
echo ""
echo "To use n8n MCP in Claude Desktop, you need to:"
echo "1. Restart Claude Desktop completely"
echo "2. The MCP server should pick up these environment variables"
echo ""
echo "If it still doesn't work, update your Claude Desktop config to include:"
echo '
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["@czlonkowski/n8n-mcp"],
      "env": {
        "N8N_API_URL": "https://bhavenmurji.app.n8n.cloud",
        "N8N_API_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NjUzYzczZi1lMTU4LTQwOTYtOGYzNy1kMjk5MDg5ZWI0NmMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU4ODQ2OTA2LCJleHAiOjE3NjEzNjQ4MDB9.WajdO8mMiCnjYUz1qSFBZ2_ixwW6HDZhV7eBAJPkbi8="
      }
    }
  }
}
'
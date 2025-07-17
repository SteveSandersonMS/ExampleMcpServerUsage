#!/bin/bash
# Simple shell script to test MCP server communication

echo "Testing MCP Server Communication"
echo "================================"

# Create a simple initialize request
echo "Sending initialize request to MCP server..."

# Create the request JSON
cat > /tmp/init_request.json << 'EOF'
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "hello-example", "version": "1.0.0"}}}
EOF

echo "Request:"
cat /tmp/init_request.json
echo ""

echo "Response:"
cat /tmp/init_request.json | ExampleMcpServer

echo ""
echo "Test completed."
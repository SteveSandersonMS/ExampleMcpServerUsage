# Hello MCP Server Example

This repository demonstrates basic usage of the ExampleMcpServer using the Model Context Protocol (MCP). It provides a simple "Hello" example showing how to establish communication with an MCP server.

## What is MCP?

The Model Context Protocol (MCP) is a protocol for communication between AI assistants and external tools/servers. This example shows how to interact with an MCP server using basic initialization requests.

## Prerequisites

- .NET 9.0.x
- Node.js (for the JavaScript example)
- Python 3 (for the Python example)

## Setup

The MCP server is automatically installed via the GitHub workflow, but you can install it manually:

```bash
dotnet tool install -g ExampleMcpServer --prerelease
```

## Examples

### Node.js Example (Recommended)

Run the Node.js hello example:

```bash
node hello_example.js
```

Or use npm:

```bash
npm run hello
```

### Python Example

Run the Python hello example:

```bash
python3 hello_example.py
```

### Shell Script Example

Run the basic shell test:

```bash
./test_mcp.sh
```

## What the Examples Demonstrate

- 🚀 **MCP Server Initialization**: Shows how to send an `initialize` request to establish communication
- 👋 **Hello Functionality**: Demonstrates a basic greeting/hello interaction
- 📋 **Server Logs**: Displays server startup and communication logs
- ✅ **Success Validation**: Confirms successful MCP protocol communication

## Example Output

When you run the examples, you'll see:
- The initialize request being sent to the MCP server
- Server startup and processing logs
- Confirmation of successful communication
- A friendly "Hello" message

This provides a foundation for building more complex MCP integrations!

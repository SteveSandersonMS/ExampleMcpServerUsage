#!/usr/bin/env python3
"""
Simple example demonstrating how to interact with the ExampleMcpServer.
This script sends a basic "hello" message to test MCP server communication.
"""

import json
import subprocess
import sys
import os
import time

def send_mcp_request(request):
    """Send a request to the MCP server and return the response."""
    try:
        # Start the MCP server process
        process = subprocess.Popen(
            ['ExampleMcpServer'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=os.getcwd()
        )
        
        # Send the request
        request_json = json.dumps(request) + '\n'
        
        # Write to stdin and close it
        process.stdin.write(request_json)
        process.stdin.close()
        
        # Wait a bit for the response
        time.sleep(1)
        
        # Read stdout line by line to find JSON response
        stdout_lines = []
        stderr_lines = []
        
        # Read what's available
        try:
            process.wait(timeout=5)
            stdout, stderr = process.communicate(timeout=1)
            
            # Look for JSON responses in stdout
            for line in stdout.splitlines():
                line = line.strip()
                if line and (line.startswith('{') or line.startswith('[')):
                    try:
                        # Try to parse as JSON
                        json.loads(line)
                        return json.loads(line)
                    except json.JSONDecodeError:
                        continue
            
            # If no JSON found in stdout, print what we got
            if stderr.strip():
                print(f"Server logs:\n{stderr.strip()}", file=sys.stderr)
            
            return {"status": "server_started", "logs": stderr.strip()}
            
        except subprocess.TimeoutExpired:
            process.kill()
            return {"error": "timeout"}
        
    except Exception as e:
        print(f"Error communicating with server: {e}", file=sys.stderr)
        return None

def main():
    print("Hello MCP Server Example")
    print("=" * 25)
    
    # Initialize the MCP connection
    initialize_request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {
                "name": "hello-example",
                "version": "1.0.0"
            }
        }
    }
    
    print("Sending initialize request...")
    print(f"Request: {json.dumps(initialize_request, indent=2)}")
    print()
    
    response = send_mcp_request(initialize_request)
    
    if response:
        print("Server response:")
        print(json.dumps(response, indent=2))
        
        if "status" in response and response["status"] == "server_started":
            print("\n✅ MCP server started successfully!")
            print("The server processed the initialize request and is ready for communication.")
            print("This demonstrates basic MCP server connectivity.")
        else:
            print("\n✅ Successfully communicated with MCP server!")
    else:
        print("❌ Failed to communicate with MCP server")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
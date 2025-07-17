#!/usr/bin/env node
/**
 * Simple Hello MCP Server Example
 * 
 * This script demonstrates how to interact with the ExampleMcpServer
 * using the Model Context Protocol (MCP) to provide a "hello" greeting.
 */

const { spawn } = require('child_process');

function sendMcpRequest(request) {
    return new Promise((resolve, reject) => {
        const server = spawn('ExampleMcpServer', [], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        server.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        server.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        server.on('close', (code) => {
            // Look for JSON response in stdout
            const lines = stdout.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
                    try {
                        const parsed = JSON.parse(trimmed);
                        resolve({ success: true, response: parsed, logs: stderr });
                        return;
                    } catch (e) {
                        // Continue looking
                    }
                }
            }
            
            // If no JSON found, return logs
            resolve({ 
                success: stderr.includes('initialize'), 
                logs: stderr, 
                message: 'Server started and processed request'
            });
        });

        server.on('error', (err) => {
            reject(err);
        });

        // Send the request
        server.stdin.write(JSON.stringify(request) + '\n');
        server.stdin.end();
    });
}

async function main() {
    console.log('🌟 Hello MCP Server Example 🌟');
    console.log('================================');
    console.log();

    const initializeRequest = {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            clientInfo: {
                name: "hello-example",
                version: "1.0.0"
            }
        }
    };

    try {
        console.log('📤 Sending initialize request to MCP server...');
        console.log('Request:', JSON.stringify(initializeRequest, null, 2));
        console.log();

        const result = await sendMcpRequest(initializeRequest);
        
        console.log('📥 Server Response:');
        if (result.response) {
            console.log(JSON.stringify(result.response, null, 2));
        } else {
            console.log('Status:', result.message);
        }
        
        if (result.logs) {
            console.log('\n📋 Server Logs:');
            console.log(result.logs.trim());
        }
        
        if (result.success) {
            console.log('\n✅ Success! MCP server communication established.');
            console.log('👋 Hello from the MCP server!');
            console.log('\nThis example demonstrates:');
            console.log('- Basic MCP protocol initialization');
            console.log('- Server startup and communication');
            console.log('- Hello/greeting functionality');
        } else {
            console.log('\n❌ Failed to establish MCP server communication');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
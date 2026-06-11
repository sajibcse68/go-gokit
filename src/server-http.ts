import http from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './create-server.js';

const PORT = Number(process.env.PORT ?? 3000);

const httpServer = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
    return;
  }

  if (req.url !== '/mcp') {
    res.writeHead(404).end();
    return;
  }

  let body: unknown;
  if (req.method === 'POST') {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    body = JSON.parse(Buffer.concat(chunks).toString());
  }

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const mcpServer = createServer();
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, body);
});

httpServer.listen(PORT, () => {
  console.log(`gokit MCP server listening on port ${PORT}`);
});

import http from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'node:crypto';
import { createServer } from './create-server.js';
import { render } from './templates/company-fit/index.js';
import { SAMPLE_PAYLOAD } from './templates/company-fit/sample.js';

const PORT = Number(process.env.PORT ?? 3000);

// One transport per session — keeps McpServer state (currentHtml) alive across requests.
const sessions = new Map<string, StreamableHTTPServerTransport>();

const httpServer = http.createServer(async (req, res) => {
  // CORS — required for Claude.ai web to reach this server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Mcp-Session-Id');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
    return;
  }

  if (req.url === '/preview') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(render(SAMPLE_PAYLOAD));
    return;
  }

  if (req.url !== '/mcp') {
    res.writeHead(404).end();
    return;
  }

  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (req.method === 'POST') {
    let body: unknown;
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const text = Buffer.concat(chunks).toString();
    if (text) body = JSON.parse(text);

    let transport: StreamableHTTPServerTransport;

    if (sessionId && sessions.has(sessionId)) {
      transport = sessions.get(sessionId)!;
    } else if (!sessionId && isInitializeRequest(body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          sessions.set(sid, transport);
        },
      });
      transport.onclose = () => {
        if (transport.sessionId) sessions.delete(transport.sessionId);
      };
      const mcpServer = createServer();
      await mcpServer.connect(transport);
    } else {
      res.writeHead(400).end('Bad request: missing or unknown session');
      return;
    }

    await transport.handleRequest(req, res, body);
    return;
  }

  if (req.method === 'GET' || req.method === 'DELETE') {
    if (!sessionId || !sessions.has(sessionId)) {
      res.writeHead(404).end('Session not found');
      return;
    }
    await sessions.get(sessionId)!.handleRequest(req, res);
    return;
  }

  res.writeHead(405).end();
});

httpServer.listen(PORT, () => {
  console.log(`gokit MCP server listening on port ${PORT}`);
});

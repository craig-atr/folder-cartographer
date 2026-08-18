#!/usr/bin/env node
/*
 * serve.mjs — a zero-dependency local server for the atlas + Map Room.
 *
 * The viewer reads each map's markdown with fetch(), and browsers block fetch()
 * on file:// pages — so double-clicking index.html can't load the maps. This
 * serves the folder over http instead. No Python, no npm; Node is all you need
 * (you already have it for verify.mjs).
 *
 *   node serve.mjs           # serve on http://localhost:8231/ and open it
 *   node serve.mjs 9000      # pick a port
 *   node serve.mjs --no-open # don't auto-open the browser
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const port = Number(args.find((a) => /^\d+$/.test(a))) || 8231;
const open = !args.includes('--no-open');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    let rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    // Resolve inside ROOT and refuse to escape it.
    const path = normalize(join(ROOT, rel));
    if (!path.startsWith(ROOT)) {
      res.writeHead(403).end('403 Forbidden');
      return;
    }
    const body = await readFile(path);
    res.writeHead(200, { 'Content-Type': TYPES[extname(path).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${port} is already in use. Try another: node serve.mjs ${port + 1}\n`);
    process.exit(1);
  }
  throw err;
});

server.listen(port, () => {
  const url = `http://localhost:${port}/`;
  console.log(`\n  folder-cartographer atlas → ${url}`);
  console.log('  the receipts are listed there; click one to walk the map.');
  console.log('  Ctrl+C to stop.\n');
  if (open) {
    const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
      : process.platform === 'darwin' ? ['open', [url]]
      : ['xdg-open', [url]];
    try { spawn(cmd[0], cmd[1], { stdio: 'ignore', detached: true }).unref(); } catch { /* open is best-effort */ }
  }
});

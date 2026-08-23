'use strict';

// legacy-server.js — the original single-file linkstash, from before it was split
// into server.js + router.js + auth.js + links.js + store.js. Kept for reference.
// Nothing requires it; package.json "main" is server.js. Booting it would fight the
// live server for the same port.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 8420;
const FILE = path.join(__dirname, 'links.json');

const read = () => {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
};

http
  .createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/links') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(read()));
    }
    res.writeHead(404).end();
  })
  .listen(PORT);

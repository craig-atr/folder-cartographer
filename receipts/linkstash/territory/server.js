'use strict';

const http = require('node:http');
const config = require('./config');
const { createRouter } = require('./router');
const { requireToken } = require('./auth');
const links = require('./links');

const router = createRouter();

// GET is public — anyone can read the saved links.
router.add('GET', '/links', links.list);
// POST and DELETE mutate the store, so they are wrapped in guard() (see auth.js).
router.add('POST', '/links', guard(links.create));
router.add('DELETE', '/links', guard(links.remove));

// Rate limiting is declared in config.rateLimit and implemented in ratelimit.js,
// but it is deliberately NOT mounted here. See the rate-limit card.

function guard(handler) {
  return (req, res, ...rest) => {
    if (!requireToken(req)) {
      res.writeHead(401, { 'content-type': 'application/json' });
      return res.end('{"error":"unauthorized"}');
    }
    return handler(req, res, ...rest);
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const route = router.match(req.method, url.pathname);
  if (!route) {
    res.writeHead(404, { 'content-type': 'application/json' });
    return res.end('{"error":"not found"}');
  }
  route.handler(req, res);
});

server.listen(config.port, () => {
  console.log(`linkstash listening on :${config.port}`);
});

module.exports = { server, guard };

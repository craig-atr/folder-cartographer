# linkstash

A tiny zero-dependency link-saving JSON API. Node's built-in `http`, a flat JSON file,
no npm install. Reads are public; writes need a token.

```bash
LINKSTASH_TOKEN=secret node server.js
curl localhost:8420/links
curl -X POST localhost:8420/links -H 'authorization: Bearer secret' \
  -H 'content-type: application/json' -d '{"url":"https://example.com"}'
```

Layout: `server.js` (entry) · `router.js` (dispatch) · `auth.js` (write token) ·
`links.js` (handlers) · `store.js` (JSON persistence) · `config.js` (knobs).
`ratelimit.js` and `legacy-server.js` are present but not on the running path.

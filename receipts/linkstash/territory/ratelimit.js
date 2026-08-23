'use strict';

const config = require('./config');

// A token-bucket limiter, fully written and exported. Nothing in server.js mounts
// it, so config.rateLimit.enabled has no effect on a running request. It is a name
// with an implementation but no wiring.
function createLimiter(opts = config.rateLimit) {
  const hits = new Map();
  return function allow(key) {
    const now = Date.now();
    const rec = hits.get(key) || { count: 0, reset: now + opts.windowMs };
    if (now > rec.reset) {
      rec.count = 0;
      rec.reset = now + opts.windowMs;
    }
    rec.count += 1;
    hits.set(key, rec);
    return rec.count <= opts.max;
  };
}

module.exports = { createLimiter };

'use strict';

const config = require('./config');

// Returns true if the request carries the write token. A read path never calls this.
function requireToken(req) {
  const expected = process.env[config.tokenEnv];
  const got = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  return Boolean(expected) && got === expected;
}

module.exports = { requireToken };

'use strict';

// linkstash configuration — the one place the server reads its knobs at boot.
const config = {
  port: Number(process.env.PORT || 8420),

  // The env var that holds the write token. Reads are public; writes need this.
  tokenEnv: 'LINKSTASH_TOKEN',

  storeFile: 'links.json',

  // Rate limiting. Declared enabled here — but nothing reads this block. See the
  // rate-limit card: config.rateLimit is a promise the running server never keeps.
  rateLimit: { enabled: true, windowMs: 60000, max: 100 },
};

module.exports = config;

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const config = require('./config');

const file = path.join(__dirname, config.storeFile);

// The only code that touches the JSON file on disk. Every handler that changes a
// link goes through writeAll(); every read goes through readAll().
function readAll() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeAll(links) {
  fs.writeFileSync(file, JSON.stringify(links, null, 2));
}

module.exports = { readAll, writeAll };

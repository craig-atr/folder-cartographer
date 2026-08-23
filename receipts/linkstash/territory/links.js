'use strict';

const store = require('./store');

// The three request handlers. They are the only callers of the store.
function list(req, res) {
  send(res, 200, store.readAll());
}

function create(req, res, body) {
  const links = store.readAll();
  const link = { id: Date.now().toString(36), url: body.url, title: body.title || body.url };
  links.push(link);
  store.writeAll(links);
  send(res, 201, link);
}

function remove(req, res, id) {
  store.writeAll(store.readAll().filter((l) => l.id !== id));
  send(res, 200, { removed: id });
}

function send(res, code, obj) {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(obj));
}

module.exports = { list, create, remove };

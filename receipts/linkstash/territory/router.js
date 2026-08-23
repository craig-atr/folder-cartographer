'use strict';

// A minimal method+path router. Handlers register with add(); match() finds the
// one whose method and path both equal the request's. No auth logic lives here.
function createRouter() {
  const routes = [];
  return {
    add(method, pathname, handler) {
      routes.push({ method, pathname, handler });
    },
    match(method, pathname) {
      return routes.find((r) => r.method === method && r.pathname === pathname) || null;
    },
  };
}

module.exports = { createRouter };

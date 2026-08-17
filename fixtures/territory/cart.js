// cart.js — a shopper's bag; sums itself via pricing
const { priceFor } = require('./pricing');

function createCart() {
  return { items: [] };
}

function addItem(cart, sku, qty) {
  cart.items.push({ sku, qty });
  return cart;
}

function total(cart) {
  return cart.items.reduce((s, it) => s + priceFor(it.sku) * it.qty, 0);
}

module.exports = { createCart, addItem, total };

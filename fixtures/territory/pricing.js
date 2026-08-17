// pricing.js — the source of truth for prices
const PRICES = { apple: 50, pear: 65 };

function priceFor(sku) {
  return PRICES[sku] ?? 0;
}

module.exports = { priceFor };

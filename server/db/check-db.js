import db from "./database.js";

const products =
  db.prepare(
    "SELECT COUNT(*) AS count FROM products"
  ).get();

const orders =
  db.prepare(
    "SELECT COUNT(*) AS count FROM orders"
  ).get();

console.log(
  "Products:",
  products.count
);

console.log(
  "Orders:",
  orders.count
);

const sampleProduct =
  db.prepare(`
    SELECT
      id,
      title,
      price,
      featured
    FROM products
    ORDER BY id
    LIMIT 1
  `).get();

console.log(
  "First product:",
  sampleProduct
);

const sampleOrder =
  db.prepare(`
    SELECT
      id,
      date,
      status,
      total
    FROM orders
    LIMIT 1
  `).get();

console.log(
  "First order:",
  sampleOrder
);
import Database from "better-sqlite3";

import {
  mkdirSync,
} from "node:fs";

import {
  dirname,
  join,
} from "node:path";

import {
  fileURLToPath,
} from "node:url";

import {
  seedProducts,
} from "./seed-products.js";


const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  dirname(__filename);

const DATA_DIR =
  join(
    __dirname,
    "..",
    "data"
  );

const DB_PATH =
  join(
    DATA_DIR,
    "noma.sqlite"
  );


mkdirSync(
  DATA_DIR,
  {
    recursive: true,
  }
);


const db =
  new Database(DB_PATH);


// ----------------------------------------
// SQLite settings
// ----------------------------------------

db.pragma(
  "journal_mode = WAL"
);

db.pragma(
  "foreign_keys = ON"
);


// ----------------------------------------
// Schema
// ----------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    alt TEXT,
    description TEXT,
    badge TEXT,
    featured INTEGER NOT NULL DEFAULT 0
      CHECK (featured IN (0, 1))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    customer_json TEXT NOT NULL,
    items_json TEXT NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL
      CHECK (
        status IN (
          'pending',
          'processing',
          'completed',
          'cancelled'
        )
      )
  );
`);


// ----------------------------------------
// Seed Products
// ----------------------------------------

const productCount =
  db
    .prepare(
      "SELECT COUNT(*) AS count FROM products"
    )
    .get()
    .count;


if (productCount === 0) {
  const insertProduct =
    db.prepare(`
      INSERT INTO products (
        id,
        title,
        category,
        price,
        image,
        alt,
        description,
        badge,
        featured
      )
      VALUES (
        @id,
        @title,
        @category,
        @price,
        @image,
        @alt,
        @description,
        @badge,
        @featured
      )
    `);


  const seedProductsToDatabase =
    db.transaction(
      (products) => {
        for (
          const product of products
        ) {
          insertProduct.run({
            id: product.id,
            title:
              product.title,
            category:
              product.category,
            price:
              Number(
                product.price
              ),
            image:
              product.image ??
              null,
            alt:
              product.alt ??
              null,
            description:
              product.description ??
              null,
            badge:
              product.badge ??
              null,
            featured:
              product.featured
                ? 1
                : 0,
          });
        }
      }
    );


  seedProductsToDatabase(
    seedProducts
  );
}


export default db;
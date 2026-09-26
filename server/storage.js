import {
  access,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";

import {
  dirname,
  join,
} from "node:path";

import {
  fileURLToPath,
} from "node:url";

import {
  products as seedProducts,
} from "../src/data/products.js";


const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  dirname(__filename);

const DATA_DIR =
  join(__dirname, "data");

const PRODUCTS_FILE =
  join(DATA_DIR, "products.json");

const ORDERS_FILE =
  join(DATA_DIR, "orders.json");


async function fileExists(
  filePath
) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}


async function writeJson(
  filePath,
  data
) {
  await writeFile(
    filePath,
    JSON.stringify(
      data,
      null,
      2
    ),
    "utf-8"
  );
}


async function readJson(
  filePath
) {
  const data =
    await readFile(
      filePath,
      "utf-8"
    );

  return JSON.parse(data);
}


export async function ensureStorage() {
  await mkdir(
    DATA_DIR,
    {
      recursive: true,
    }
  );


  const productsExists =
    await fileExists(
      PRODUCTS_FILE
    );


  if (!productsExists) {
    await writeJson(
      PRODUCTS_FILE,
      seedProducts
    );
  }


  const ordersExists =
    await fileExists(
      ORDERS_FILE
    );


  if (!ordersExists) {
    await writeJson(
      ORDERS_FILE,
      []
    );
  }
}

export async function getProducts() {
  return readJson(
    PRODUCTS_FILE
  );
}

export async function saveProducts(
  products
) {
  await writeJson(
    PRODUCTS_FILE,
    products
  );
}

export async function getOrders() {
  return readJson(
    ORDERS_FILE
  );
}

export async function saveOrders(
  orders
) {
  await writeJson(
    ORDERS_FILE,
    orders
  );
}
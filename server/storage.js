import db from "./db/database.js";


// ----------------------------------------
// Initialization
// ----------------------------------------

export async function ensureStorage() {
  /*
   * database.js creates the SQLite database
   * and tables when it is imported.
   *
   * This function is kept because
   * server/index.js already calls it.
   */
}


// ----------------------------------------
// Products
// ----------------------------------------

export async function getProducts() {
  const rows = db
    .prepare(`
      SELECT
        id,
        title,
        category,
        price,
        image,
        alt,
        description,
        badge,
        featured
      FROM products
      ORDER BY id
    `)
    .all();

  return rows.map(
    (product) => ({
      ...product,
      featured:
        Boolean(product.featured),
    })
  );
}


export async function saveProducts(
  products
) {
  const deleteProducts =
    db.prepare(
      "DELETE FROM products"
    );

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


  const saveAll =
    db.transaction(
      (items) => {
        deleteProducts.run();

        for (
          const product of items
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


  saveAll(products);
}


// ----------------------------------------
// Orders
// ----------------------------------------

export async function getOrders() {
  const rows = db
    .prepare(`
      SELECT
        id,
        date,
        customer_json,
        items_json,
        subtotal,
        shipping,
        total,
        status
      FROM orders
      ORDER BY date DESC
    `)
    .all();

  return rows.map(
    (order) => ({
      id: order.id,
      date: order.date,

      customer:
        JSON.parse(
          order.customer_json
        ),

      items:
        JSON.parse(
          order.items_json
        ),

      subtotal:
        Number(
          order.subtotal
        ),

      shipping:
        Number(
          order.shipping
        ),

      total:
        Number(
          order.total
        ),

      status:
        order.status,
    })
  );
}


export async function saveOrders(
  orders
) {
  const deleteOrders =
    db.prepare(
      "DELETE FROM orders"
    );

  const insertOrder =
    db.prepare(`
      INSERT INTO orders (
        id,
        date,
        customer_json,
        items_json,
        subtotal,
        shipping,
        total,
        status
      )
      VALUES (
        @id,
        @date,
        @customer_json,
        @items_json,
        @subtotal,
        @shipping,
        @total,
        @status
      )
    `);


  const saveAll =
    db.transaction(
      (items) => {
        deleteOrders.run();

        for (
          const order of items
        ) {
          insertOrder.run({
            id: order.id,

            date: order.date,

            customer_json:
              JSON.stringify(
                order.customer ??
                {}
              ),

            items_json:
              JSON.stringify(
                order.items ??
                []
              ),

            subtotal:
              Number(
                order.subtotal ??
                0
              ),

            shipping:
              Number(
                order.shipping ??
                0
              ),

            total:
              Number(
                order.total ??
                0
              ),

            status:
              order.status ??
              "pending",
          });
        }
      }
    );


  saveAll(orders);
}
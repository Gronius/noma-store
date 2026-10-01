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
  const currentRows =
    db
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
      `)
      .all();


  const currentProducts =
    new Map(
      currentRows.map(
        (product) => [
          product.id,
          product,
        ]
      )
    );


  const incomingProducts =
    new Map(
      products.map(
        (product) => [
          Number(product.id),
          product,
        ]
      )
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


  const updateProduct =
    db.prepare(`
      UPDATE products
      SET
        title = @title,
        category = @category,
        price = @price,
        image = @image,
        alt = @alt,
        description = @description,
        badge = @badge,
        featured = @featured
      WHERE id = @id
    `);


  const deleteProduct =
    db.prepare(`
      DELETE FROM products
      WHERE id = ?
    `);


  const syncProducts =
    db.transaction(
      (items) => {
        /*
         * INSERT / UPDATE
         */
        for (
          const product of items
        ) {
          const id =
            Number(product.id);

          const existing =
            currentProducts.get(id);

          const normalizedProduct = {
            id,
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
          };


          /*
           * New product
           */
          if (!existing) {
            insertProduct.run(
              normalizedProduct
            );

            continue;
          }


          /*
           * Existing product:
           * update only when something changed.
           */
          const hasChanged =
            existing.title !==
              normalizedProduct.title ||
            existing.category !==
              normalizedProduct.category ||
            Number(existing.price) !==
              normalizedProduct.price ||
            (existing.image ??
              null) !==
              normalizedProduct.image ||
            (existing.alt ??
              null) !==
              normalizedProduct.alt ||
            (existing.description ??
              null) !==
              normalizedProduct.description ||
            (existing.badge ??
              null) !==
              normalizedProduct.badge ||
            Number(existing.featured) !==
              normalizedProduct.featured;


          if (hasChanged) {
            updateProduct.run(
              normalizedProduct
            );
          }
        }


        /*
         * DELETE
         *
         * Any database product that is
         * not present in the incoming array
         * was removed from the application state.
         */
        for (
          const existingId of
            currentProducts.keys()
        ) {
          if (
            !incomingProducts.has(
              existingId
            )
          ) {
            deleteProduct.run(
              existingId
            );
          }
        }
      }
    );


  syncProducts(products);
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
  const currentRows =
    db
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
      `)
      .all();


  const currentOrders =
    new Map(
      currentRows.map(
        (order) => [
          order.id,
          order,
        ]
      )
    );


  const incomingOrders =
    new Map(
      orders.map(
        (order) => [
          order.id,
          order,
        ]
      )
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


  const updateOrder =
    db.prepare(`
      UPDATE orders
      SET
        date = @date,
        customer_json = @customer_json,
        items_json = @items_json,
        subtotal = @subtotal,
        shipping = @shipping,
        total = @total,
        status = @status
      WHERE id = @id
    `);


  const deleteOrder =
    db.prepare(`
      DELETE FROM orders
      WHERE id = ?
    `);


  const syncOrders =
    db.transaction(
      (items) => {
        /*
         * INSERT / UPDATE
         */
        for (
          const order of items
        ) {
          const existing =
            currentOrders.get(
              order.id
            );


          const normalizedOrder = {
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
          };


          /*
           * New order
           */
          if (!existing) {
            insertOrder.run(
              normalizedOrder
            );

            continue;
          }


          /*
           * Existing order:
           * update only when something changed.
           */
          const hasChanged =
            existing.date !==
              normalizedOrder.date ||
            existing.customer_json !==
              normalizedOrder.customer_json ||
            existing.items_json !==
              normalizedOrder.items_json ||
            Number(
              existing.subtotal
            ) !==
              normalizedOrder.subtotal ||
            Number(
              existing.shipping
            ) !==
              normalizedOrder.shipping ||
            Number(
              existing.total
            ) !==
              normalizedOrder.total ||
            existing.status !==
              normalizedOrder.status;


          if (hasChanged) {
            updateOrder.run(
              normalizedOrder
            );
          }
        }


        /*
         * DELETE
         */
        for (
          const existingId of
            currentOrders.keys()
        ) {
          if (
            !incomingOrders.has(
              existingId
            )
          ) {
            deleteOrder.run(
              existingId
            );
          }
        }
      }
    );


  syncOrders(orders);
}
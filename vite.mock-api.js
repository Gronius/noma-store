import { products } from "./src/data/products.js";

let mockProducts = [...products];

let mockOrders = [];

export function mockApiPlugin() {
  return {
    name: "noma-mock-api",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(
          req.url,
          "http://localhost"
        );

        const pathname = url.pathname;

        // ----------------------------------------
        // GET /api/products
        // ----------------------------------------

        if (
          pathname === "/api/products" &&
          req.method === "GET"
        ) {
          res.statusCode = 200;
          res.setHeader(
            "Content-Type",
            "application/json"
          );

          res.end(
            JSON.stringify(mockProducts)
          );

          return;
        }

        // ----------------------------------------
        // GET /api/products/:id
        // ----------------------------------------

        const productMatch =
          pathname.match(/^\/api\/products\/(\d+)$/);

        if (
          productMatch &&
          req.method === "GET"
        ) {
          const productId = Number(
            productMatch[1]
          );

          const product =
            mockProducts.find(
              (item) => item.id === productId
            );

          if (!product) {
            res.statusCode = 404;
            res.setHeader(
              "Content-Type",
              "application/json"
            );

            res.end(
              JSON.stringify({
                error: "Product not found",
              })
            );

            return;
          }

          res.statusCode = 200;
          res.setHeader(
            "Content-Type",
            "application/json"
          );

          res.end(
            JSON.stringify(product)
          );

          return;
        }

        // ----------------------------------------
        // POST /api/products
        // ----------------------------------------

        if (
          pathname === "/api/products" &&
          req.method === "POST"
        ) {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", () => {
            try {
              const productData =
                JSON.parse(body);

              const nextId =
                mockProducts.length > 0
                  ? Math.max(
                      ...mockProducts.map(
                        (product) => product.id
                      )
                    ) + 1
                  : 1;

              const product = {
                id: nextId,
                ...productData,
              };

              mockProducts.push(product);

              res.statusCode = 201;
              res.setHeader(
                "Content-Type",
                "application/json"
              );

              res.end(
                JSON.stringify(product)
              );
            } catch (error) {
              res.statusCode = 400;
              res.setHeader(
                "Content-Type",
                "application/json"
              );

              res.end(
                JSON.stringify({
                  error: "Invalid JSON body",
                })
              );
            }
          });

          return;
        }

        // ----------------------------------------
        // PATCH /api/products/:id
        // ----------------------------------------

        if (
          productMatch &&
          req.method === "PATCH"
        ) {
          const productId = Number(
            productMatch[1]
          );

          const productIndex =
            mockProducts.findIndex(
              (item) => item.id === productId
            );

          if (productIndex === -1) {
            res.statusCode = 404;
            res.setHeader(
              "Content-Type",
              "application/json"
            );

            res.end(
              JSON.stringify({
                error: "Product not found",
              })
            );

            return;
          }

          let body = "";

          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", () => {
            try {
              const productData =
                JSON.parse(body);

              const updatedProduct = {
                ...mockProducts[productIndex],
                ...productData,
                id: mockProducts[productIndex].id,
              };

              mockProducts[productIndex] =
                updatedProduct;

              res.statusCode = 200;
              res.setHeader(
                "Content-Type",
                "application/json"
              );

              res.end(
                JSON.stringify(updatedProduct)
              );
            } catch (error) {
              res.statusCode = 400;
              res.setHeader(
                "Content-Type",
                "application/json"
              );

              res.end(
                JSON.stringify({
                  error: "Invalid JSON body",
                })
              );
            }
          });

          return;
        }

        // ----------------------------------------
        // DELETE /api/products/:id
        // ----------------------------------------

        if (
          productMatch &&
          req.method === "DELETE"
        ) {
          const productId = Number(
            productMatch[1]
          );

          const productIndex =
            mockProducts.findIndex(
              (item) => item.id === productId
            );

          if (productIndex === -1) {
            res.statusCode = 404;
            res.setHeader(
              "Content-Type",
              "application/json"
            );

            res.end(
              JSON.stringify({
                error: "Product not found",
              })
            );

            return;
          }

          const deletedProduct =
            mockProducts.splice(
              productIndex,
              1
            )[0];

          res.statusCode = 200;
          res.setHeader(
            "Content-Type",
            "application/json"
          );

          res.end(
            JSON.stringify({
              message: "Product deleted",
              product: deletedProduct,
            })
          );

          return;
        }

        // ----------------------------------------
// GET /api/orders
// ----------------------------------------

if (
  pathname === "/api/orders" &&
  req.method === "GET"
) {
  res.statusCode = 200;
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.end(
    JSON.stringify(mockOrders)
  );

  return;
}

// ----------------------------------------
// GET /api/orders/:id
// ----------------------------------------

const orderMatch =
  pathname.match(/^\/api\/orders\/([^/]+)$/);

if (
  orderMatch &&
  req.method === "GET"
) {
  const orderId =
    decodeURIComponent(orderMatch[1]);

  const order =
    mockOrders.find(
      (item) => item.id === orderId
    );

  if (!order) {
    res.statusCode = 404;
    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.end(
      JSON.stringify({
        error: "Order not found",
      })
    );

    return;
  }

  res.statusCode = 200;
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.end(
    JSON.stringify(order)
  );

  return;
}

// ----------------------------------------
// POST /api/orders
// ----------------------------------------

if (
  pathname === "/api/orders" &&
  req.method === "POST"
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const orderData =
        JSON.parse(body);

      const order = {
        id: `NOMA-${Date.now()}`,
        date:
          new Date().toISOString(),
        ...orderData,
        status: "pending",
      };

      mockOrders.push(order);

      res.statusCode = 201;
      res.setHeader(
        "Content-Type",
        "application/json"
      );

      res.end(
        JSON.stringify(order)
      );
    } catch (error) {
      res.statusCode = 400;
      res.setHeader(
        "Content-Type",
        "application/json"
      );

      res.end(
        JSON.stringify({
          error: "Invalid JSON body",
        })
      );
    }
  });

  return;
}

// ----------------------------------------
// PATCH /api/orders/:id
// ----------------------------------------

if (
  orderMatch &&
  req.method === "PATCH"
) {
  const orderId =
    decodeURIComponent(orderMatch[1]);

  const order =
    mockOrders.find(
      (item) => item.id === orderId
    );

  if (!order) {
    res.statusCode = 404;
    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.end(
      JSON.stringify({
        error: "Order not found",
      })
    );

    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const updateData =
        JSON.parse(body);

      if (
        updateData.status !==
          "pending" &&
        updateData.status !==
          "processing" &&
        updateData.status !==
          "completed" &&
        updateData.status !==
          "cancelled"
      ) {
        res.statusCode = 400;
        res.setHeader(
          "Content-Type",
          "application/json"
        );

        res.end(
          JSON.stringify({
            error:
              "Invalid order status",
          })
        );

        return;
      }

      order.status =
        updateData.status;

      res.statusCode = 200;
      res.setHeader(
        "Content-Type",
        "application/json"
      );

      res.end(
        JSON.stringify(order)
      );
    } catch (error) {
      res.statusCode = 400;
      res.setHeader(
        "Content-Type",
        "application/json"
      );

      res.end(
        JSON.stringify({
          error: "Invalid JSON body",
        })
      );
    }
  });

  return;
}

// ----------------------------------------
// DELETE /api/orders/:id
// ----------------------------------------

if (
  orderMatch &&
  req.method === "DELETE"
) {
  const orderId =
    decodeURIComponent(orderMatch[1]);

  const orderIndex =
    mockOrders.findIndex(
      (item) => item.id === orderId
    );

  if (orderIndex === -1) {
    res.statusCode = 404;
    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.end(
      JSON.stringify({
        error: "Order not found",
      })
    );

    return;
  }

  const deletedOrder =
    mockOrders.splice(
      orderIndex,
      1
    )[0];

  res.statusCode = 200;
  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.end(
    JSON.stringify({
      message: "Order deleted",
      order: deletedOrder,
    })
  );

  return;
}

        // ----------------------------------------
        // Other requests
        // ----------------------------------------

        next();
      });
    },
  };
}

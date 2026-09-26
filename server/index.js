import {
  createServer,
} from "node:http";

import {
  ensureStorage,
  getProducts,
  saveProducts,
  getOrders,
  saveOrders,
} from "./storage.js";


const PORT = 3000;

const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];


function sendJson(
  res,
  statusCode,
  data
) {
  res.statusCode =
    statusCode;

  res.setHeader(
    "Content-Type",
    "application/json"
  );

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  res.end(
    JSON.stringify(data)
  );
}


async function readBody(
  req
) {
  let body = "";

  for await (
    const chunk of req
  ) {
    body += chunk;
  }

  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch {
    const error =
      new Error(
        "Invalid JSON body"
      );

    error.statusCode = 400;

    throw error;
  }
}


function getProductId(
  pathname
) {
  const match =
    pathname.match(
      /^\/api\/products\/(\d+)$/
    );

  return match
    ? Number(match[1])
    : null;
}


function getOrderId(
  pathname
) {
  const match =
    pathname.match(
      /^\/api\/orders\/([^/]+)$/
    );

  return match
    ? decodeURIComponent(
        match[1]
      )
    : null;
}


async function handleProducts(
  req,
  res,
  pathname
) {
  const productId =
    getProductId(pathname);


  // GET /api/products

  if (
    pathname ===
      "/api/products" &&
    req.method === "GET"
  ) {
    const products =
      await getProducts();

    sendJson(
      res,
      200,
      products
    );

    return true;
  }


  // GET /api/products/:id

  if (
    productId !== null &&
    req.method === "GET"
  ) {
    const products =
      await getProducts();

    const product =
      products.find(
        (item) =>
          item.id ===
          productId
      );

    if (!product) {
      sendJson(
        res,
        404,
        {
          error:
            "Product not found",
        }
      );

      return true;
    }

    sendJson(
      res,
      200,
      product
    );

    return true;
  }


  // POST /api/products

  if (
    pathname ===
      "/api/products" &&
    req.method === "POST"
  ) {
    const productData =
      await readBody(req);

    const products =
      await getProducts();

    const nextId =
      products.length > 0
        ? Math.max(
            ...products.map(
              (product) =>
                Number(
                  product.id
                )
            )
          ) + 1
        : 1;


    const product = {
      id: nextId,
      ...productData,
    };


    products.push(
      product
    );

    await saveProducts(
      products
    );


    sendJson(
      res,
      201,
      product
    );

    return true;
  }


  // PATCH /api/products/:id

  if (
    productId !== null &&
    req.method === "PATCH"
  ) {
    const productData =
      await readBody(req);

    const products =
      await getProducts();

    const productIndex =
      products.findIndex(
        (item) =>
          item.id ===
          productId
      );


    if (
      productIndex === -1
    ) {
      sendJson(
        res,
        404,
        {
          error:
            "Product not found",
        }
      );

      return true;
    }


    const updatedProduct = {
      ...products[
        productIndex
      ],
      ...productData,
      id:
        products[
          productIndex
        ].id,
    };


    products[
      productIndex
    ] = updatedProduct;


    await saveProducts(
      products
    );


    sendJson(
      res,
      200,
      updatedProduct
    );

    return true;
  }


  // DELETE /api/products/:id

  if (
    productId !== null &&
    req.method === "DELETE"
  ) {
    const products =
      await getProducts();

    const productIndex =
      products.findIndex(
        (item) =>
          item.id ===
          productId
      );


    if (
      productIndex === -1
    ) {
      sendJson(
        res,
        404,
        {
          error:
            "Product not found",
        }
      );

      return true;
    }


    const deletedProduct =
      products.splice(
        productIndex,
        1
      )[0];


    await saveProducts(
      products
    );


    sendJson(
      res,
      200,
      {
        message:
          "Product deleted",
        product:
          deletedProduct,
      }
    );

    return true;
  }


  return false;
}


async function handleOrders(
  req,
  res,
  pathname
) {
  const orderId =
    getOrderId(pathname);


  // GET /api/orders

  if (
    pathname ===
      "/api/orders" &&
    req.method === "GET"
  ) {
    const orders =
      await getOrders();

    sendJson(
      res,
      200,
      orders
    );

    return true;
  }


  // GET /api/orders/:id

  if (
    orderId !== null &&
    req.method === "GET"
  ) {
    const orders =
      await getOrders();

    const order =
      orders.find(
        (item) =>
          item.id ===
          orderId
      );


    if (!order) {
      sendJson(
        res,
        404,
        {
          error:
            "Order not found",
        }
      );

      return true;
    }


    sendJson(
      res,
      200,
      order
    );

    return true;
  }


  // POST /api/orders

  if (
    pathname ===
      "/api/orders" &&
    req.method === "POST"
  ) {
    const orderData =
      await readBody(req);

    const orders =
      await getOrders();


    const order = {
      id: `NOMA-${Date.now()}`,
      date:
        new Date().toISOString(),
      ...orderData,
      status: "pending",
    };


    orders.push(order);

    await saveOrders(
      orders
    );


    sendJson(
      res,
      201,
      order
    );

    return true;
  }


  // PATCH /api/orders/:id

  if (
    orderId !== null &&
    req.method === "PATCH"
  ) {
    const updateData =
      await readBody(req);

    const orders =
      await getOrders();

    const orderIndex =
      orders.findIndex(
        (item) =>
          item.id ===
          orderId
      );


    if (
      orderIndex === -1
    ) {
      sendJson(
        res,
        404,
        {
          error:
            "Order not found",
        }
      );

      return true;
    }


    if (
      !ORDER_STATUSES.includes(
        updateData.status
      )
    ) {
      sendJson(
        res,
        400,
        {
          error:
            "Invalid order status",
        }
      );

      return true;
    }


    const updatedOrder = {
      ...orders[
        orderIndex
      ],
      status:
        updateData.status,
    };


    orders[
      orderIndex
    ] = updatedOrder;


    await saveOrders(
      orders
    );


    sendJson(
      res,
      200,
      updatedOrder
    );

    return true;
  }


  // DELETE /api/orders/:id

  if (
    orderId !== null &&
    req.method === "DELETE"
  ) {
    const orders =
      await getOrders();

    const orderIndex =
      orders.findIndex(
        (item) =>
          item.id ===
          orderId
      );


    if (
      orderIndex === -1
    ) {
      sendJson(
        res,
        404,
        {
          error:
            "Order not found",
        }
      );

      return true;
    }


    const deletedOrder =
      orders.splice(
        orderIndex,
        1
      )[0];


    await saveOrders(
      orders
    );


    sendJson(
      res,
      200,
      {
        message:
          "Order deleted",
        order:
          deletedOrder,
      }
    );

    return true;
  }


  return false;
}


const server =
  createServer(
    async (req, res) => {
      try {
        if (
          req.method ===
          "OPTIONS"
        ) {
          sendJson(
            res,
            204,
            null
          );

          return;
        }


        const url =
          new URL(
            req.url,
            `http://${req.headers.host || "localhost"}`
          );

        const pathname =
          url.pathname;


        const productHandled =
          await handleProducts(
            req,
            res,
            pathname
          );

        if (productHandled) {
          return;
        }


        const orderHandled =
          await handleOrders(
            req,
            res,
            pathname
          );

        if (orderHandled) {
          return;
        }


        sendJson(
          res,
          404,
          {
            error:
              "Route not found",
          }
        );
      } catch (error) {
        console.error(
          "API error:",
          error
        );

        sendJson(
          res,
          error.statusCode || 500,
          {
            error:
              error.message ||
              "Internal server error",
          }
        );
      }
    }
  );


await ensureStorage();


server.listen(
  PORT,
  () => {
    console.log(
      `NOMA API server running at http://localhost:${PORT}`
    );
  }
);
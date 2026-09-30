import {
  createServer,
} from "node:http";

import {
  ensureStorage,
} from "./storage.js";

import {
  sendJson,
  readJsonBody,
} from "./utils/http.js";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./services/products-service.js";

import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "./services/orders-service.js";


const PORT = 3000;


// ----------------------------------------
// Server
// ----------------------------------------

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
            204
          );

          return;
        }

        const url =
          new URL(
            req.url,
            `http://${
              req.headers.host ||
              "localhost"
            }`
          );

        const pathname =
          url.pathname;


        // ----------------------------------------
        // PRODUCTS
        // ----------------------------------------

        const productMatch =
          pathname.match(
            /^\/api\/products\/(\d+)$/
          );


        // GET /api/products

        if (
          pathname ===
            "/api/products" &&
          req.method === "GET"
        ) {
          const products =
            await getAllProducts();

          sendJson(
            res,
            200,
            products
          );

          return;
        }


        // GET /api/products/:id

        if (
          productMatch &&
          req.method === "GET"
        ) {
          const productId =
            Number(
              productMatch[1]
            );

          const product =
            await getProductById(
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

            return;
          }

          sendJson(
            res,
            200,
            product
          );

          return;
        }


        // POST /api/products

        if (
          pathname ===
            "/api/products" &&
          req.method === "POST"
        ) {
          const productData =
            await readJsonBody(
              req
            );

          const product =
            await createProduct(
              productData
            );

          sendJson(
            res,
            201,
            product
          );

          return;
        }


        // PATCH /api/products/:id

        if (
          productMatch &&
          req.method === "PATCH"
        ) {
          const productId =
            Number(
              productMatch[1]
            );

          const productData =
            await readJsonBody(
              req
            );

          const product =
            await updateProduct(
              productId,
              productData
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

            return;
          }

          sendJson(
            res,
            200,
            product
          );

          return;
        }


        // DELETE /api/products/:id

        if (
          productMatch &&
          req.method === "DELETE"
        ) {
          const productId =
            Number(
              productMatch[1]
            );

          const product =
            await deleteProduct(
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

            return;
          }

          sendJson(
            res,
            200,
            {
              message:
                "Product deleted",
              product,
            }
          );

          return;
        }


        // ----------------------------------------
        // ORDERS
        // ----------------------------------------

        const orderMatch =
          pathname.match(
            /^\/api\/orders\/([^/]+)$/
          );


        // GET /api/orders

        if (
          pathname ===
            "/api/orders" &&
          req.method === "GET"
        ) {
          const orders =
            await getAllOrders();

          sendJson(
            res,
            200,
            orders
          );

          return;
        }


        // GET /api/orders/:id

        if (
          orderMatch &&
          req.method === "GET"
        ) {
          const orderId =
            decodeURIComponent(
              orderMatch[1]
            );

          const order =
            await getOrderById(
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

            return;
          }

          sendJson(
            res,
            200,
            order
          );

          return;
        }


        // POST /api/orders

        if (
          pathname ===
            "/api/orders" &&
          req.method === "POST"
        ) {
          const orderData =
            await readJsonBody(
              req
            );

          const order =
            await createOrder(
              orderData
            );

          sendJson(
            res,
            201,
            order
          );

          return;
        }


        // PATCH /api/orders/:id

        if (
          orderMatch &&
          req.method === "PATCH"
        ) {
          const orderId =
            decodeURIComponent(
              orderMatch[1]
            );

          const updateData =
            await readJsonBody(
              req
            );

          const order =
            await updateOrderStatus(
              orderId,
              updateData.status
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

            return;
          }

          sendJson(
            res,
            200,
            order
          );

          return;
        }


        // DELETE /api/orders/:id

        if (
          orderMatch &&
          req.method === "DELETE"
        ) {
          const orderId =
            decodeURIComponent(
              orderMatch[1]
            );

          const order =
            await deleteOrder(
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

            return;
          }

          sendJson(
            res,
            200,
            {
              message:
                "Order deleted",
              order,
            }
          );

          return;
        }


        // ----------------------------------------
        // Unknown route
        // ----------------------------------------

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
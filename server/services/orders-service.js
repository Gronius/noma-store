import {
  HttpError,
} from "../utils/http.js";

import {
  getProducts,
  getOrders,
  saveOrders,
} from "../storage.js";

import {
  validateOrderCreate,
} from "../validators/order-validator.js";


export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];


export async function getAllOrders() {
  return await getOrders();
}


export async function getOrderById(
  orderId
) {
  const orders =
    await getOrders();

  return (
    orders.find(
      (order) =>
        order.id === orderId
    ) || null
  );
}

//HELPER

function validateOrderItemsAgainstProducts(
  items,
  products
) {
  const errors = {};
  const normalizedItems = [];

  items.forEach(
    (item, index) => {
      const product =
        products.find(
          (currentProduct) =>
            Number(currentProduct.id) ===
            Number(item.id)
        );

      if (!product) {
        errors[`items.${index}.id`] =
          "Product does not exist.";

        return;
      }

      const clientPriceCents =
        Math.round(
          Number(item.price) * 100
        );

      const actualPriceCents =
        Math.round(
          Number(product.price) * 100
        );

      if (
        clientPriceCents !==
        actualPriceCents
      ) {
        errors[`items.${index}.price`] =
          "Price does not match the current product price.";

        return;
      }

      normalizedItems.push({
        id:
          Number(product.id),

        title:
          product.title,

        price:
          Number(product.price),

        quantity:
          Number(item.quantity),

        image:
          product.image ?? null,
      });
    }
  );

  return {
    errors,
    normalizedItems,
  };
}


export async function createOrder(
  orderData
) {
  const validatedOrder =
    validateOrderCreate(
      orderData
    );

  const products =
    await getProducts();

  const {
  errors,
  normalizedItems,
} =
  validateOrderItemsAgainstProducts(
    validatedOrder.items,
    products
  );

if (
  Object.keys(errors).length > 0
) {
  throw new HttpError(
    400,
    "Order validation failed.",
    errors
  );
}

  const orders =
    await getOrders();

  const order = {
    id:
      `NOMA-${Date.now()}`,

    date:
      new Date().toISOString(),

    ...validatedOrder,

       items:
      normalizedItems,

    status:
      "pending",
  };

  orders.push(order);

  await saveOrders(
    orders
  );

  return order;
}


export async function updateOrderStatus(
  orderId,
  status
) {
  if (
    !ORDER_STATUSES.includes(
      status
    )
  ) {
    throw new HttpError(
      400,
      "Invalid order status.",
      {
        status:
          `status must be one of: ${ORDER_STATUSES.join(", ")}.`,
      }
    );
  }


  const orders =
    await getOrders();

  const order =
    orders.find(
      (item) =>
        item.id === orderId
    );

  if (!order) {
    return null;
  }


  order.status =
    status;

  await saveOrders(
    orders
  );

  return order;
}


export async function deleteOrder(
  orderId
) {
  const orders =
    await getOrders();

  const order =
    orders.find(
      (item) =>
        item.id === orderId
    );

  if (!order) {
    return null;
  }


  const filteredOrders =
    orders.filter(
      (item) =>
        item.id !== orderId
    );

  await saveOrders(
    filteredOrders
  );

  return order;
}
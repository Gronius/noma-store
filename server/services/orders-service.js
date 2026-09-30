import {
  getOrders,
  saveOrders,
} from "../storage.js";

import {
  HttpError,
} from "../utils/http.js";

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];

export async function getAllOrders() {
  return getOrders();
}

export async function getOrderById(
  orderId
) {
  const orders =
    await getOrders();

  return orders.find(
    (order) =>
      order.id === orderId
  ) ?? null;
}

export async function createOrder(
  orderData
) {
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

  await saveOrders(orders);

  return order;
}

export async function updateOrderStatus(
  orderId,
  status
) {
  const orders =
    await getOrders();

  const orderIndex =
    orders.findIndex(
      (order) =>
        order.id === orderId
    );

  if (orderIndex === -1) {
    return null;
  }

  if (
    !ORDER_STATUSES.includes(
      status
    )
  ) {
    throw new HttpError(
      400,
      "Invalid order status"
    );
  }

  const updatedOrder = {
    ...orders[orderIndex],
    status,
  };

  orders[orderIndex] =
    updatedOrder;

  await saveOrders(orders);

  return updatedOrder;
}

export async function deleteOrder(
  orderId
) {
  const orders =
    await getOrders();

  const orderIndex =
    orders.findIndex(
      (order) =>
        order.id === orderId
    );

  if (orderIndex === -1) {
    return null;
  }

  const deletedOrder =
    orders.splice(
      orderIndex,
      1
    )[0];

  await saveOrders(orders);

  return deletedOrder;
}
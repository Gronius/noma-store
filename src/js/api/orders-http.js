import { request } from "./api-client.js";

export async function getAllOrders() {
  return request("/orders");
}

export async function getOrderById(orderId) {
  return request(`/orders/${orderId}`);
}

export async function createOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function updateOrderStatus(
  orderId,
  status
) {
  return request(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
    }),
  });
}

export async function deleteOrder(orderId) {
  return request(`/orders/${orderId}`, {
    method: "DELETE",
  });
}

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];
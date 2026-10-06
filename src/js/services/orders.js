import {
  getAllOrders,
  getOrderById,
  createOrder as createOrderRequest,
  updateOrderStatus as updateOrderStatusRequest,
  deleteOrder as deleteOrderRequest,
  ORDER_STATUSES,
} from "../api/orders-http.js";

export async function getOrders() {
  return await getAllOrders();
}

export async function getOrder(id) {
  return await getOrderById(id);
}

export async function createOrder(orderData) {
  return await createOrderRequest(orderData);
}

export async function updateOrderStatus(orderId, status) {
  return await updateOrderStatusRequest(orderId, status);
}

export async function deleteOrder(orderId) {
  return await deleteOrderRequest(orderId);
}

export { ORDER_STATUSES };
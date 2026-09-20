import {
  getAllOrders as getAllOrdersStorage,
  getOrderById as getOrderByIdStorage,
  createOrder as createOrderStorage,
  updateOrderStatus as updateOrderStatusStorage,
  deleteOrder as deleteOrderStorage,
  ORDER_STATUSES,
} from "./orders-storage.js";


export function getAllOrders() {
  return getAllOrdersStorage();
}


export function getOrderById(orderId) {
  return getOrderByIdStorage(orderId);
}


export function createOrder(orderData) {
  return createOrderStorage(orderData);
}


export function updateOrderStatus(
  orderId,
  status
) {
  return updateOrderStatusStorage(
    orderId,
    status
  );
}


export function deleteOrder(orderId) {
  return deleteOrderStorage(orderId);
}


export {
  ORDER_STATUSES,
};
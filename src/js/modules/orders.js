const ORDERS_STORAGE_KEY = "noma-orders";

function getOrders() {
try {
const data = localStorage.getItem(
ORDERS_STORAGE_KEY
);


return data ? JSON.parse(data) : [];


} catch (error) {
console.error("Orders read error:", error);


return [];


}
}

function saveOrders(orders) {
try {
localStorage.setItem(
ORDERS_STORAGE_KEY,
JSON.stringify(orders)
);
} catch (error) {
console.error("Orders write error:", error);
}
}

export function createOrder(orderData) {
const orders = getOrders();

const order = {
id: `NOMA-${Date.now()}`,


date: new Date().toISOString(),

...orderData,

status: "pending",

};

orders.push(order);

saveOrders(orders);

return order;
}

export function getAllOrders() {
return getOrders();
}

export function getOrderById(orderId) {
const orders = getOrders();

return orders.find(
(order) => order.id === orderId
);
}

export function updateOrderStatus(
orderId,
status
) {
const orders = getOrders();

const order = orders.find(
(item) => item.id === orderId
);

if (!order) {
return null;
}

order.status = status;

saveOrders(orders);

return order;
}

export function deleteOrder(orderId) {
const orders = getOrders();

const filteredOrders = orders.filter(
(order) => order.id !== orderId
);

saveOrders(filteredOrders);
}

export const ORDER_STATUSES = [
"pending",
"processing",
"completed",
"cancelled",
];

import "../../styles/main.scss";

import {
  products as initialProducts,
} from "../../data/products.js";

import {
  getAllProducts,
} from "../modules/products.js";

import {
  getAllOrders,
} from "../modules/orders.js";

const productCountElement =
  document.querySelector(
    '[data-stat="products"]'
  );

const orderCountElement =
  document.querySelector(
    '[data-stat="orders"]'
  );

const revenueElement =
  document.querySelector(
    '[data-stat="revenue"]'
  );

const pendingElement =
  document.querySelector(
    '[data-stat="pending"]'
  );

const recentOrdersContainer =
  document.querySelector(
    "[data-recent-orders]"
  );

const products =
  getAllProducts(initialProducts);

const orders =
  getAllOrders();

function formatPrice(price) {
  return `€${Number(price).toFixed(2)}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function calculateRevenue(orders) {
  return orders.reduce(
    (total, order) =>
      total + Number(order.total),
    0
  );
}

function renderStats() {
  const totalProducts =
    products.length;

  const totalOrders =
    orders.length;

  const totalRevenue =
    calculateRevenue(orders);

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "pending"
    ).length;


  if (productCountElement) {
    productCountElement.textContent =
      totalProducts;
  }

  if (orderCountElement) {
    orderCountElement.textContent =
      totalOrders;
  }

  if (revenueElement) {
    revenueElement.textContent =
      formatPrice(totalRevenue);
  }

  if (pendingElement) {
    pendingElement.textContent =
      pendingOrders;
  }
}


function renderRecentOrders() {
  if (!recentOrdersContainer) {
    return;
  }

  if (orders.length === 0) {
    recentOrdersContainer.innerHTML = `
      <p class="dashboard__empty">
        No orders yet.
      </p>
    `;

    return;
  }

  const recentOrders =
    [...orders]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);

  recentOrdersContainer.innerHTML =
    recentOrders
      .map(
        (order) => `
          <article class="dashboard-order">

            <span class="dashboard-order__id">
              ${escapeHtml(order.id)}
            </span>

            <span class="dashboard-order__customer">
              ${escapeHtml(
                order.customer?.name ??
                "Unknown customer"
              )}
            </span>

            <span class="dashboard-order__date">
              ${formatDate(order.date)}
            </span>

            <span class="dashboard-order__total">
              ${formatPrice(order.total)}
            </span>

            <span
              class="
                dashboard-order__status
                dashboard-order__status--${escapeHtml(
                  order.status
                )}
              "
            >
              ${escapeHtml(order.status)}
            </span>

          </article>
        `
      )
      .join("");
}

/* ------------------------------
   Initial Dashboard
------------------------------ */

renderStats();
renderRecentOrders();













/* Initial Dashboard */

renderStats();

renderRecentOrders();
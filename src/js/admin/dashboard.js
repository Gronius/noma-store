import "../../styles/main.scss";

import {
  getAllProducts,
} from "../api/products-http.js";

import {
  getAllOrders,
} from "../api/orders-http.js";

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

let products = [];
let orders = [];


// ----------------------------------------
// Helpers
// ----------------------------------------

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
    .replaceAll(
      "'",
      "&#039;"
    );
}


// ----------------------------------------
// Calculations
// ----------------------------------------

function calculateRevenue(orderList) {
  return orderList.reduce(
    (total, order) =>
      total + Number(order.total),
    0
  );
}


// ----------------------------------------
// Render Stats
// ----------------------------------------

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


// ----------------------------------------
// Render Recent Orders
// ----------------------------------------

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
          <article
            class="dashboard-order"
          >
            <span
              class="dashboard-order__id"
            >
              ${escapeHtml(order.id)}
            </span>

            <span
              class="dashboard-order__customer"
            >
              ${escapeHtml(
                order.customer?.name ??
                "Unknown customer"
              )}
            </span>

            <span
              class="dashboard-order__date"
            >
              ${formatDate(order.date)}
            </span>

            <span
              class="dashboard-order__total"
            >
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
              ${escapeHtml(
                order.status
              )}
            </span>
          </article>
        `
      )
      .join("");
}


// ----------------------------------------
// Load Dashboard Data
// ----------------------------------------

async function initializeDashboard() {
  try {
    const [
      loadedProducts,
      loadedOrders,
    ] = await Promise.all([
      getAllProducts(),
      getAllOrders(),
    ]);

    products = loadedProducts;
    orders = loadedOrders;

    renderStats();
    renderRecentOrders();
  } catch (error) {
    console.error(
      "Dashboard load error:",
      error
    );

    if (recentOrdersContainer) {
      recentOrdersContainer.innerHTML = `
        <p class="dashboard__empty">
          Unable to load dashboard data.
        </p>
      `;
    }
  }
}

initializeDashboard();
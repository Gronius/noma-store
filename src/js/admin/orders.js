import "../../styles/main.scss";

import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  ORDER_STATUSES,
} from "../api/orders-api.js";


const ordersTable =
  document.querySelector(
    "[data-orders-table]"
  );

const ordersCount =
  document.querySelector(
    "[data-orders-count]"
  );

const ordersSearchInput =  //added
  document.querySelector(
    "[data-orders-search]"
  );

const ordersStatusFilter =  //added
  document.querySelector(
    "[data-orders-status]"
  );

const summaryTotal =
  document.querySelector(
    "[data-summary-total]"
  );

const summaryPending =
  document.querySelector(
    "[data-summary-pending]"
  );

const summaryProcessing =
  document.querySelector(
    "[data-summary-processing]"
  );

const summaryCompleted =
  document.querySelector(
    "[data-summary-completed]"
  );

const summaryCancelled =
  document.querySelector(
    "[data-summary-cancelled]"
  );



const orderModal =
  document.querySelector(
    "[data-order-modal]"
  );

const orderModalTitle =
  document.querySelector(
    "[data-order-modal-title]"
  );

const orderModalContent =
  document.querySelector(
    "[data-order-modal-content]"
  );

const orderModalCloseButtons =
  document.querySelectorAll(
    "[data-order-modal-close]"
  );

let searchQuery = "";  //add
let selectedStatus = "all";  //add




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
      hour: "2-digit",
      minute: "2-digit",
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


function getItemCount(order) {
  return order.items.reduce(
    (total, item) =>
      total + Number(item.quantity),
    0
  );
}


function getStatusClass(status) {
  return ORDER_STATUSES.includes(status)
    ? status
    : "pending";
}


function renderStatusOptions(
  currentStatus
) {
  return ORDER_STATUSES
    .map(
      (status) => `
        <option
          value="${status}"
          ${
            status === currentStatus
              ? "selected"
              : ""
          }
        >
          ${status}
        </option>
      `
    )
    .join("");
}

// -----Filter order added
function filterOrders(orders) {
  const query = searchQuery.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesSearch =
      !query ||
      order.id.toLowerCase().includes(query) ||
      order.customer?.name
        ?.toLowerCase()
        .includes(query);

    const matchesStatus =
      selectedStatus === "all" ||
      order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });
}

//Пошук
ordersSearchInput?.addEventListener( //added
  "input",
  () => {
    searchQuery =
      ordersSearchInput.value;

    renderOrders();
  }
);

// Фільтр статусу
ordersStatusFilter?.addEventListener(
  "change",
  () => {
    selectedStatus =
      ordersStatusFilter.value;

    renderOrders();
  }
);


// //  --Render Orders 
// function renderOrders() {
//   if (!ordersTable) {
//     return;
//   }
//   const orders =
//     getAllOrders();
//    const filteredOrders =  //added
//     filterOrders(allOrders);
//   if (ordersCount) {
//     ordersCount.textContent =
//       `${orders.length} ${
//         orders.length === 1
//           ? "order"
//           : "orders"
//       }`;
//   }
//   if (orders.length === 0) {
//     ordersTable.innerHTML = `
//       <tr>
//         <td
//           class="admin-orders__empty"
//           colspan="7"
//         >
//           No orders yet.
//         </td>
//       </tr>
//     `;
//     return;
//   }
//   const sortedOrders =
//     [...orders].sort(
//       (a, b) =>
//         new Date(b.date) -
//         new Date(a.date)
//     );
//   ordersTable.innerHTML =
//     sortedOrders
//       .map(
//         (order) => {
//           const itemCount =
//             getItemCount(order);
//           const statusClass =
//             getStatusClass(
//               order.status
//             );
//           return `
//             <tr
//               data-order-id="${escapeHtml(
//                 order.id
//               )}"
//             >
//               <td>
//                 <strong
//                   class="admin-order__id"
//                 >
//                   ${escapeHtml(
//                     order.id
//                   )}
//                 </strong>
//               </td>
//               <td>
//                 <span
//                   class="admin-order__customer"
//                 >
//                   ${escapeHtml(
//                     order.customer?.name ??
//                     "Unknown customer"
//                   )}
//                 </span>
//               </td>
//               <td>
//                 <span
//                   class="admin-order__date"
//                 >
//                   ${formatDate(
//                     order.date
//                   )}
//                 </span>
//               </td>
//               <td>
//                 <span
//                   class="admin-order__items"
//                 >
//                   ${itemCount}
//                   ${
//                     itemCount === 1
//                       ? "item"
//                       : "items"
//                   }
//                 </span>
//               </td>
//               <td>
//                 <strong
//                   class="admin-order__total"
//                 >
//                   ${formatPrice(
//                     order.total
//                   )}
//                 </strong>
//               </td>
//               <td>
//                 <select
//                   class="
//                     admin-order__status-select
//                     admin-order__status-select--${statusClass}
//                   "
//                   data-order-status
//                   data-order-id="${escapeHtml(
//                     order.id
//                   )}"
//                   aria-label="Change status for ${escapeHtml(
//                     order.id
//                   )}"
//                 >
//                   ${renderStatusOptions(
//                     order.status
//                   )}
//                 </select>
//               </td>
//               <td>
//   <div class="admin-order__actions">
//     <button
//       class="btn btn--ghost"
//       type="button"
//       data-order-action="view"
//       data-order-id="${escapeHtml(
//         order.id
//       )}"
//     >
//       View
//     </button>
//     <button
//       class="
//         btn
//         btn--ghost
//         admin-order__delete
//       "
//       type="button"
//       data-order-action="delete"
//       data-order-id="${escapeHtml(
//         order.id
//       )}"
//     >
//       Delete
//     </button>

//   </div>
// </td>
//             </tr>
//           `;
//         }
//       )
//       .join("");
// }

// ---- ORDER SUmmary
function renderOrdersSummary() {
  const orders = getAllOrders();

  const counts = {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  };

  orders.forEach((order) => {
    if (
      Object.hasOwn(
        counts,
        order.status
      )
    ) {
      counts[order.status] += 1;
    }
  });

  if (summaryTotal) {
    summaryTotal.textContent =
      orders.length;
  }

  if (summaryPending) {
    summaryPending.textContent =
      counts.pending;
  }

  if (summaryProcessing) {
    summaryProcessing.textContent =
      counts.processing;
  }

  if (summaryCompleted) {
    summaryCompleted.textContent =
      counts.completed;
  }

  if (summaryCancelled) {
    summaryCancelled.textContent =
      counts.cancelled;
  }
}

// --RENDER ORDDER new
function renderOrders() {
  renderOrdersSummary();

  if (!ordersTable) {
    return;
  }

  const allOrders =
    getAllOrders();

  const filteredOrders =
    filterOrders(allOrders);

  if (ordersCount) {
    ordersCount.textContent =
      `${filteredOrders.length} ${
        filteredOrders.length === 1
          ? "order"
          : "orders"
      }`;
  }

  if (filteredOrders.length === 0) {
    ordersTable.innerHTML = `
      <tr>
        <td
          class="admin-orders__empty"
          colspan="7"
        >
          No orders found.
        </td>
      </tr>
    `;

    return;
  }

  const sortedOrders =
    [...filteredOrders].sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  ordersTable.innerHTML =
    sortedOrders
      .map(
        (order) => {
          const itemCount =
            getItemCount(order);

          const statusClass =
            getStatusClass(
              order.status
            );

          return `
            <tr
              data-order-id="${escapeHtml(
                order.id
              )}"
            >

              <td>
                <strong
                  class="admin-order__id"
                >
                  ${escapeHtml(
                    order.id
                  )}
                </strong>
              </td>

              <td>
                <span
                  class="admin-order__customer"
                >
                  ${escapeHtml(
                    order.customer?.name ??
                    "Unknown customer"
                  )}
                </span>
              </td>

              <td>
                <span
                  class="admin-order__date"
                >
                  ${formatDate(
                    order.date
                  )}
                </span>
              </td>

              <td>
                <span
                  class="admin-order__items"
                >
                  ${itemCount}
                  ${
                    itemCount === 1
                      ? "item"
                      : "items"
                  }
                </span>
              </td>

              <td>
                <strong
                  class="admin-order__total"
                >
                  ${formatPrice(
                    order.total
                  )}
                </strong>
              </td>

              <td>
                <select
                  class="
                    admin-order__status-select
                    admin-order__status-select--${statusClass}
                  "
                  data-order-status
                  data-order-id="${escapeHtml(
                    order.id
                  )}"
                  aria-label="Change status for ${escapeHtml(
                    order.id
                  )}"
                >
                  ${renderStatusOptions(
                    order.status
                  )}
                </select>
              </td>

              <td>
                <div class="admin-order__actions">
                  <button
                    class="btn btn--ghost"
                    type="button"
                    data-order-action="view"
                    data-order-id="${escapeHtml(
                      order.id
                    )}"
                  >
                    View
                  </button>

                  <button
                    class="
                      btn
                      btn--ghost
                      admin-order__delete
                    "
                    type="button"
                    data-order-action="delete"
                    data-order-id="${escapeHtml(
                      order.id
                    )}"
                  >
                    Delete
                  </button>
                </div>
              </td>

            </tr>
          `;
        }
      )
      .join("");
}
// --RENDER ORDDER end


function openOrderModal(orderId) {
  const orders =
    getAllOrders();

  const order =
    orders.find(
      (item) =>
        item.id === orderId
    );

  if (!order) {
    return;
  }


  if (orderModalTitle) {
    orderModalTitle.textContent =
      order.id;
  }

  if (orderModalContent) {
    orderModalContent.innerHTML = `
      <div class="admin-order-details">

        <section
          class="admin-order-details__section"
        >

          <h3
            class="admin-order-details__section-title"
          >
            Customer
          </h3>

          <dl
            class="admin-order-details__list"
          >

            <div>
              <dt>Name</dt>
              <dd>
                ${escapeHtml(
                  order.customer?.name ??
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>
                ${escapeHtml(
                  order.customer?.email ??
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>Phone</dt>
              <dd>
                ${escapeHtml(
                  order.customer?.phone ??
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>Address</dt>
              <dd>
                ${escapeHtml(
                  order.customer?.address ??
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>City</dt>
              <dd>
                ${escapeHtml(
                  order.customer?.city ??
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>Postal Code</dt>
              <dd>
                ${escapeHtml(
                  order.customer?.postalCode ??
                  "—"
                )}
              </dd>
            </div>

            <div>
              <dt>Payment</dt>
              <dd>
                ${escapeHtml(
                  order.customer?.paymentMethod ??
                  "—"
                )}
              </dd>
            </div>

          </dl>

        </section>
        <section
          class="admin-order-details__section"
        >

          <h3
            class="admin-order-details__section-title"
          >
            Products
          </h3>

          <div
            class="admin-order-details__items"
          >

            ${order.items
              .map(
                (item) => `
                  <article
                    class="admin-order-detail-item"
                  >

                    <div>
                      <strong>
                        ${escapeHtml(
                          item.title
                        )}
                      </strong>

                      <span>
                        Qty:
                        ${Number(
                          item.quantity
                        )}
                      </span>
                    </div>

                    <strong>
                      ${formatPrice(
                        Number(item.price) *
                        Number(item.quantity)
                      )}
                    </strong>

                  </article>
                `
              )
              .join("")}

          </div>

        </section>
        <section
          class="admin-order-details__section"
        >

          <h3
            class="admin-order-details__section-title"
          >
            Summary
          </h3>

          <dl
            class="admin-order-details__summary"
          >

            <div>
              <dt>Subtotal</dt>
              <dd>
                ${formatPrice(
                  order.subtotal
                )}
              </dd>
            </div>

            <div>
              <dt>Shipping</dt>
              <dd>
                ${formatPrice(
                  order.shipping
                )}
              </dd>
            </div>

            <div
              class="admin-order-details__total"
            >
              <dt>Total</dt>
              <dd>
                ${formatPrice(
                  order.total
                )}
              </dd>
            </div>

          </dl>

        </section>

      </div>
    `;
  }

  orderModal?.removeAttribute(
    "aria-hidden"
  );

  orderModal?.classList.add(
    "is-open"
  );
}

function closeOrderModal() {
  orderModal?.classList.remove(
    "is-open"
  );

  orderModal?.setAttribute(
    "aria-hidden",
    "true"
  );
}

function handleDeleteOrder(orderId) {
  const orders = getAllOrders();

  const order = orders.find(
    (item) => item.id === orderId
  );

  if (!order) {
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete order "${order.id}"?`
  );

  if (!confirmed) {
    return;
  }

  deleteOrder(orderId);

  closeOrderModal();

  renderOrders();
}


/* View order */

ordersTable?.addEventListener(
  "click",
  (event) => {
    const actionButton =
      event.target.closest(
        "[data-order-action]"
      );

    if (!actionButton) {
      return;
    }

    const action =
      actionButton.dataset.orderAction;

    const orderId =
      actionButton.dataset.orderId;


    if (action === "view") {
      openOrderModal(orderId);
    }

    if (action === "delete") {
     handleDeleteOrder(orderId);
    }
  }
);


/* Change order status */

ordersTable?.addEventListener(
  "change",
  (event) => {
    const statusSelect =
      event.target.closest(
        "[data-order-status]"
      );

    if (!statusSelect) {
      return;
    }

    const orderId =
      statusSelect.dataset.orderId;

    const newStatus =
      statusSelect.value;


    if (
      !ORDER_STATUSES.includes(
        newStatus
      )
    ) {
      return;
    }


    const updatedOrder =
      updateOrderStatus(
        orderId,
        newStatus
      );


    if (!updatedOrder) {
      return;
    }
    renderOrders();
  }
);
/* Close modal */

orderModalCloseButtons.forEach(
  (button) => {
    button.addEventListener(
      "click",
      closeOrderModal
    );
  }
);
/* Escape */

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.key === "Escape" &&
      orderModal?.classList.contains(
        "is-open"
      )
    ) {
      closeOrderModal();
    }
  }
);
/* Initial render */

renderOrders();
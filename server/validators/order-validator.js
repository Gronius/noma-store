import { HttpError } from "../utils/http.js";


const ALLOWED_ORDER_FIELDS = new Set([
  "customer",
  "items",
  "subtotal",
  "shipping",
  "total",
]);


const ALLOWED_ITEM_FIELDS = new Set([
  "id",
  "title",
  "price",
  "quantity",
  "image",
]);


const CUSTOMER_FIELDS = [
  "name",
  "email",
  "phone",
  "address",
  "city",
  "postalCode",
  "paymentMethod",
];


function createValidationError(details) {
  return new HttpError(
    400,
    "Order validation failed.",
    details
  );
}


function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}


function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}


function validateCustomer(
  customer,
  errors
) {
  if (!isPlainObject(customer)) {
    errors.customer =
      "customer must be an object.";

    return;
  }


  for (
    const field of CUSTOMER_FIELDS
  ) {
    const value =
      customer[field];

    if (
      typeof value !== "string" ||
      value.trim() === ""
    ) {
      errors[`customer.${field}`] =
        `${field} is required.`;
    }
  }


  if (
    typeof customer.email === "string" &&
    customer.email.trim() !== "" &&
    !isValidEmail(
      customer.email.trim()
    )
  ) {
    errors["customer.email"] =
      "email must be valid.";
  }


  for (
    const field of Object.keys(customer)
  ) {
    if (
      !CUSTOMER_FIELDS.includes(field)
    ) {
      errors[`customer.${field}`] =
        `Unknown customer field: ${field}.`;
    }
  }
}


function validateItems(
  items,
  errors
) {
  if (!Array.isArray(items)) {
    errors.items =
      "items must be an array.";

    return;
  }


  if (items.length === 0) {
    errors.items =
      "items must contain at least one item.";

    return;
  }


  items.forEach(
    (item, index) => {
      const prefix =
        `items.${index}`;


      if (!isPlainObject(item)) {
        errors[prefix] =
          "Order item must be an object.";

        return;
      }


      for (
        const field of Object.keys(item)
      ) {
        if (
          !ALLOWED_ITEM_FIELDS.has(field)
        ) {
          errors[`${prefix}.${field}`] =
            `Unknown item field: ${field}.`;
        }
      }


      if (
        !Number.isInteger(
          Number(item.id)
        ) ||
        Number(item.id) <= 0
      ) {
        errors[`${prefix}.id`] =
          "id must be a positive integer.";
      }


      if (
        typeof item.title !== "string" ||
        item.title.trim() === ""
      ) {
        errors[`${prefix}.title`] =
          "title is required.";
      }


      if (
        typeof item.price !== "number" ||
        !Number.isFinite(item.price) ||
        item.price < 0
      ) {
        errors[`${prefix}.price`] =
          "price must be a valid non-negative number.";
      }


      if (
        !Number.isInteger(
          item.quantity
        ) ||
        item.quantity < 1
      ) {
        errors[`${prefix}.quantity`] =
          "quantity must be a positive integer.";
      }


      if (
        item.image !== undefined &&
        item.image !== null &&
        typeof item.image !== "string"
      ) {
        errors[`${prefix}.image`] =
          "image must be a string.";
      }
    }
  );
}


function validateMoney(
  value,
  field,
  errors
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    errors[field] =
      `${field} must be a valid number.`;

    return;
  }


  if (value < 0) {
    errors[field] =
      `${field} cannot be negative.`;
  }
}


export function validateOrderCreate(
  data
) {
  const errors = {};


  if (!isPlainObject(data)) {
    throw createValidationError({
      body:
        "Request body must be a JSON object.",
    });
  }


  for (
    const field of Object.keys(data)
  ) {
    if (
      !ALLOWED_ORDER_FIELDS.has(field)
    ) {
      errors[field] =
        `Unknown order field: ${field}.`;
    }
  }


  validateCustomer(
    data.customer,
    errors
  );


  validateItems(
    data.items,
    errors
  );


  validateMoney(
    data.subtotal,
    "subtotal",
    errors
  );


  validateMoney(
    data.shipping,
    "shipping",
    errors
  );


  validateMoney(
    data.total,
    "total",
    errors
  );


  if (
    Object.keys(errors).length > 0
  ) {
    throw createValidationError(
      errors
    );
  }


  const calculatedSubtotal =
    data.items.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    );


  if (
    Math.abs(
      calculatedSubtotal -
        data.subtotal
    ) > 0.01
  ) {
    errors.subtotal =
      "subtotal does not match the order items.";
  }


  const calculatedTotal =
    data.subtotal +
    data.shipping;


  if (
    Math.abs(
      calculatedTotal -
        data.total
    ) > 0.01
  ) {
    errors.total =
      "total must equal subtotal plus shipping.";
  }


  if (
    Object.keys(errors).length > 0
  ) {
    throw createValidationError(
      errors
    );
  }


  return {
    customer: {
      name:
        data.customer.name.trim(),

      email:
        data.customer.email.trim(),

      phone:
        data.customer.phone.trim(),

      address:
        data.customer.address.trim(),

      city:
        data.customer.city.trim(),

      postalCode:
        data.customer.postalCode.trim(),

      paymentMethod:
        data.customer.paymentMethod.trim(),
    },

    items:
      data.items.map(
        (item) => ({
          id: Number(item.id),

          title:
            item.title.trim(),

          price:
            Number(item.price),

          quantity:
            Number(item.quantity),

          ...(item.image !== undefined && {
            image:
              item.image,
          }),
        })
      ),

    subtotal:
      Number(data.subtotal),

    shipping:
      Number(data.shipping),

    total:
      Number(data.total),
  };
}
import { HttpError } from "../utils/http.js";


const ALLOWED_FIELDS = new Set([
  "title",
  "category",
  "price",
  "image",
  "alt",
  "description",
  "badge",
  "featured",
]);


function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}


function createValidationError(errors) {
  return new HttpError(
    400,
    "Product validation failed.",
    errors
  );
}


function validateString(
  value,
  field,
  errors,
  {
    required = false,
    minLength = 1,
    maxLength = 255,
  } = {}
) {
  if (
    value === undefined ||
    value === null
  ) {
    if (required) {
      errors[field] = `${field} is required.`;
    }

    return;
  }

  if (typeof value !== "string") {
    errors[field] = `${field} must be a string.`;
    return;
  }

  const normalizedValue =
    value.trim();

  if (
    required &&
    normalizedValue.length === 0
  ) {
    errors[field] = `${field} is required.`;
    return;
  }

  if (
    normalizedValue.length > 0 &&
    normalizedValue.length < minLength
  ) {
    errors[field] =
      `${field} must contain at least ${minLength} characters.`;

    return;
  }

  if (
    normalizedValue.length > maxLength
  ) {
    errors[field] =
      `${field} must not exceed ${maxLength} characters.`;
  }
}


function validatePrice(
  value,
  errors
) {
  if (value === undefined) {
    errors.price = "price is required.";
    return;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    errors.price =
      "price must be a valid number.";

    return;
  }

  if (value < 0) {
    errors.price =
      "price cannot be negative.";
  }
}


function validateImage(
  value,
  errors
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return;
  }

  if (typeof value !== "string") {
    errors.image =
      "image must be a string.";

    return;
  }

  const image =
    value.trim();

  const isValid =
    image.startsWith("/") ||
    /^https?:\/\/.+/i.test(image);

  if (!isValid) {
    errors.image =
      "image must be an absolute URL or a root-relative path.";
  }
}


function validateBoolean(
  value,
  field,
  errors
) {
  if (value === undefined) {
    return;
  }

  if (typeof value !== "boolean") {
    errors[field] =
      `${field} must be a boolean.`;
  }
}


function validateFields(
  data,
  {
    partial = false,
  } = {}
) {
  const errors = {};

  if (!isPlainObject(data)) {
    throw createValidationError({
      body: "Request body must be a JSON object.",
    });
  }


  for (const field of Object.keys(data)) {
    if (!ALLOWED_FIELDS.has(field)) {
      errors[field] =
        `Unknown product field: ${field}.`;
    }
  }


  validateString(
    data.title,
    "title",
    errors,
    {
      required: !partial,
      minLength: 2,
      maxLength: 120,
    }
  );


  validateString(
    data.category,
    "category",
    errors,
    {
      required: !partial,
      minLength: 1,
      maxLength: 80,
    }
  );


  if (
    !partial ||
    Object.hasOwn(data, "price")
  ) {
    validatePrice(
      data.price,
      errors
    );
  }


  validateImage(
    data.image,
    errors
  );


  validateString(
    data.alt,
    "alt",
    errors,
    {
      required: !partial,
      minLength: 1,
      maxLength: 160,
    }
  );


  validateString(
    data.description,
    "description",
    errors,
    {
      required: !partial,
      minLength: 1,
      maxLength: 2000,
    }
  );


  validateString(
    data.badge,
    "badge",
    errors,
    {
      required: false,
      minLength: 1,
      maxLength: 50,
    }
  );


  validateBoolean(
    data.featured,
    "featured",
    errors
  );


  if (
    Object.keys(errors).length > 0
  ) {
    throw createValidationError(
      errors
    );
  }
}


function normalizeProductData(
  data,
  {
    partial = false,
  } = {}
) {
  validateFields(
    data,
    { partial }
  );


  const normalized = {};


  if (
    Object.hasOwn(data, "title")
  ) {
    normalized.title =
      data.title.trim();
  }


  if (
    Object.hasOwn(data, "category")
  ) {
    normalized.category =
      data.category.trim();
  }


  if (
    Object.hasOwn(data, "price")
  ) {
    normalized.price =
      Number(data.price);
  }


  if (
    Object.hasOwn(data, "image")
  ) {
    normalized.image =
      data.image.trim();
  }


  if (
    Object.hasOwn(data, "alt")
  ) {
    normalized.alt =
      data.alt.trim();
  }


  if (
    Object.hasOwn(data, "description")
  ) {
    normalized.description =
      data.description.trim();
  }


  if (
    Object.hasOwn(data, "badge")
  ) {
    normalized.badge =
      data.badge === null ||
      data.badge.trim() === ""
        ? null
        : data.badge.trim();
  }


  if (
    Object.hasOwn(data, "featured")
  ) {
    normalized.featured =
      data.featured;
  }


  return normalized;
}


export function validateProductCreate(
  data
) {
  return normalizeProductData(
    data,
    {
      partial: false,
    }
  );
}


export function validateProductUpdate(
  data
) {
  if (
    !isPlainObject(data) ||
    Object.keys(data).length === 0
  ) {
    throw createValidationError({
      body:
        "Update payload must contain at least one field.",
    });
  }


  return normalizeProductData(
    data,
    {
      partial: true,
    }
  );
}
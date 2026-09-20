import {
  API_BASE_URL,
  API_TIMEOUT,
} from "./api-config.js";

async function request(endpoint, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export { request };
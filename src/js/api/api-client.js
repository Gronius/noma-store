import {
  API_BASE_URL,
  API_TIMEOUT,
} from "./api-config.js";

async function request(endpoint, options = {}) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT);

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        signal: controller.signal,
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

    const contentType =
      response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("API request timed out");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export { request };
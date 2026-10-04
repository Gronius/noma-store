export class HttpError extends Error {
  constructor(
    statusCode,
    message,
    details = null
  ) {
    super(message);

    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}


export async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(
          JSON.parse(body)
        );
      } catch {
        reject(
          new HttpError(
            400,
            "Invalid JSON request body."
          )
        );
      }
    });

    req.on("error", reject);
  });
}


export function sendJson(
  res,
  statusCode,
  data
) {
  res.statusCode = statusCode;

  res.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (statusCode === 204) {
    res.end();
    return;
  }

  res.end(
    JSON.stringify(data)
  );
}
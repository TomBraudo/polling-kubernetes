// Shared utilities for API layer

export function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", (e) => reject(e));
  });
}

export function sendJsonResponse(res, status, body) {
  const json = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Length", Buffer.byteLength(json));
  res.end(json);
}


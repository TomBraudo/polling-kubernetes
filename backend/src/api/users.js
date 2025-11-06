// API handlers for users: formats HTTP responses; delegates raw params/body to business

import express from "express";

export function createUsersApi({ business, logger = console }) {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    try {
      // Get raw body and delegate to business
      const bodyRaw = req.rawBody || "";
      const user = await business.loginFromHttp({ bodyRaw });

      // Format HTTP response
      res.status(200).json(user);
    } catch (err) {
      logger.error?.(err);
      res.status(400).json({ error: String(err.message || err) });
    }
  });

  return { router };
}

export default { createUsersApi };

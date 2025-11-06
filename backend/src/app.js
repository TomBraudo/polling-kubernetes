import express from "express";
import cors from "cors";

import { createInMemoryUserRepository, createInMemoryPollRepository, createInMemoryVoteRepository } from "./db/index.js";
import { createPollService, createVoteService, createUserService } from "./service/index.js";
import { createPollBusinessHttp, createUserBusiness } from "./business/index.js";
import { createUsersApi, createPollsApi } from "./api/index.js";

export function createApp({ logger = console, port = 3000 } = {}) {
  // Compose dependencies
  const userRepository = createInMemoryUserRepository();
  const pollRepository = createInMemoryPollRepository();
  const voteRepository = createInMemoryVoteRepository();

  const userService = createUserService({ userRepository });
  const pollService = createPollService({ pollRepository });
  const voteService = createVoteService({ voteRepository, pollRepository });

  const userBusiness = createUserBusiness({ userService });
  const pollBusiness = createPollBusinessHttp({ pollService, voteService, voteRepository, pollRepository });

  const usersApi = createUsersApi({ business: userBusiness, logger });
  const pollsApi = createPollsApi({ business: pollBusiness, logger });

  // Create Express app
  const app = express();

  // CORS middleware
  app.use(cors());

  // Middleware to capture raw body for JSON requests (before express.json parses it)
  app.use((req, res, next) => {
    if (req.headers["content-type"]?.includes("application/json")) {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => {
        req.rawBody = data;
        next();
      });
    } else {
      req.rawBody = "";
      next();
    }
  });

  // Mount API routers
  app.use("/api/users", usersApi.router);
  app.use("/api/polls", pollsApi.router);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error handler
  app.use((err, req, res, next) => {
    logger.error?.(err);
    res.status(500).json({ error: String(err.message || err) });
  });

  let server = null;

  return {
    start() {
      server = app.listen(port, () => logger.log(`HTTP server listening on :${port}`));
    },
    stop() {
      if (server) server.close();
    },
  };
}

export default { createApp };

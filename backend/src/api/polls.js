// API handlers for polls: formats HTTP responses; delegates raw params/body to business

import express from "express";

export function createPollsApi({ business, logger = console }) {
  const router = express.Router();

  // Programmatic helpers used by tests (not HTTP server): return { status, body }
  async function createPoll({ body }) {
    try {
      const { title, options, createdByUserId } = body || {};
      const poll = await business.createPoll({ title, options, createdByUserId });
      return { status: 201, body: poll };
    } catch (err) {
      logger.error?.(err);
      return { status: 400, body: { error: String(err.message || err) } };
    }
  }

  async function voteOnPollProg({ params, body }) {
    try {
      const pollId = Number(params?.id);
      const { userId, optionIndex } = body || {};
      const vote = await business.vote({ pollId, userId, optionIndex });
      return { status: 201, body: vote };
    } catch (err) {
      logger.error?.(err);
      return { status: 400, body: { error: String(err.message || err) } };
    }
  }

  async function getResultsProg({ params }) {
    try {
      const pollId = Number(params?.id);
      const results = await business.getResults(pollId);
      return { status: 200, body: results };
    } catch (err) {
      logger.error?.(err);
      return { status: 404, body: { error: String(err.message || err) } };
    }
  }

  // HTTP route handlers
  // GET /api/polls - list all polls (or filter by createdByUserId query param)
  router.get("/", async (req, res) => {
    try {
      if (req.query?.createdByUserId) {
        // Get polls by user
        const userId = Number(req.query.createdByUserId);
        const polls = await business.getPollsByUserFromHttp({ params: { id: userId } });
        res.status(200).json(polls);
      } else {
        // Get all polls
        const polls = await business.getAllPollsFromHttp();
        res.status(200).json(polls);
      }
    } catch (err) {
      logger.error?.(err);
      res.status(400).json({ error: String(err.message || err) });
    }
  });

  // POST /api/polls - create poll
  router.post("/", async (req, res) => {
    try {
      // Get raw body and delegate to business
      const bodyRaw = req.rawBody || "";
      const poll = await business.createPollFromHttp({ bodyRaw });

      // Format HTTP response
      res.status(201).json(poll);
    } catch (err) {
      logger.error?.(err);
      res.status(400).json({ error: String(err.message || err) });
    }
  });

  // GET /api/polls/:id/votes?userId=:userId - check if user voted
  router.get("/:id/votes", async (req, res) => {
    try {
      if (req.query?.userId) {
        // Check if specific user voted
        const vote = await business.getUserVoteFromHttp({ params: req.params, query: req.query });
        if (vote) {
          res.status(200).json({ hasVoted: true, vote });
        } else {
          res.status(200).json({ hasVoted: false });
        }
      } else {
        // Get all votes for poll
        const votes = await business.getPollVotesFromHttp({ params: req.params });
        res.status(200).json(votes);
      }
    } catch (err) {
      logger.error?.(err);
      const status = err.message?.includes("not found") ? 404 : 400;
      res.status(status).json({ error: String(err.message || err) });
    }
  });

  // POST /api/polls/:id/votes - create vote
  router.post("/:id/votes", async (req, res) => {
    try {
      // Get raw body and params, delegate to business
      const bodyRaw = req.rawBody || "";
      const vote = await business.voteFromHttp({ params: req.params, bodyRaw });

      // Format HTTP response
      res.status(201).json(vote);
    } catch (err) {
      logger.error?.(err);
      res.status(400).json({ error: String(err.message || err) });
    }
  });

  // GET /api/polls/:id/results - get poll results
  router.get("/:id/results", async (req, res) => {
    try {
      // Delegate to business with raw params
      const results = await business.getResultsFromHttp({ params: req.params });

      // Format HTTP response
      res.status(200).json(results);
    } catch (err) {
      logger.error?.(err);
      const status = err.message?.includes("not found") ? 404 : 400;
      res.status(status).json({ error: String(err.message || err) });
    }
  });

  // GET /api/polls/:id - get single poll
  router.get("/:id", async (req, res) => {
    try {
      const poll = await business.getPollFromHttp({ params: req.params });
      res.status(200).json(poll);
    } catch (err) {
      logger.error?.(err);
      const status = err.message?.includes("not found") ? 404 : 400;
      res.status(status).json({ error: String(err.message || err) });
    }
  });

  return {
    router,
    // Programmatic helpers for tests:
    createPoll,
    voteOnPoll: voteOnPollProg,
    getResults: getResultsProg,
  };
}

export default { createPollsApi };

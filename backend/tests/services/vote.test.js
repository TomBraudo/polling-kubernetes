import test from "node:test";
import assert from "node:assert/strict";

import { createVoteService } from "../../src/service/voteService.js";

function makeInMemoryPollRepository() {
  const byId = new Map();
  let nextId = 1;
  return {
    create(poll) {
      const saved = { id: nextId++, ...poll };
      byId.set(saved.id, saved);
      return saved;
    },
    findById(id) {
      return byId.get(id) || null;
    },
    _clear() {
      byId.clear();
      nextId = 1;
    },
  };
}

function makeInMemoryVoteRepository() {
  const byId = new Map();
  const byPollAndUser = new Map();
  let nextId = 1;
  return {
    create(vote) {
      const key = `${vote.pollId}:${vote.userId}`;
      if (byPollAndUser.has(key)) {
        throw new Error("User has already voted on this poll");
      }
      const saved = { id: nextId++, ...vote };
      byId.set(saved.id, saved);
      byPollAndUser.set(key, saved);
      return saved;
    },
    findByPollAndUser(pollId, userId) {
      const key = `${pollId}:${userId}`;
      return byPollAndUser.get(key) || null;
    },
    _clear() {
      byId.clear();
      byPollAndUser.clear();
      nextId = 1;
    },
  };
}

test("rejects invalid pollId", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  for (const badPollId of [null, undefined, 0, -1, NaN, "1", 1.5]) {
    await assert.rejects(service.create(badPollId, 1, 0), /pollId/i, String(badPollId));
  }
});

test("rejects invalid userId", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  const poll = await pollRepo.create({ title: "Test", options: ["Yes", "No"], createdByUserId: 1 });

  for (const badUserId of [null, undefined, 0, -1, NaN, "1", 1.5]) {
    await assert.rejects(service.create(poll.id, badUserId, 0), /userId/i, String(badUserId));
  }
});

test("rejects vote when poll does not exist", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  await assert.rejects(service.create(999, 1, 0), /not found/i);
});

test("rejects invalid optionIndex (negative)", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  const poll = await pollRepo.create({ title: "Test", options: ["Yes", "No"], createdByUserId: 1 });

  await assert.rejects(service.create(poll.id, 1, -1), /option/i);
});

test("rejects invalid optionIndex (out of bounds)", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  const poll = await pollRepo.create({ title: "Test", options: ["Yes", "No"], createdByUserId: 1 });

  await assert.rejects(service.create(poll.id, 1, 2), /option/i);
  await assert.rejects(service.create(poll.id, 1, 10), /option/i);
});

test("rejects duplicate vote (same user, same poll)", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  const poll = await pollRepo.create({ title: "Test", options: ["Yes", "No"], createdByUserId: 1 });

  await service.create(poll.id, 1, 0);
  await assert.rejects(service.create(poll.id, 1, 1), /already voted/i);
});

test("creates a vote with valid pollId, userId, and optionIndex", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  const poll = await pollRepo.create({ title: "Test", options: ["Yes", "No", "Maybe"], createdByUserId: 1 });

  const vote = await service.create(poll.id, 5, 1);

  assert.ok(vote.id, "created vote should have an id");
  assert.equal(vote.pollId, poll.id);
  assert.equal(vote.userId, 5);
  assert.equal(vote.optionIndex, 1);
});

test("allows different users to vote on the same poll", async () => {
  const pollRepo = makeInMemoryPollRepository();
  const voteRepo = makeInMemoryVoteRepository();
  const service = createVoteService({ voteRepository: voteRepo, pollRepository: pollRepo });

  const poll = await pollRepo.create({ title: "Test", options: ["Yes", "No"], createdByUserId: 1 });

  const vote1 = await service.create(poll.id, 1, 0);
  const vote2 = await service.create(poll.id, 2, 1);

  assert.equal(vote1.userId, 1);
  assert.equal(vote2.userId, 2);
  assert.equal(vote1.pollId, poll.id);
  assert.equal(vote2.pollId, poll.id);
});


import test from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";

import { createPollService } from "../../src/service/pollService.js";
import { createVoteService } from "../../src/service/voteService.js";
import { createInMemoryPollRepository } from "../../src/db/pollRepository.js";
import { createInMemoryVoteRepository } from "../../src/db/voteRepository.js";
import { createPollBusiness } from "../../src/business/pollBusiness.js";
import { createPollsApi } from "../../src/api/polls.js";

function randomAlphaNum(len = 8) {
  return faker.string.alphanumeric({ length: len, casing: "mixed" }).replace(/[^A-Za-z0-9]/g, "A");
}

function makeApi() {
  const pollRepository = createInMemoryPollRepository();
  const voteRepository = createInMemoryVoteRepository();
  const pollService = createPollService({ pollRepository });
  const voteService = createVoteService({ voteRepository, pollRepository });
  const business = createPollBusiness({ pollService, voteService, voteRepository, pollRepository });
  const api = createPollsApi({ business });
  return { api };
}

test("POST /polls creates a poll and returns 201", async () => {
  const { api } = makeApi();
  const body = {
    title: `${randomAlphaNum(5)} ${randomAlphaNum(5)}`,
    options: [randomAlphaNum(4), randomAlphaNum(4)],
    createdByUserId: 1,
  };
  const res = await api.createPoll({ body });
  assert.equal(res.status, 201);
  assert.ok(res.body.id);
  assert.equal(res.body.title, body.title);
});

test("POST /polls/:id/votes creates a vote and returns 201", async () => {
  const { api } = makeApi();
  const createRes = await api.createPoll({ body: { title: "Test", options: ["Yes","No"], createdByUserId: 1 } });
  const pollId = createRes.body.id;
  const voteRes = await api.voteOnPoll({ params: { id: String(pollId) }, body: { userId: 2, optionIndex: 1 } });
  assert.equal(voteRes.status, 201);
  assert.equal(voteRes.body.pollId, pollId);
  assert.equal(voteRes.body.userId, 2);
  assert.equal(voteRes.body.optionIndex, 1);
});

test("GET /polls/:id/results returns counts", async () => {
  const { api } = makeApi();
  const { body: poll } = await api.createPoll({ body: { title: "Weekend Plan", options: ["Stay In","Go Out"], createdByUserId: 1 } });
  await api.voteOnPoll({ params: { id: String(poll.id) }, body: { userId: 1, optionIndex: 0 } });
  await api.voteOnPoll({ params: { id: String(poll.id) }, body: { userId: 2, optionIndex: 0 } });
  await api.voteOnPoll({ params: { id: String(poll.id) }, body: { userId: 3, optionIndex: 1 } });
  const res = await api.getResults({ params: { id: String(poll.id) } });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.counts, [2,1]);
  assert.equal(res.body.total, 3);
});



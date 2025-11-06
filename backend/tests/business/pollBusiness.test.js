import test from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";

import { createPollService } from "../../src/service/pollService.js";
import { createVoteService } from "../../src/service/voteService.js";
import { createInMemoryPollRepository } from "../../src/db/pollRepository.js";
import { createInMemoryVoteRepository } from "../../src/db/voteRepository.js";
import { createPollBusiness } from "../../src/business/pollBusiness.js";

function randomAlphaNum(len = 8) {
  return faker.string.alphanumeric({ length: len, casing: "mixed" }).replace(/[^A-Za-z0-9]/g, "A");
}

function makeDeps() {
  const pollRepository = createInMemoryPollRepository();
  const voteRepository = createInMemoryVoteRepository();
  const pollService = createPollService({ pollRepository });
  const voteService = createVoteService({ voteRepository, pollRepository });
  const business = createPollBusiness({ pollService, voteService, voteRepository, pollRepository });
  return { pollRepository, voteRepository, pollService, voteService, business };
}

test("creates a poll and returns its id", async () => {
  const { business } = makeDeps();
  const title = `${randomAlphaNum(5)} ${randomAlphaNum(5)}`;
  const options = [randomAlphaNum(4), randomAlphaNum(4)];
  const createdByUserId = 1;

  const poll = await business.createPoll({ title, options, createdByUserId });
  assert.ok(poll.id);
  assert.equal(poll.title, title);
  assert.deepEqual(poll.options, options);
  assert.equal(poll.createdByUserId, createdByUserId);
});

test("aggregates simple results (vote counts per option)", async () => {
  const { business } = makeDeps();
  const title = `${randomAlphaNum(5)} ${randomAlphaNum(5)}`;
  const options = ["Yes", "No", "Maybe"]; // simple known labels
  const creator = 10;
  const poll = await business.createPoll({ title, options, createdByUserId: creator });

  await business.vote({ pollId: poll.id, userId: 1, optionIndex: 0 });
  await business.vote({ pollId: poll.id, userId: 2, optionIndex: 1 });
  await business.vote({ pollId: poll.id, userId: 3, optionIndex: 0 });

  const results = await business.getResults(poll.id);

  assert.deepEqual(results.counts, [2, 1, 0]);
  assert.equal(results.total, 3);
});



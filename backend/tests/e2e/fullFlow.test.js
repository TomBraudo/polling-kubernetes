import test from "node:test";
import assert from "node:assert/strict";
import { faker } from "@faker-js/faker";

import { createUserService } from "../../src/service/userService.js";
import { createPollService } from "../../src/service/pollService.js";
import { createVoteService } from "../../src/service/voteService.js";
import { createInMemoryPollRepository } from "../../src/db/pollRepository.js";
import { createInMemoryVoteRepository } from "../../src/db/voteRepository.js";
import { createPollBusiness } from "../../src/business/pollBusiness.js";
import { createPollsApi } from "../../src/api/polls.js";

function makeInMemoryUserRepository() {
  const byUsername = new Map();
  return {
    findByUsername(username) {
      return byUsername.get(username) || null;
    },
    create(user) {
      if (byUsername.has(user.username)) {
        throw new Error("User already exists");
      }
      const saved = { id: byUsername.size + 1, ...user };
      byUsername.set(saved.username, saved);
      return saved;
    },
    _clear() {
      byUsername.clear();
    },
  };
}

function alnum(len = 8) {
  return faker.string.alphanumeric({ length: len, casing: "mixed" }).replace(/[^A-Za-z0-9]/g, "A");
}

test("full e2e flow: users → create poll → votes → results", async () => {
  // Repositories
  const userRepository = makeInMemoryUserRepository();
  const pollRepository = createInMemoryPollRepository();
  const voteRepository = createInMemoryVoteRepository();

  // Services
  const userService = createUserService({ userRepository });
  const pollService = createPollService({ pollRepository });
  const voteService = createVoteService({ voteRepository, pollRepository });

  // Business and API
  const business = createPollBusiness({ pollService, voteService, voteRepository, pollRepository });
  const api = createPollsApi({ business });

  // Create users
  const u1 = await userService.loginOrCreate(alnum(6));
  const u2 = await userService.loginOrCreate(alnum(6));
  assert.ok(u1.id && u2.id);

  // Create poll via API
  const createRes = await api.createPoll({ body: { title: `${alnum(5)} ${alnum(5)}`, options: ["Yes", "No", "Maybe"], createdByUserId: u1.id } });
  assert.equal(createRes.status, 201);
  const poll = createRes.body;
  assert.ok(poll.id);

  // Votes via API
  const v1 = await api.voteOnPoll({ params: { id: String(poll.id) }, body: { userId: u1.id, optionIndex: 0 } });
  const v2 = await api.voteOnPoll({ params: { id: String(poll.id) }, body: { userId: u2.id, optionIndex: 1 } });
  assert.equal(v1.status, 201);
  assert.equal(v2.status, 201);

  // Results via API
  const resultsRes = await api.getResults({ params: { id: String(poll.id) } });
  assert.equal(resultsRes.status, 200);
  assert.deepEqual(resultsRes.body.counts, [1, 1, 0]);
  assert.equal(resultsRes.body.total, 2);
});



import test from "node:test";
import assert from "node:assert/strict";

import { createPollService } from "../../src/service/pollService.js";

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

test("rejects polls with fewer than 2 options", async () => {
  const repo = makeInMemoryPollRepository();
  const service = createPollService({ pollRepository: repo });

  await assert.rejects(service.create("MyPoll", ["Yes"], 1))
});

test("rejects polls with more than 6 options", async () => {
  const repo = makeInMemoryPollRepository();
  const service = createPollService({ pollRepository: repo });

  const opts = ["A","B","C","D","E","F","G"];
  await assert.rejects(service.create("MyPoll", opts, 1));
});

test("rejects non-alphanumeric title (but spaces are allowed)", async () => {
  const repo = makeInMemoryPollRepository();
  const service = createPollService({ pollRepository: repo });

  for (const badTitle of ["poll!", "_poll_", "poll-1"]) {
    await assert.rejects(service.create(badTitle, ["Yes","No"], 1), /alphanumeric/i, badTitle);
  }
});

test("rejects options containing non-alphanumeric characters (but spaces are allowed)", async () => {
  const repo = makeInMemoryPollRepository();
  const service = createPollService({ pollRepository: repo });

  const badOptionsSets = [
    ["Yes", "No!"],
    ["Opt_1", "Opt2"],
    ["-A-", "B"]
  ];

  for (const options of badOptionsSets) {
    await assert.rejects(service.create("ValidTitle", options, 1), /alphanumeric/i, String(options));
  }
});

test("creates a poll with valid title and 2-6 valid options", async () => {
  const repo = makeInMemoryPollRepository();
  const service = createPollService({ pollRepository: repo });

  const title = "WeekendPlan";
  const options = ["StayIn", "GoOut", "Workout"];
  const poll = await service.create(title, options, 42);

  assert.ok(poll.id, "created poll should have an id");
  assert.equal(poll.title, title);
  assert.deepEqual(poll.options, options);
  assert.equal(poll.createdByUserId, 42);
});

test("allows spaces in title and options", async () => {
  const repo = makeInMemoryPollRepository();
  const service = createPollService({ pollRepository: repo });

  const title = "My Weekend Plans";
  const options = ["Stay In", "Go Out", "Work Out"];
  const poll = await service.create(title, options, 7);

  assert.ok(poll.id);
  assert.equal(poll.title, title);
  assert.deepEqual(poll.options, options);
  assert.equal(poll.createdByUserId, 7);
});

test("rejects invalid createdByUserId", async () => {
  const repo = makeInMemoryPollRepository();
  const service = createPollService({ pollRepository: repo });

  for (const bad of [null, undefined, 0, -1, NaN, "1", 1.5]) {
    await assert.rejects(service.create("Valid Title", ["Yes","No"], bad), /createdBy/i, String(bad));
  }
});



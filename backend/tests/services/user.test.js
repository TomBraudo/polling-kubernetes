import test from "node:test";
import assert from "node:assert/strict";

// The service is expected to be implemented later with this API:
//   createUserService({ userRepository }) => { loginOrCreate(username), validateUsername(username) }
// The repository is an injected dependency with methods: findByUsername(username), create(user)
import { createUserService } from "../../src/service/userService.js";

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

test("rejects usernames shorter than 4 characters", async () => {
  const repo = makeInMemoryUserRepository();
  const service = createUserService({ userRepository: repo });

  assert.throws(() => service.validateUsername("abc"), /length/i);
  await assert.rejects(service.loginOrCreate("abc"));
});

test("rejects usernames longer than 12 characters", async () => {
  const repo = makeInMemoryUserRepository();
  const service = createUserService({ userRepository: repo });

  const longName = "a".repeat(13);
  assert.throws(() => service.validateUsername(longName), /length/i);
  await assert.rejects(service.loginOrCreate(longName));
});

test("rejects usernames with non-alphanumeric characters", async () => {
  const repo = makeInMemoryUserRepository();
  const service = createUserService({ userRepository: repo });

  for (const bad of ["john_doe", "mary!", " ann ", "éclair", "name-1"]) {
    assert.throws(() => service.validateUsername(bad), /alphanumeric/i, bad);
    await assert.rejects(service.loginOrCreate(bad));
  }
});

test("creates a new user on first login when user does not exist", async () => {
  const repo = makeInMemoryUserRepository();
  const service = createUserService({ userRepository: repo });

  const username = "john1234";
  const user = await service.loginOrCreate(username);

  assert.equal(user.username, username);
  assert.ok(user.id, "newly created user should have an id");
});

test("returns the existing user on subsequent logins", async () => {
  const repo = makeInMemoryUserRepository();
  const service = createUserService({ userRepository: repo });

  const username = "mary0001";
  const first = await service.loginOrCreate(username);
  const second = await service.loginOrCreate(username);

  assert.equal(second.id, first.id);
  assert.equal(second.username, first.username);
});



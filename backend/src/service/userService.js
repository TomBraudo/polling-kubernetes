import { isValidUsername, createUser } from "../models/user.js";

export function createUserService({ userRepository }) {
  function validateUsername(username) {
    if (typeof username !== "string") {
      throw new Error("Username must be alphanumeric");
    }
    const length = username.length;
    if (length < 4 || length > 12) {
      throw new Error("Username length must be 4-12 characters");
    }
    if (!/^[A-Za-z0-9]+$/.test(username)) {
      throw new Error("Username must be alphanumeric");
    }
    return true;
  }

  async function loginOrCreate(username) {
    validateUsername(username);

    const existing = await Promise.resolve(
      userRepository.findByUsername(username)
    );
    if (existing) return existing;

    const user = createUser({ username });
    const saved = await Promise.resolve(userRepository.create(user));
    return saved;
  }

  return { validateUsername, loginOrCreate };
}

export default { createUserService };



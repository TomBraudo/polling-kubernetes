// User model and validation

export const MIN_USERNAME_LENGTH = 4;
export const MAX_USERNAME_LENGTH = 12;
const USERNAME_REGEX = /^[A-Za-z0-9]+$/;

export function isValidUsername(username) {
  if (typeof username !== "string") return false;
  const length = username.length;
  if (length < MIN_USERNAME_LENGTH || length > MAX_USERNAME_LENGTH) return false;
  return USERNAME_REGEX.test(username);
}

export function createUser({ username }) {
  if (!isValidUsername(username)) {
    throw new Error("Invalid username");
  }
  return { username };
}



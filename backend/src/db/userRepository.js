// In-memory User repository

export function createInMemoryUserRepository() {
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

export default { createInMemoryUserRepository };


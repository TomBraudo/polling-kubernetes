// In-memory Vote repository

export function createInMemoryVoteRepository() {
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
    findByPollId(pollId) {
      const results = [];
      for (const v of byId.values()) {
        if (v.pollId === pollId) results.push(v);
      }
      return results;
    },
    _clear() {
      byId.clear();
      byPollAndUser.clear();
      nextId = 1;
    },
  };
}

export default { createInMemoryVoteRepository };


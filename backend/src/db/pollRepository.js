// In-memory Poll repository

export function createInMemoryPollRepository() {
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
    findAll() {
      return Array.from(byId.values());
    },
    findAllByUserId(userId) {
      const results = [];
      for (const p of byId.values()) {
        if (p.createdByUserId === userId) results.push(p);
      }
      return results;
    },
    _clear() {
      byId.clear();
      nextId = 1;
    },
  };
}

export default { createInMemoryPollRepository };



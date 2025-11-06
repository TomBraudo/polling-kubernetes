import { createPoll } from "../models/poll.js";

export function createPollService({ pollRepository }) {
  async function create(title, options, createdByUserId) {
    const poll = createPoll({ title, options, createdByUserId });
    const saved = await Promise.resolve(pollRepository.create(poll));
    return saved;
  }

  async function getAll() {
    return await Promise.resolve(pollRepository.findAll());
  }

  async function getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid poll id");
    }
    const poll = await Promise.resolve(pollRepository.findById(id));
    if (!poll) {
      throw new Error("Poll not found");
    }
    return poll;
  }

  async function getByUserId(userId) {
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user id");
    }
    return await Promise.resolve(pollRepository.findAllByUserId(userId));
  }

  return { create, getAll, getById, getByUserId };
}

export default { createPollService };



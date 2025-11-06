import { createVote, validateVoteInput } from "../models/vote.js";

export function createVoteService({ voteRepository, pollRepository }) {
  async function create(pollId, userId, optionIndex) {
    // Validate inputs first before any repository operations
    validateVoteInput(pollId, userId, optionIndex);

    const poll = await Promise.resolve(pollRepository.findById(pollId));
    if (!poll) {
      throw new Error("Poll not found");
    }
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      throw new Error("Invalid optionIndex for this poll");
    }

    const existing = await Promise.resolve(
      voteRepository.findByPollAndUser(pollId, userId)
    );
    if (existing) {
      throw new Error("User has already voted on this poll");
    }

    const vote = createVote({ pollId, userId, optionIndex });
    const saved = await Promise.resolve(voteRepository.create(vote));
    return saved;
  }

  async function getUserVote(pollId, userId) {
    if (!Number.isInteger(pollId) || pollId <= 0) {
      throw new Error("Invalid poll id");
    }
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error("Invalid user id");
    }
    return await Promise.resolve(voteRepository.findByPollAndUser(pollId, userId));
  }

  async function getPollVotes(pollId) {
    if (!Number.isInteger(pollId) || pollId <= 0) {
      throw new Error("Invalid poll id");
    }
    return await Promise.resolve(voteRepository.findByPollId(pollId));
  }

  return { create, getUserVote, getPollVotes };
}

export default { createVoteService };


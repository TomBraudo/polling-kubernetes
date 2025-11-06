// Vote model and validation

export function validateVoteInput(pollId, userId, optionIndex) {
  if (!Number.isInteger(pollId) || pollId <= 0) {
    throw new Error("pollId must be a positive integer");
  }
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("userId must be a positive integer");
  }
  if (!Number.isInteger(optionIndex) || optionIndex < 0) {
    throw new Error("optionIndex must be a non-negative integer");
  }
}

export function createVote({ pollId, userId, optionIndex }) {
  validateVoteInput(pollId, userId, optionIndex);
  return { pollId, userId, optionIndex };
}


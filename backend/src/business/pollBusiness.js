// Business layer for polls: coordinates services and simple aggregations

export function createPollBusiness({ pollService, voteService, voteRepository, pollRepository }) {
  async function createPoll({ title, options, createdByUserId }) {
    return await pollService.create(title, options, createdByUserId);
  }

  async function getAllPolls() {
    return await pollService.getAll();
  }

  async function getPoll(id) {
    return await pollService.getById(id);
  }

  async function getPollsByUser(userId) {
    return await pollService.getByUserId(userId);
  }

  async function vote({ pollId, userId, optionIndex }) {
    return await voteService.create(pollId, userId, optionIndex);
  }

  async function getUserVote(pollId, userId) {
    return await voteService.getUserVote(pollId, userId);
  }

  async function getPollVotes(pollId) {
    return await voteService.getPollVotes(pollId);
  }

  async function getResults(pollId) {
    const poll = await Promise.resolve(pollRepository.findById(pollId));
    if (!poll) throw new Error("Poll not found");
    const votes = await Promise.resolve(voteRepository.findByPollId(pollId));
    const counts = Array.from({ length: poll.options.length }, () => 0);
    for (const v of votes) {
      if (v.optionIndex >= 0 && v.optionIndex < counts.length) counts[v.optionIndex]++;
    }
    const total = votes.length;
    return { pollId, counts, total };
  }

  return { createPoll, getAllPolls, getPoll, getPollsByUser, vote, getUserVote, getPollVotes, getResults };
}

// HTTP helpers: parse raw HTTP shapes and delegate to clean functions
export function createPollBusinessHttp({ pollService, voteService, voteRepository, pollRepository }) {
  const core = createPollBusiness({ pollService, voteService, voteRepository, pollRepository });

  async function createPollFromHttp({ bodyRaw }) {
    let body;
    try {
      body = bodyRaw ? JSON.parse(bodyRaw) : {};
    } catch {
      throw new Error("Invalid JSON");
    }
    const { title, options, createdByUserId } = body || {};
    return await core.createPoll({ title, options, createdByUserId });
  }

  async function voteFromHttp({ params, bodyRaw }) {
    let body;
    try {
      body = bodyRaw ? JSON.parse(bodyRaw) : {};
    } catch {
      throw new Error("Invalid JSON");
    }
    const pollId = Number(params?.id);
    const { userId, optionIndex } = body || {};
    return await core.vote({ pollId, userId, optionIndex });
  }

  async function getResultsFromHttp({ params }) {
    const pollId = Number(params?.id);
    return await core.getResults(pollId);
  }

  async function getAllPollsFromHttp() {
    return await core.getAllPolls();
  }

  async function getPollFromHttp({ params }) {
    const pollId = Number(params?.id);
    return await core.getPoll(pollId);
  }

  async function getUserVoteFromHttp({ params, query }) {
    const pollId = Number(params?.id);
    const userId = Number(query?.userId);
    if (!userId) throw new Error("userId query parameter required");
    return await core.getUserVote(pollId, userId);
  }

  async function getPollVotesFromHttp({ params }) {
    const pollId = Number(params?.id);
    return await core.getPollVotes(pollId);
  }

  async function getPollsByUserFromHttp({ params }) {
    const userId = Number(params?.id);
    return await core.getPollsByUser(userId);
  }

  return {
    ...core,
    createPollFromHttp,
    voteFromHttp,
    getResultsFromHttp,
    getAllPollsFromHttp,
    getPollFromHttp,
    getUserVoteFromHttp,
    getPollVotesFromHttp,
    getPollsByUserFromHttp,
  };
}

export default { createPollBusiness };



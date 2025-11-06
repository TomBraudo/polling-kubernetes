// API client for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface User {
  id: number;
  username: string;
}

export interface Poll {
  id: number;
  title: string;
  options: string[];
  createdByUserId: number;
}

export interface Vote {
  id: number;
  pollId: number;
  userId: number;
  optionIndex: number;
}

export interface PollResults {
  pollId: number;
  counts: number[];
  total: number;
}

export interface UserVoteStatus {
  hasVoted: boolean;
  vote?: Vote;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  async login(username: string): Promise<User> {
    return request<User>("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  async createPoll(title: string, options: string[], createdByUserId: number): Promise<Poll> {
    return request<Poll>("/api/polls", {
      method: "POST",
      body: JSON.stringify({ title, options, createdByUserId }),
    });
  },

  async voteOnPoll(pollId: number, userId: number, optionIndex: number): Promise<Vote> {
    return request<Vote>(`/api/polls/${pollId}/votes`, {
      method: "POST",
      body: JSON.stringify({ userId, optionIndex }),
    });
  },

  async getPollResults(pollId: number): Promise<PollResults> {
    return request<PollResults>(`/api/polls/${pollId}/results`);
  },

  async getAllPolls(): Promise<Poll[]> {
    return request<Poll[]>("/api/polls");
  },

  async getPoll(id: number): Promise<Poll> {
    return request<Poll>(`/api/polls/${id}`);
  },

  async getUserVote(pollId: number, userId: number): Promise<UserVoteStatus> {
    return request<UserVoteStatus>(`/api/polls/${pollId}/votes?userId=${userId}`);
  },

  async getPollsByUser(userId: number): Promise<Poll[]> {
    return request<Poll[]>(`/api/polls?createdByUserId=${userId}`);
  },
};


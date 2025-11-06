// PollCard: displays a single poll with voting UI

import { useState, useEffect } from "react";
import { api, Poll, PollResults } from "../../api/client";
import VoteButton from "./VoteButton";
import PollResultsDisplay from "./PollResultsDisplay";

interface PollCardProps {
  poll: Poll;
  userId: number;
}

export default function PollCard({ poll, userId }: PollCardProps) {
  const [results, setResults] = useState<PollResults | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [poll.id, userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load results and check if user has voted in parallel
      const [resultsData, voteStatus] = await Promise.all([
        api.getPollResults(poll.id),
        api.getUserVote(poll.id, userId),
      ]);
      setResults(resultsData);
      setHasVoted(voteStatus.hasVoted);
    } catch (err) {
      console.error("Failed to load poll data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (optionIndex: number) => {
    if (hasVoted || voting) return;
    try {
      setVoting(true);
      await api.voteOnPoll(poll.id, userId, optionIndex);
      setHasVoted(true);
      await loadData(); // Refresh results and vote status after voting
    } catch (err) {
      if (err instanceof Error && err.message.includes("already voted")) {
        setHasVoted(true);
        alert("You have already voted on this poll");
      } else {
        alert(`Failed to vote: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{poll.title}</h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Voting options */}
          {!hasVoted ? (
            <div className="space-y-2 mb-4">
              {poll.options.map((option, index) => (
                <VoteButton
                  key={index}
                  option={option}
                  index={index}
                  onClick={() => handleVote(index)}
                  disabled={voting}
                />
              ))}
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">You have voted on this poll</p>
            </div>
          )}

          {/* Results */}
          {results && <PollResultsDisplay poll={poll} results={results} />}
        </>
      )}
    </div>
  );
}

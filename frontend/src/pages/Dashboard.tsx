// Dashboard page: displays all polls

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { api, Poll } from "../api/client";
import Header from "../components/layout/Header";
import PollCard from "../components/polls/PollCard";
import CreatePollModal from "../components/polls/CreatePollModal";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadPolls();
  }, [user, navigate]);

  const loadPolls = async () => {
    try {
      setFetching(true);
      const allPolls = await api.getAllPolls();
      setPolls(allPolls);
    } catch (err) {
      console.error("Failed to load polls:", err);
      alert(`Failed to load polls: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setFetching(false);
    }
  };

  const handleCreatePoll = async (title: string, options: string[]) => {
    if (!user) return;
    try {
      setLoading(true);
      const newPoll = await api.createPoll(title, options, user.id);
      setPolls((prev) => [newPoll, ...prev]);
      setIsCreateModalOpen(false);
    } catch (err) {
      alert(`Failed to create poll: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create poll button */}
        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create New Poll
          </button>
        </div>

        {/* Polls grid */}
        {fetching ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading polls...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No polls yet. Create your first poll!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} userId={user.id} />
            ))}
          </div>
        )}
      </main>

      {/* Create poll modal */}
      {isCreateModalOpen && (
        <CreatePollModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreatePoll}
          loading={loading}
        />
      )}
    </div>
  );
}

// Profile page: displays user's created polls

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { api, Poll } from "../api/client";
import Header from "../components/layout/Header";
import PollCard from "../components/polls/PollCard";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadUserPolls();
  }, [user, navigate]);

  const loadUserPolls = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userPolls = await api.getPollsByUser(user.id);
      setPolls(userPolls);
    } catch (err) {
      console.error("Failed to load user polls:", err);
      alert(`Failed to load your polls: ${err instanceof Error ? err.message : "Unknown error"}`);
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Polls</h2>
          <p className="text-gray-600 mt-1">Polls you've created</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading your polls...</p>
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't created any polls yet.</p>
            <p className="text-gray-400 text-sm mt-2">Go to Dashboard to create your first poll!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} userId={user.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


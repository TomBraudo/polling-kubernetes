// Login page: user authentication

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { api } from "../api/client";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  function isValid(u: string) {
    return /^[A-Za-z0-9]{4,12}$/.test(u);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValid(username)) {
      setError("Username must be 4-12 alphanumeric characters");
      return;
    }

    try {
      setLoading(true);
      const user = await api.login(username);
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in with your username</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. john1234"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

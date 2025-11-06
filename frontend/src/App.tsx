// App: main routing component

import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

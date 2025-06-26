// routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (user) {
    if (user.role === "ADMIN") return <Navigate to="/admin" />;
    if (user.role === "USER") return <Navigate to="/user" />;
    if (user.role === "VERIFIER") return <Navigate to="/verifier" />;
    return <Navigate to="/" />;
  }

  return children;
}

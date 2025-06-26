import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // Jika belum login, arahkan ke /login
  if (!user) return <Navigate to="/login" replace />;

  // Jika login tapi tidak punya role yang diizinkan, arahkan ke route sesuai role-nya
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "VERIFIER":
        return <Navigate to="/verifier" replace />;
      case "USER":
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}

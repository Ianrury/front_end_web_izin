import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerifierDashboard from "./pages/verifier/VerifierDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import AdminUsers from "./pages/admin/AdminUsers";
import PermissionsPage from "./pages/admin/AdminPermissions";
import ProfilePage from "./pages/profile";
import KaryawanPage from "./pages/user/UserKaryawan";
import InboxPage from "./pages/user/UserInbox";
import AkunPage from "./pages/user/UserAkun";
import EditAkunPage from "./pages/user/UserEditAkun";
import WorkInfoPage from "./pages/user/UserWorkInfo";
import EditPasswordPage from "./pages/user/EditPasswordPage";
import VerifierPermissions from "./pages/verifier/VerifierPermissions";
import VerifierUsers from "./pages/verifier/VerifierUsers";
import PublicRoute from "./routes/PublicRoute";
import AdminCreateUser from "./pages/admin/AdminCreateUser";
import AjukanIzinPage from "./pages/user/AjukanIzin";
import AjukanIzinForm from "./pages/user/AjukanIzin";
import ListIzin from "./pages/user/ListIzin";
import DetailIzin from "./pages/user/DetailIzin";
import VerifierDetailIzin from "./pages/verifier/VerifierDetailIzin";
import AdminDetailIzin from "./pages/admin/AdminDetailIzin";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          {/* Role-protected routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard /> {/* ini hanya layout/dashboard utama */}
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/kelola-user"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/kelola-izin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <PermissionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create-user"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminCreateUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["ADMIN", "VERIFIER"]}>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/izin-detail/:id"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminDetailIzin />
              </PrivateRoute>
            }
          />
          <Route
            path="/verifier"
            element={
              <PrivateRoute allowedRoles={["VERIFIER"]}>
                <VerifierDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/verifier/kelola-izin"
            element={
              <PrivateRoute allowedRoles={["VERIFIER"]}>
                <VerifierPermissions />
              </PrivateRoute>
            }
          />
          <Route
            path="/verifier/kelola-user"
            element={
              <PrivateRoute allowedRoles={["VERIFIER"]}>
                <VerifierUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/verifier/izin-detail/:id"
            element={
              <PrivateRoute allowedRoles={["VERIFIER"]}>
                <VerifierDetailIzin />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/karyawan"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <KaryawanPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/inbox"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <InboxPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/inbox"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <AkunPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/edit-akun"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <EditAkunPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/work-info"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <WorkInfoPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/edit-password"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <EditPasswordPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/ajukan-izin"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <AjukanIzinForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/akun"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <AkunPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/riwayat-izin"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <ListIzin />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/detail-izin/:id"
            element={
              <PrivateRoute allowedRoles={["USER"]}>
                <DetailIzin />
              </PrivateRoute>
            }
          />
          {/* Default route */}
          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

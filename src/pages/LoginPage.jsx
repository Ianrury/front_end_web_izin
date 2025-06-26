import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../services/auth.api";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Card from "../components/Card";
import { Mail, Lock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import useToast from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import Button from "../components/Buttton";

export default function LoginPage() {
  const { toasts, hideToast, showSuccess, showDanger, showWarning } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  // Add error handling for useAuth and useNavigate
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email wajib diisi";
    if (!emailRegex.test(email)) return "Format email tidak valid";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password wajib diisi";
    return "";
  };

  // Real-time validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setGeneralError("");

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setLoading(true);

    try {
      const { user } = await login({ email, password });
      setUser(user);

      if (user.role.name === "ADMIN") {
        navigate("/admin");
      } else if (user.role.name === "USER") {
        navigate("/user");
      } else if (user.role.name === "VERIFIER") {
        navigate("/verifier/kelola-user");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err?.response?.data?.error || "Terjadi kesalahan saat login";
      showDanger(errorMessage, {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Login | Aplikasi Izin</title>
        <meta name="description" content="Halaman login pengguna aplikasi pengajuan izin" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang</h1>
              <p className="text-gray-600">Masuk ke akun Anda</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <Alert type="error" message={generalError} onClose={() => setGeneralError("")} />

              <Input type="email" placeholder="Email" value={email} onChange={handleEmailChange} icon={Mail} error={errors.email} required disabled={loading} />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                icon={Lock}
                error={errors.password}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
                disabled={loading}
              />

              <div className="text-right">
                <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors" disabled={loading}>
                  Lupa password?
                </button>
              </div>

              <Button type="submit" loading={loading} disabled={loading} onClick={handleLogin}>
                {loading ? "Sedang masuk..." : "Masuk"}
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Belum punya akun?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
      <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
    </div>
  );
}

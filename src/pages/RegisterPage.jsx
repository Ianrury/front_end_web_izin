import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { register } from "../services/auth.api";
import Input from "../components/Input";
import Alert from "../components/Alert";
import Card from "../components/Card";
import { User, Mail, Lock } from "lucide-react";
import Button from "../components/Buttton";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import useToast from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toasts, hideToast, showSuccess, showDanger, showWarning } = useToast();
  const { setUser } = useAuth();

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return "Username wajib diisi";
    if (username.length < 3) return "Username minimal 3 karakter";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username hanya boleh berisi huruf, angka, dan underscore";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email wajib diisi";
    if (!emailRegex.test(email)) return "Format email tidak valid";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password wajib diisi";
    if (password.length < 6) return "Password minimal 6 karakter";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password harus mengandung huruf besar, kecil, dan angka";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Konfirmasi password wajib diisi";
    if (confirmPassword !== password) return "Password tidak cocok";
    return "";
  };

  // Real-time validation handlers
  const handleInputChange = (field, value) => {
    if (field === "confirmPassword") {
      setConfirmPassword(value);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value, form.password),
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));

      let error = "";
      switch (field) {
        case "username":
          error = validateUsername(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          // Also revalidate confirm password if it exists
          if (confirmPassword) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: validateConfirmPassword(confirmPassword, value),
            }));
          }
          break;
        default:
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setGeneralError("");

    // Validate all fields
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, form.password);

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setLoading(true);

    try {
      const { user } = await register(form);
      setUser(user);
      showSuccess("Berhasil membuat akun Silahkan Menunggu Verifikasi Admin", { duration: 4000 });
      // ksosngan inputan 
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      showDanger(err.response?.data?.error, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Daftar Akun | Aplikasi Izin</title>
        <meta name="description" content="Halaman registrasi pengguna aplikasi pengajuan izin" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h1>
              <p className="text-gray-600">Bergabunglah dengan kami</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <Alert type="error" message={generalError} onClose={() => setGeneralError("")} />

              <Input type="text" placeholder="Username" value={form.username} onChange={(e) => handleInputChange("username", e.target.value)} icon={User} error={errors.username} required disabled={loading} />

              <Input type="email" placeholder="Email" value={form.email} onChange={(e) => handleInputChange("email", e.target.value)} icon={Mail} error={errors.email} required disabled={loading} />

              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                icon={Lock}
                error={errors.password}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
                disabled={loading}
              />

              <Input
                type="password"
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                icon={Lock}
                error={errors.confirmPassword}
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                required
                disabled={loading}
              />

              <Button type="submit" loading={loading} disabled={loading} onClick={handleRegister}>
                {loading ? "Sedang mendaftar..." : "Daftar"}
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Masuk sekarang
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

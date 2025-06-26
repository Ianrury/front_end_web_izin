import React, { useState, useMemo, useCallback } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import CustomHelmet from "../../components/CustomHelmet";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import { ubahPassword } from "../../services/user.api";
import useToast from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import PasswordInput from "../../components/PasswordInput";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator";
import { Link } from "react-router-dom";

const EditPasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toasts, hideToast, showSuccess, showDanger } = useToast();

  const passwordStrength = useMemo(() => {
    const password = formData.newPassword;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { score, checks };
  }, [formData.newPassword]);

  const getPasswordStrengthText = useMemo(() => {
    const { score } = passwordStrength;
    if (score === 0) return { text: "Sangat Lemah", color: "text-red-700", bg: "bg-red-100" };
    if (score <= 2) return { text: "Lemah", color: "text-red-700", bg: "bg-red-100" };
    if (score === 3) return { text: "Sedang", color: "text-yellow-700", bg: "bg-yellow-100" };
    if (score === 4) return { text: "Kuat", color: "text-blue-700", bg: "bg-blue-100" };
    return { text: "Sangat Kuat", color: "text-green-700", bg: "bg-green-100" };
  }, [passwordStrength]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        if ((name === "confirmPassword" && value !== updated.newPassword) || (name === "newPassword" && updated.confirmPassword && value !== updated.confirmPassword)) {
          setErrors((err) => ({ ...err, confirmPassword: "Password konfirmasi tidak cocok" }));
        } else {
          setErrors((err) => ({ ...err, confirmPassword: "" }));
        }
        return updated;
      });

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = "Password saat ini harus diisi";
    if (!formData.newPassword) newErrors.newPassword = "Password baru harus diisi";
    else if (formData.newPassword.length < 8) newErrors.newPassword = "Password minimal 8 karakter";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Konfirmasi password harus diisi";
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Password konfirmasi tidak cocok";
    if (formData.currentPassword === formData.newPassword) newErrors.newPassword = "Password baru harus berbeda dari password saat ini";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await ubahPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showSuccess("Password berhasil diperbarui.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Terjadi kesalahan";

      if (error?.response?.status === 400 && msg.toLowerCase().includes("password")) {
        setErrors({ currentPassword: msg });
      } else {
        showDanger(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomHelmet title="Edit Password | Aplikasi Izin" description="Halaman untuk mengubah password akun Anda" />
      <UserLayout>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link to="/user">
                <button className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Edit Password</h1>
                <p className="text-blue-100 text-sm">Ubah password akun Anda</p>
              </div>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <PasswordInput
              label="Password Saat Ini"
              name="currentPassword"
              value={formData.currentPassword}
              show={showPassword.current}
              onToggle={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
              onChange={handleInputChange}
              error={errors.currentPassword}
              placeholder="Masukkan password saat ini"
            />
            <PasswordInput
              label="Password Baru"
              name="newPassword"
              value={formData.newPassword}
              show={showPassword.new}
              onToggle={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
              onChange={handleInputChange}
              error={errors.newPassword}
              placeholder="Masukkan password baru"
            />
            {formData.newPassword && <PasswordStrengthIndicator strength={passwordStrength} display={getPasswordStrengthText} />}
            <PasswordInput
              label="Konfirmasi Password Baru"
              name="confirmPassword"
              value={formData.confirmPassword}
              show={showPassword.confirm}
              onToggle={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Masukkan ulang password baru"
            />
            <div className="space-y-3">
              <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center space-x-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Shield className="w-5 h-5" />}
                <span>{isLoading ? "Mengubah Password..." : "Ubah Password"}</span>
              </button>
            </div>
          </div>
          <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
          <FooterNavigationUser activeTab="account" />
        </div>
      </UserLayout>
    </>
  );
};

export default EditPasswordPage;

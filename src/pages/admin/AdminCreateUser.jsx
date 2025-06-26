import React, { useState, useCallback } from "react";
import { User, Mail, Lock, Briefcase, Building, Users, Badge, Calendar, MapPin, UserCheck, Clock, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import useToast from "../../hooks/useToast";
import { CreateVerifier } from "../../services/admin.api";
import { ToastContainer } from "../../components/Toast";
import CustomHelmet from "../../components/CustomHelmet";

const AdminCreateUser = ({ navigate, currentPage = "users" }) => {
  const { toasts, hideToast, showSuccess, showDanger, showWarning } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    position: "",
    department: "",
    division: "",
    status: "Karyawan Tetap",
    level: "Staff",
    joinDate: "",
    location: "",
    supervisor: "",
    workHours: "09:00 - 17:00 WIB",
    workDays: "Senin - Jumat",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Memoized handlers to prevent re-rendering
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    },
    [errors]
  );

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password.trim()) newErrors.password = "Password wajib diisi";
    else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (!formData.position.trim()) newErrors.position = "Posisi wajib diisi";
    if (!formData.department.trim()) newErrors.department = "Department wajib diisi";
    if (!formData.division.trim()) newErrors.division = "Divisi wajib diisi";
    if (!formData.joinDate) newErrors.joinDate = "Tanggal bergabung wajib diisi";
    if (!formData.location.trim()) newErrors.location = "Lokasi wajib diisi";
    if (!formData.supervisor.trim()) newErrors.supervisor = "Supervisor wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showWarning("Mohon lengkapi semua field yang wajib diisi", { duration: 4000 });
      return;
    }

    setLoading(true);

    try {
      await CreateVerifier(formData);
      showSuccess("Data Berhasil disimpan.", { duration: 4000 });

      // Reset form after successful submission
      setFormData({
        username: "",
        email: "",
        password: "",
        position: "",
        department: "",
        division: "",
        status: "Karyawan Tetap",
        level: "Staff",
        joinDate: "",
        location: "",
        supervisor: "",
        workHours: "09:00 - 17:00 WIB",
        workDays: "Senin - Jumat",
      });

      // Optional: Navigate back to users list
      // navigate("/admin/users");
    } catch (error) {
      showDanger("Gagal menyimpan data. Silakan coba lagi.", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (navigate) {
      navigate("/admin/users");
    }
  };

  return (
    <AdminLayout navigate={navigate} currentPage={currentPage}>
      <CustomHelmet title="AdminVerifier | Aplikasi Izin" description="AdminVerifier Admin" />
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buat User Verifier Baru</h1>
              <p className="text-gray-600 mt-1">Tambahkan verifier baru untuk sistem absensi</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Informasi Personal</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.username ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan username"
                  />
                </div>
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Informasi Pekerjaan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posisi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Badge className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.position ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan posisi"
                  />
                </div>
                {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.department ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan department"
                  />
                </div>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Divisi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => handleInputChange("division", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.division ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan divisi"
                  />
                </div>
                {errors.division && <p className="mt-1 text-sm text-red-600">{errors.division}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Karyawan</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Karyawan Tetap">Karyawan Tetap</option>
                  <option value="Karyawan Kontrak">Karyawan Kontrak</option>
                  <option value="Karyawan Paruh Waktu">Karyawan Paruh Waktu</option>
                  <option value="Magang">Magang</option>
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Staff">Staff</option>
                  <option value="Senior Staff">Senior Staff</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Manager">Manager</option>
                  <option value="Senior Manager">Senior Manager</option>
                </select>
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Bergabung <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleInputChange("joinDate", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.joinDate ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.joinDate && <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Informasi Tambahan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.location ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan lokasi"
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              {/* Supervisor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supervisor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.supervisor}
                    onChange={(e) => handleInputChange("supervisor", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.supervisor ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Masukkan nama supervisor"
                  />
                </div>
                {errors.supervisor && <p className="mt-1 text-sm text-red-600">{errors.supervisor}</p>}
              </div>

              {/* Work Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jam Kerja</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={formData.workHours}
                    onChange={(e) => handleInputChange("workHours", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="08:00 - 16:00 WIB">08:00 - 16:00 WIB</option>
                    <option value="09:00 - 17:00 WIB">09:00 - 17:00 WIB</option>
                    <option value="10:00 - 18:00 WIB">10:00 - 18:00 WIB</option>
                    <option value="07:00 - 15:00 WIB">07:00 - 15:00 WIB</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Work Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hari Kerja</label>
                <select
                  value={formData.workDays}
                  onChange={(e) => handleInputChange("workDays", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Senin - Jumat">Senin - Jumat</option>
                  <option value="Senin - Sabtu">Senin - Sabtu</option>
                  <option value="Senin - Minggu">Senin - Minggu</option>
                  <option value="Shift">Shift</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleBack} className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Verifier</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
    </AdminLayout>
  );
};

export default AdminCreateUser;

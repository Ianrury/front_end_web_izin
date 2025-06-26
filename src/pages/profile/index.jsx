import { Calendar, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import CustomHelmet from "../../components/CustomHelmet";
import useToast from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import { detailProfile, ubahPassword } from "../../services/admin.api";

// Komponen terpisah agar tidak menyebabkan kehilangan fokus
const PasswordForm = ({ currentPassword, newPassword, confirmPassword, setCurrentPassword, setNewPassword, setConfirmPassword, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Ubah Password</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  </form>
);

const ProfilePage = ({ navigate }) => {
  const [user, setUser] = useState(false);
  const { toasts, hideToast, showSuccess, showDanger, showWarning } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "",
    employeeId: "",
    department: "",
    joinDate: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return showWarning("Semua kolom password harus diisi.", { duration: 3000 });
    }

    if (newPassword.length < 6) {
      return showWarning("Password baru minimal 6 karakter.", { duration: 3000 });
    }

    if (newPassword !== confirmPassword) {
      return showWarning("Konfirmasi password tidak cocok.", { duration: 3000 });
    }

    try {
      const payload = { currentPassword, newPassword };
      await ubahPassword(payload);
      showSuccess("Password berhasil diperbarui.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showDanger(error.response?.data?.error || "Gagal mengubah password.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await detailProfile();
        setUser(response || []);
      } catch (err) {
        showWarning("Gagal mengambil data user.");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        name: user.profile.user?.username || "",
        email: user.profile.user?.email || "",
        status: user.profile.status || "",
        employeeId: user.profile.employeeId || "",
        department: user.profile?.department || "",
        joinDate: user.profile?.joinDate ? user.profile.joinDate.split("T")[0] : "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    showSuccess("Perubahan disimpan (simulasi, belum kirim ke server)");
  };

  return (
    <AdminLayout navigate={navigate}>
      <CustomHelmet title="Profile | Aplikasi Izin" description="Kelola informasi profile Anda" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-600">Kelola informasi profile Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">{user?.profile?.user?.username?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.profile?.user?.username || "-"}</h2>
              <p className="text-gray-600 capitalize">{user?.profile?.user?.role || "-"}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Bergabung{" "}
                    {user?.profile?.joinDate
                      ? new Date(user.profile.joinDate).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Informasi Personal</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Karyawan</label>
                  <input type="text" value={formData.employeeId} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Bergabung</label>
                  <input type="date" name="joinDate" value={formData.joinDate} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Batal
                  </button>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Simpan Perubahan
                  </button>
                </div>
              )}
            </div>

            {/* Komponen Form Password yang Sudah Dipisah */}
            <PasswordForm
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              setCurrentPassword={setCurrentPassword}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
      </div>
    </AdminLayout>
  );
};

export default ProfilePage;

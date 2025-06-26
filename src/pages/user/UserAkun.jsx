import React, { useState, useCallback, use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Award,
  Camera,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Lock,
  CreditCard,
  FileText,
  MessageCircle,
  Star,
  Download,
  Share,
  Trash2,
  Clock,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import CustomHelmet from "../../components/CustomHelmet";
import ModalLogout from "../../components/ModalLogout";
import { useAuth } from "../../contexts/AuthContext";
import { infoProfile } from "../../services/user.api";

// Menu items data dengan route
const menuSections = [
  {
    title: "Profil & Akun",
    items: [
      {
        id: "change-password",
        label: "Ubah Password",
        icon: Lock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        route: "/user/edit-password",
        description: "Keamanan akun",
      },
    ],
  },
];

// Helper functions
const formatJoinDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const calculateWorkDuration = (joinDate) => {
  const start = new Date(joinDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  if (years > 0) {
    return `${years} tahun ${months} bulan`;
  } else {
    return `${months} bulan`;
  }
};

const AkunPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [infoAkun, setInfoAkun] = useState(null);

  useEffect(() => {
    const fetchInfoProfile = async () => {
      try {
        const res = await infoProfile();
        setInfoAkun(res.data);
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      }
    };

    fetchInfoProfile();
  }, []);

  const handleMenuClick = useCallback(
    (menuId, route) => {
      if (route) {
        navigate(route);
      }
    },
    [navigate]
  );

  // Handler untuk logout confirmation
  const handleLogoutConfirm = useCallback(() => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logout, navigate]);

  const handleEditProfile = useCallback(() => {
    navigate("/user/edit-akun");
  }, [navigate]);

  const handleCameraClick = useCallback(() => {
    console.log("Change profile photo");
  }, []);

  const currentUser = user;
  const username = currentUser.name || currentUser.username || "User";
  const userInitial = getInitials(username);

  return (
    <>
      <CustomHelmet title="Akun | Aplikasi Izin" description="Halaman Akun User" />

      <UserLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-xl font-bold">Akun</h1>
                  <p className="text-blue-100 text-sm">Kelola profil dan pengaturan</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleMenuClick("notifications", "/user/notifications")} className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button onClick={() => handleMenuClick("settings", "/user/settings")} className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Profile Card */}
            <div className=" rounded-2xl p-4">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{userInitial}</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white mb-1">{currentUser.username}</h2>
                  <p className="text-blue-100 text-sm mb-1">{currentUser.position}</p>
                  <p className="text-blue-200 text-xs">{currentUser.department}</p>
                  <div className="flex items-center mt-2">
                    <div className="bg-green-500 w-2 h-2 rounded-full mr-2"></div>
                    <span className="text-blue-100 text-xs">Online</span>
                  </div>
                </div>

                {/* Edit Button */}
                <button onClick={handleEditProfile} className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-white hover:bg-opacity-30 transition-colors">
                  <Edit3 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 -mt-4 relative z-10 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  {infoAkun && <div className="text-lg font-bold text-gray-900">{infoAkun.masaKerja}</div>}
                  <div className="text-xs text-gray-500">Masa Kerja</div>
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <div className="text-lg font-bold text-green-600">98%</div>
                  <div className="text-xs text-gray-500">Kehadiran</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">Cuti Tersisa</div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Informasi Personal</h3>
              {infoAkun && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm font-medium text-gray-900">{infoAkun.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Lokasi</p>
                      <p className="text-sm font-medium text-gray-900">{infoAkun.lokasi}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Bergabung</p>
                      <p className="text-sm font-medium text-gray-900">{infoAkun.bergabungSejak}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Posisi</p>
                      <p className="text-sm font-medium text-gray-900">{infoAkun.position}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-sm font-medium text-gray-900">{infoAkun.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Menu Sections */}
          <div className="px-4 space-y-4 pb-24">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-4">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button key={item.id} onClick={() => handleMenuClick(item.id, item.route)} className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors active:bg-gray-100">
                      <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <button
                onClick={() => {
                  setLogoutModalOpen(true);
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors active:bg-red-100"
              >
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-red-600">Keluar</p>
                  <p className="text-xs text-red-400">Logout dari aplikasi</p>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
            </div>

            {/* Modal Logout */}
            <ModalLogout
              isOpen={logoutModalOpen}
              onClose={() => setLogoutModalOpen(false)}
              onConfirm={handleLogoutConfirm}
              username={username}
              userInitial={userInitial}
              title="Konfirmasi Logout"
              message="Apakah Anda yakin ingin keluar dari aplikasi? Anda akan diarahkan ke halaman login."
              confirmText="Ya, Logout"
              cancelText="Batal"
            />

            {/* App Version */}
            <div className="text-center py-4">
              <p className="text-xs text-gray-400">Aplikasi Izin v1.2.3</p>
              <p className="text-xs text-gray-400">© 2024 PT. Company Indonesia</p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <FooterNavigationUser activeTab={activeTab} />
        </div>
      </UserLayout>
    </>
  );
};

export default AkunPage;

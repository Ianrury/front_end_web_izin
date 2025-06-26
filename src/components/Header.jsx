import React, { useState } from "react";
import { Calendar, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalLogout from "./ModalLogout";
import { useAuth } from "../contexts/AuthContext";

const Header = ({
  currentPage,
  userInitial = "U",
  username = "User",
  showHeader = true,
  hideOnMobile = false,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogoutConfirm = () => {
    if (onLogout) {
      onLogout();
    }

    logout();
    navigate("/login");

  };

  if (!showHeader) return null;

  return (
    <>
      <nav className={`bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40 ${hideOnMobile ? "hidden " : ""}`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">AbsensiApp</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{userInitial}</span>
                  </div>
                  <span className="text-gray-700 font-medium">{username}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setLogoutModalOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

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
    </>
  );
};

export default Header;

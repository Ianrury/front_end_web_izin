import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, FileText, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    ADMIN: [
      { label: "Dashboard", icon: Home, path: "/admin" },
      { label: "Kelola User", icon: Users, path: "/admin/kelola-user" },
      { label: "Lihat Izin", icon: FileText, path: "/admin/kelola-izin" },
    ],
    VERIFIER: [
      { label: "Dashboard", icon: Home, path: "/verifier" },
      { label: "Kelola User", icon: FileText, path: "/verifier/kelola-user" },
      { label: "Kelola Izin", icon: Users, path: "/verifier/kelola-izin" },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-blue-100 min-h-screen sticky top-0 left-0 z-30">
      <div className="p-4 h-full flex flex-col">
        {/* User Info */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-800 capitalize">{user?.username}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">AbsensiApp v1.0</p>
            <p className="text-xs text-gray-400">© 2024</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

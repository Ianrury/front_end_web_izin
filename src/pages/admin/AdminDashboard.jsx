import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Users, Clock, Check, UserCheck, Plus, Eye, FileText } from "lucide-react";
import CustomHelmet from "../../components/CustomHelmet";
import { useAuth } from "../../contexts/AuthContext";
import { dataDashboard } from "../../services/admin.api";
import { Link } from "react-router-dom";

const AdminDashboard = ({ navigate, currentPage = "dashboard" }) => {
  const { user } = useAuth(); // <-- FIX
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dataDashboard();
        setData(response?.data || {});
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const statsData = [
    { label: "Total User", value: data?.totalUser || 0, icon: Users, color: "blue" },
    { label: "Izin Pending", value: data?.izinPending || 0, icon: Clock, color: "yellow" },
    { label: "Izin Disetujui", value: data?.izinDisetujui || 0, icon: Check, color: "green" },
    { label: "Verifikator Aktif", value: data?.verifikatorAktif || 0, icon: UserCheck, color: "purple" },
  ];

  const DashboardContent = () => (
    <div>
      <CustomHelmet title="Dashboard | Aplikasi Izin" description="Dashboard Admin" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
            <p className="text-gray-600">Selamat datang kembali, {user?.username}!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Hari ini</p>
            <p className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600",
              green: "bg-green-100 text-green-600",
              red: "bg-red-100 text-red-600",
              yellow: "bg-yellow-100 text-yellow-600",
              purple: "bg-purple-100 text-purple-600",
            };

            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/create-user">
              <button onClick={() => navigate("users")} className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-600">Tambah User</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {data?.izinTerbaru?.length > 0 ? (
              data.izinTerbaru.map((izin, index) => (
                <div key={izin.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      Izin oleh {izin.user.username} - {izin.status}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(izin.tanggalMulai).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Tidak ada aktivitas terbaru.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout navigate={navigate} currentPage={currentPage}>
      <DashboardContent />
    </AdminLayout>
  );
};

export default AdminDashboard;

import React, { useEffect, useState, useCallback } from "react";
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, Bell, Settings, LogOut, ChevronRight, Home, Users, Mail } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import CustomHelmet from "../../components/CustomHelmet";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import { Link } from "react-router-dom";
import { dataDashboard } from "../../services/user.api";

// Fungsi helper dipindahkan ke luar komponen untuk menghindari re-creation
const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500";
    case "APPROVED":
      return "bg-green-500";
    case "REJECTED":
      return "bg-red-500";
    case "REVISION":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-4 h-4" />;
    case "APPROVED":
      return <CheckCircle className="w-4 h-4" />;
    case "REJECTED":
      return <XCircle className="w-4 h-4" />;
    case "REVISION":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Data announcements yang statis
const announcements = [
  {
    id: "1",
    title: "Kebijakan Baru Pengajuan Izin",
    date: "10 Feb 2024",
    content: "Mulai bulan ini, semua pengajuan izin harus disertai...",
  },
  {
    id: "2",
    title: "Libur Nasional Bulan Ini",
    date: "08 Feb 2024",
    content: "Informasi hari libur nasional untuk bulan...",
  },
  {
    id: "3",
    title: "Update Sistem Izin",
    date: "05 Feb 2024",
    content: "Sistem izin telah diperbarui dengan fitur...",
  },
];

const DashboardUserContent = ({ data, loading }) => {
  // Gunakan data dari API atau fallback ke default
  const userData = {
    name: data?.username || "Loading...",
    position: data?.position || "Loading...",
    company: data?.companyName || "Loading...",
    avatar: "/api/placeholder/80/80",
  };

  const stats = {
    totalRequests: data?.totalIzin || 0,
    pendingRequests: data?.totalPending || 0,
    approvedRequests: (data?.totalIzin || 0) - (data?.totalPending || 0),
    rejectedRequests: 0, // Tidak ada data ini dari API
  };

  const recentRequests = data?.recentIzin || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomHelmet title="Dashboard | Aplikasi Izin" description="Dashboard User" />
      <div className="min-h-screen bg-gray-50">
        {/* Header Profile Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{userData.name}</h2>
                <p className="text-blue-100 text-sm">{userData.position}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-blue-500 rounded-full">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 bg-blue-500 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-xs text-blue-100 mb-2">{userData.company}</div>
        </div>

        {/* Main Content */}
        <div className="px-4 -mt-6 relative z-10">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">Total Izin</div>
                <div className="text-xl font-bold text-gray-900">{stats.totalRequests}</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-sm text-gray-600">Menunggu</div>
                <div className="text-xl font-bold text-gray-900">{stats.pendingRequests}</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/user/ajukan-izin" className="block">
                <button className="w-full p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">Ajukan</div>
                  <div className="text-sm font-medium text-gray-900">Izin</div>
                </button>
              </Link>

              <Link to="/user/riwayat-izin" className="block">
                <button className="w-full p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">Riwayat</div>
                  <div className="text-sm font-medium text-gray-900">Izin</div>
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Izin Terbaru</h3>
            </div>

            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.title}</div>
                        <div className="text-xs text-gray-500">{request.info}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Belum ada izin yang diajukan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Menggunakan useCallback untuk mencegah re-creation function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dataDashboard();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect dengan dependency array yang tepat
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Log hanya untuk development
  if (process.env.NODE_ENV === "development") {
    console.log("Dashboard data:", data);
  }

  if (error) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Coba Lagi
            </button>
          </div>
        </div>
        <FooterNavigationUser activeTab={activeTab} setActiveTab={setActiveTab} />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardUserContent data={data} loading={loading} />
      <FooterNavigationUser activeTab={activeTab} setActiveTab={setActiveTab} />
    </UserLayout>
  );
};

export default UserDashboard;

import { useState, useEffect } from "react";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";

import VerifikatorLayout from "../../layouts/VerifikatorLayout";
import SearchFilter from "../../components/SearchFilter";
import PermissionCard from "../../components/PermissionCard";
import ActionModal from "../../components/ActionModal";
import CustomHelmet from "../../components/CustomHelmet";
import { listIzin } from "../../services/verifier.api";
import { useNavigate } from "react-router-dom";

const AdminPermissions = ({ navigate, currentPage = "permissions" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigatedetail = useNavigate();
  const [stats, setStats] = useState({
    total_pengajuan: 0,
    total_pending: 0,
    total_disetujui: 0,
    total_ditolak: 0,
  });

  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [actionType, setActionType] = useState("");

  const filterOptions = [
    { value: "all", label: "Semua Status" },
    { value: "PENDING", label: "Menunggu Proses" },
    { value: "APPROVED", label: "Disetujui" },
    { value: "REJECTED", label: "Ditolak" },
    { value: "REVISION", label: "Perlu Revisi" },
    { value: "CANCELLED", label: "Dibatalkan" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      REVISION: "bg-orange-100 text-orange-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: "Menunggu",
      APPROVED: "Disetujui",
      REJECTED: "Ditolak",
      REVISION: "Revisi",
      CANCELLED: "Dibatalkan",
    };
    return labels[status] || status;
  };

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await listIzin();

      if (response && response.list_izin) {
        setPermissions(response.list_izin);
        setStats({
          total_pengajuan: response.total_pengajuan || 0,
          total_pending: response.total_pending || 0,
          total_disetujui: response.total_disetujui || 0,
          total_ditolak: response.total_ditolak || 0,
        });
      }
    } catch (error) {
      console.error("GAGAL AMBIL IZIN:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch = permission.title.toLowerCase().includes(searchTerm.toLowerCase()) || permission.nama.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || permission.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleViewDetail = (permissionId) => {
    navigatedetail(`/admin/izin-detail/${permissionId}`);
  };

  const handleAction = (permission, action) => {
    setSelectedPermission(permission);
    setActionType(action);
    setShowActionModal(true);
  };

  const handleSubmitAction = async (action, permissionId, comment) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchPermissions();
      const actionMessages = {
        approve: "disetujui",
        reject: "ditolak",
        revision: "diminta revisi",
      };

      alert(`Pengajuan berhasil ${actionMessages[action]}!`);

      setShowActionModal(false);
      setSelectedPermission(null);
      setActionType("");
    } catch (error) {
      console.error("Failed to submit action:", error);
      alert("Gagal memproses aksi. Silakan coba lagi.");
    }
  };

  const statsCards = [
    {
      label: "Total Pengajuan",
      value: stats.total_pengajuan,
      color: "bg-blue-500",
      icon: FileText,
    },
    {
      label: "Menunggu Proses",
      value: stats.total_pending,
      color: "bg-yellow-500",
      icon: Clock,
    },
    {
      label: "Disetujui",
      value: stats.total_disetujui,
      color: "bg-green-500",
      icon: CheckCircle,
    },
    {
      label: "Ditolak",
      value: stats.total_ditolak,
      color: "bg-red-500",
      icon: XCircle,
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  return (
    <VerifikatorLayout navigate={navigate} currentPage={currentPage}>
      <div>
        <CustomHelmet title="Permission | Aplikasi Izin" description="Permission Admin" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kelola Pengajuan Izin</h1>
              <p className="text-gray-600">Proses dan verifikasi pengajuan izin dari karyawan dengan mudah dan efisien</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <SearchFilter onSearchChange={setSearchTerm} onFilterChange={setFilterStatus} searchPlaceholder="Cari berdasarkan nama atau judul pengajuan..." filterOptions={filterOptions} defaultFilter="all" />

          {loading ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Memuat data...</h3>
              <p className="text-gray-600">Sedang mengambil data pengajuan izin</p>
            </div>
          ) : (
            <>
              {filteredPermissions.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak ada pengajuan ditemukan</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterStatus !== "all" ? "Coba ubah kata kunci pencarian atau filter status untuk melihat pengajuan lainnya." : "Belum ada pengajuan izin yang masuk. Pengajuan baru akan muncul di sini."}
                  </p>
                  {(searchTerm || filterStatus !== "all") && (
                    <button onClick={handleResetFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      Menampilkan {filteredPermissions.length} dari {permissions.length} pengajuan
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPermissions.map((permission) => (
                      <div key={permission.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 mb-1">{permission.title}</h3>
                              <p className="text-sm text-gray-600">{permission.nama}</p>
                              <p className="text-xs text-gray-500">{permission.jabatan}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(permission.status)}`}>{getStatusLabel(permission.status)}</span>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              <Clock className="inline-block w-4 h-4 mr-1" />
                              {permission.tanggal_format}
                            </p>
                          </div>

                          {permission.comment && permission.comment.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500">{permission.comment.length} komentar</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <button onClick={() => handleViewDetail(permission.id)} className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                              <Eye className="w-4 h-4" />
                              Detail
                            </button>

                            {permission.status === "PENDING" && <></>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <ActionModal
            isOpen={showActionModal}
            onClose={() => {
              setShowActionModal(false);
              setSelectedPermission(null);
              setActionType("");
            }}
            selectedPermission={selectedPermission}
            actionType={actionType}
            onSubmit={handleSubmitAction}
          />
        </div>
      </div>
    </VerifikatorLayout>
  );
};

export default AdminPermissions;

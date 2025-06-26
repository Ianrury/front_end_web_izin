import React, { useEffect, useState, useCallback } from "react";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, MessageCircle, Eye, Filter, Search, ChevronDown, RefreshCw, Slash, Trash2 } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import CustomHelmet from "../../components/CustomHelmet";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import { deteleIzin, listizin } from "../../services/user.api";
import { ToastContainer } from "../../components/Toast";
import { Link } from "react-router-dom";
import useToast from "../../hooks/useToast";

const getStatusBgColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "APPROVED":
      return "bg-green-50 text-green-700 border-green-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";
    case "REVISION":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "APPROVED":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "REJECTED":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "REVISION":
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case "CANCELLED":
      return <Slash className="w-4 h-4 text-gray-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "PENDING":
      return "Menunggu";
    case "APPROVED":
      return "Disetujui";
    case "REJECTED":
      return "Ditolak";
    case "REVISION":
      return "Revisi";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return "Status Tidak Dikenal";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Filter options
const STATUS_OPTIONS = [
  { value: "ALL", label: "Semua Status" },
  { value: "PENDING", label: "Menunggu" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
  { value: "REVISION", label: "Revisi" },
];

const ListIzinContent = ({ data, loading, onRefresh, onViewDetail, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilter, setShowFilter] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Filter data based on search and status
  const filteredData =
    data?.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  // Get statistics
  const getStats = () => {
    if (!data) return { total: 0, pending: 0, approved: 0, rejected: 0, revision: 0 };

    return {
      total: data.length,
      pending: data.filter((item) => item.status === "PENDING").length,
      approved: data.filter((item) => item.status === "APPROVED").length,
      rejected: data.filter((item) => item.status === "REJECTED").length,
      revision: data.filter((item) => item.status === "REVISION").length,
    };
  };

  const stats = getStats();

  // Handle delete confirmation
  const handleDeleteClick = (item) => {
    setDeleteConfirm(item);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(deleteConfirm.id);
      await onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting izin:", error);
      // You might want to show an error toast here
    } finally {
      setDeleting(null);
    }
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  // Check if item can be deleted (only PENDING and REJECTED can be deleted)
  const canDelete = (status) => {
    return status === "PENDING" || status === "REJECTED";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
          <h1 className="text-xl font-bold">Daftar Izin</h1>
          <p className="text-blue-100 text-sm mt-1">Riwayat pengajuan izin Anda</p>
        </div>

        <div className="px-4 -mt-6 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data izin...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomHelmet title="Daftar Izin | Aplikasi Izin" description="Daftar semua pengajuan izin" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Daftar Izin</h1>
              <p className="text-blue-100 text-sm mt-1">Riwayat pengajuan izin Anda</p>
            </div>
            <button onClick={onRefresh} className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 -mt-6 relative z-10">
          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari izin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button onClick={() => setShowFilter(!showFilter)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Filter Dropdown */}
            {showFilter && (
              <div className="border-t border-gray-100 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setShowFilter(false);
                      }}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === option.value ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* List Items */}
          <div className="space-y-4 mb-20">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.content.split(" ").slice(0, 4).join(" ")}
                        {item.content.split(" ").length > 4 ? "..." : ""}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 whitespace-nowrap ${getStatusBgColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span>{getStatusText(item.status)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.detail}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDateOnly(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Verifier Info */}
                  {item.verifier && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Verifikator: {item.verifier.username}</span>
                    </div>
                  )}

                  {/* Comments Count */}
                  {item.comment && item.comment.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{item.comment.length} komentar</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <Link to={`/user/detail-izin/${item.id}`} className="flex-1">
                        <button onClick={() => onViewDetail(item)} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          <span>Lihat Detail</span>
                        </button>
                      </Link>

                      {canDelete(item.status) && (
                        <button
                          onClick={() => handleDeleteClick(item)}
                          disabled={deleting === item.id}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {deleting === item.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm || statusFilter !== "ALL" ? "Tidak ada data yang sesuai" : "Belum ada izin"}</h3>
                <p className="text-gray-600 mb-4">{searchTerm || statusFilter !== "ALL" ? "Coba ubah filter atau kata kunci pencarian" : "Anda belum mengajukan izin apapun"}</p>
                {!searchTerm && statusFilter === "ALL" && <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Ajukan Izin Pertama</button>}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Izin</h3>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus izin "{deleteConfirm.title}"? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex space-x-3">
                  <button onClick={handleDeleteCancel} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Batal
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {deleting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const ListIzin = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toasts, hideToast, showSuccess, showDanger, showWarning } = useToast();

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listizin();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching list izin:", error);
      setError(error.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Handle view detail
  const handleViewDetail = (item) => {};

  const handleDelete = async (id) => {
    try {
      const response = await deteleIzin(id);
      showSuccess("Izin berhasil dihapus!", { duration: 4000 });

      setData((prevData) => (prevData ? prevData.filter((item) => item.id !== id) : null));
    } catch (error) {
      console.error("Error deleting izin:", error);
      throw error;
    }
  };

  // Error state
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
      <ListIzinContent data={data} loading={loading} onRefresh={handleRefresh} onViewDetail={handleViewDetail} onDelete={handleDelete} />
      <FooterNavigationUser activeTab={activeTab} setActiveTab={setActiveTab} />
      <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
    </UserLayout>
  );
};

export default ListIzin;

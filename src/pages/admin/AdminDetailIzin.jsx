import React, { useEffect, useState, useMemo, useCallback } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus, Search, Filter, Eye, Edit, Trash2, Check, X, MoreVertical, Calendar, Clock, User, MessageCircle, Send, FileText, AlertTriangle, CheckCircle, XCircle, AlertCircle, Slash } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import CustomHelmet from "../../components/CustomHelmet";
import { Link, useParams } from "react-router-dom";
import useToast from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import { approved, balasChat, cancelled, detailIzin, reject, revision } from "../../services/verifier.api";

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
    case "CANCELLED":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "APPROVED":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "REJECTED":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "REVISION":
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    case "CANCELLED":
      return <Slash className="w-5 h-5 text-gray-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "PENDING":
      return "Menunggu Verifikasi";
    case "APPROVED":
      return "Disetujui";
    case "REJECTED":
      return "Ditolak";
    case "REVISION":
      return "Perlu Revisi";
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminDetailIzin = ({ navigate, currentPage = "izin" }) => {
  const { toasts, hideToast, showSuccess, showDanger, showWarning } = useToast();
  const { id } = useParams();

  const [izinData, setIzinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchDetailIzin = useCallback(async () => {
    try {
      setLoading(true);
      const response = await detailIzin(id);

      if (response.success) {
        setIzinData(response.data);
      } else {
        showDanger("Gagal memuat data izin");
      }
    } catch (error) {
      console.error("Error fetching detail izin:", error);
      showDanger("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleAction = async (action) => {
    try {
      setActionLoading(action);
      let response;

      switch (action) {
        case "approved":
          response = await approved(id);
          showSuccess("Izin berhasil disetujui");
          break;
        case "rejected":
          response = await reject(id);
          showSuccess("Izin berhasil ditolak");
          break;
        case "revision":
          response = await revision(id);
          showSuccess("Izin dikembalikan untuk revisi");
          break;
        case "cancelled":
          response = await cancelled(id);
          showSuccess("Izin berhasil dibatalkan");
          break;
        default:
          break;
      }

      await fetchDetailIzin();
    } catch (error) {
      console.error(`Error ${action}:`, error);
      showDanger(`Gagal ${action} izin`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    try {
      setSendingMessage(true);
      const payload = {
        izinId: id,
        pesan: chatMessage.trim(),
      };

      await balasChat(payload);
      setChatMessage("");
      showSuccess("Pesan berhasil dikirim");

      await fetchDetailIzin();
    } catch (error) {
      console.error("Error sending message:", error);
      showDanger("Gagal mengirim pesan");
    } finally {
      setSendingMessage(false);
    }
  };

  const canTakeAction = (status) => {
    return status === "PENDING" || status === "REVISION";
  };

  useEffect(() => {
    if (id) {
      fetchDetailIzin();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout navigate={navigate} currentPage={currentPage}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat detail izin...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!izinData) {
    return (
      <AdminLayout navigate={navigate} currentPage={currentPage}>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Data tidak ditemukan</h3>
          <p className="text-gray-600">Izin yang Anda cari tidak ditemukan</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout navigate={navigate} currentPage={currentPage}>
      <div>
        <CustomHelmet title="Detail Izin | Aplikasi Izin" description="Detail Izin Verifier" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Detail Izin</h1>
              <p className="text-gray-600">Verifikasi dan kelola permohonan izin</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Izin Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Izin Info Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{izinData.title}</h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBgColor(izinData.status)}`}>
                      {getStatusIcon(izinData.status)}
                      <span className="ml-2">{getStatusText(izinData.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{izinData.content}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Izin</label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{izinData.detail}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengajuan</label>
                      <div className="flex items-center space-x-2 text-gray-900">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(izinData.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pemohon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                    <p className="text-gray-900">{izinData.user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{izinData.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                    <p className="text-gray-900">{izinData.user.position}</p>
                  </div>
                </div>
              </div>

              {/* Verifier Info Card */}
              {izinData.verifier && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Verifikator</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <p className="text-gray-900">{izinData.verifier.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{izinData.verifier.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Posisi</label>
                      <p className="text-gray-900">{izinData.verifier.position}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
      </div>
    </AdminLayout>
  );
};

export default AdminDetailIzin;

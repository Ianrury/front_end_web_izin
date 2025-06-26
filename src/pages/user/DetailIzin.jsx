import React, { useEffect, useState, useCallback, useRef } from "react";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, MessageCircle, Send, FileText, Mail, Briefcase, MoreVertical, Edit3, RefreshCw, CheckCheck, Slash, Save, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import CustomHelmet from "../../components/CustomHelmet";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import { balasChat, detailIzin, editIzin } from "../../services/user.api";
import useToast from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";

// Helper functions
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Comment Component
const CommentItem = ({ comment, isUser, isLast }) => {
  const isUserComment = comment.role === "USER";

  return (
    <div className={`flex ${isUserComment ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isUserComment ? "order-2" : "order-1"}`}>
        <div className={`rounded-2xl px-4 py-3 ${isUserComment ? "bg-blue-500 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`}>
          <p className="text-sm leading-relaxed">{comment.pesan}</p>
        </div>
        <div className={`flex items-center mt-1 text-xs text-gray-500 ${isUserComment ? "justify-end" : "justify-start"}`}>
          <span className="mr-2">{isUserComment ? "Anda" : "Verifikator"}</span>
          <span>{formatDateShort(comment.waktu)}</span>
          {isUserComment && <CheckCheck className="w-3 h-3 ml-1 text-blue-400" />}
        </div>
      </div>
    </div>
  );
};

// Edit Form Component
const EditForm = ({ data, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    title: data.title || "",
    content: data.content || "",
    detail: data.detail || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content || !formData.detail) {
      return;
    }
    onSave(formData);
  };

  const isFormValid = formData.title && formData.content && formData.detail;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
          Edit Pengajuan Izin
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Izin <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Contoh: Izin Sakit, Cuti Tahunan"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        {/* Content Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alasan Izin <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Jelaskan alasan mengajukan izin..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none outline-none"
          />
        </div>

        {/* Detail Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal/Periode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.detail}
            onChange={(e) => handleInputChange("detail", e.target.value)}
            placeholder="Contoh: 25-26 Juni 2025"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isEditing}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
              isFormValid && !isEditing ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isEditing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
          <button onClick={onCancel} disabled={isEditing} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Detail Component
const DetailIzinContent = ({ data, loading, onRefresh, onSendComment, onEditIzin }) => {
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto scroll to bottom when new comments are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.comment]);

  const handleSendComment = async () => {
    if (!newComment.trim() || isSending) return;

    setIsSending(true);

    try {
      await onSendComment(newComment.trim());
      setNewComment("");
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleEditSave = async (formData) => {
    setIsEditingForm(true);
    try {
      await onEditIzin(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing izin:", error);
    } finally {
      setIsEditingForm(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-500 rounded-full transition-colors mr-3">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Detail Izin</h1>
          </div>
        </div>

        <div className="px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat detail izin...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data tidak ditemukan</h2>
          <p className="text-gray-600 mb-4">Izin yang Anda cari tidak dapat ditemukan</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomHelmet title={`${data.title} | Detail Izin`} description="Detail pengajuan izin" />
      <div className="min-h-screen bg-gray-50 pb-32">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-500 rounded-full transition-colors mr-3">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Detail Izin</h1>
                <p className="text-blue-100 text-sm">#{data.id.slice(-8)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {data.status === "REVISION" && (
                <button onClick={() => setIsEditing(true)} className="p-2 bg-orange-500 rounded-full hover:bg-orange-400 transition-colors" title="Edit Izin">
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
              <button onClick={onRefresh} className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {/* Edit Form - Show when editing */}
          {isEditing && <EditForm data={data} onSave={handleEditSave} onCancel={handleEditCancel} isEditing={isEditingForm} />}

          {/* Status Card */}
          {!isEditing && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusBgColor(data.status)}`}>
                  {getStatusIcon(data.status)}
                  <span>{getStatusText(data.status)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {data.status === "REVISION" && (
                    <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-orange-100 rounded-full transition-colors text-orange-600" title="Edit Izin">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {data.status === "REVISION" && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-orange-800">Perlu Revisi</span>
                  </div>
                  <p className="text-orange-700 text-sm">Pengajuan izin Anda memerlukan revisi. Silakan edit dan kirim ulang pengajuan Anda.</p>
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-3">{data.title}</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">{data.content}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="text-sm text-gray-500">Periode Izin</span>
                    <p className="font-medium">{data.detail}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="text-sm text-gray-500">Tanggal Pengajuan</span>
                    <p className="font-medium">{formatDate(data.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User & Verifier Info */}
          {!isEditing && (
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Pengaju */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Pengaju</h3>
                    <p className="text-gray-600">{data.user.username}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{data.user.position}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{data.user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifikator */}
              {data.verifier && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Verifikator</h3>
                      <p className="text-gray-600">{data.verifier.username}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-3 h-3" />
                          <span>{data.verifier.position}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{data.verifier.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Comments Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Diskusi ({data.comment?.length || 0})</h3>
              </div>
            </div>

            {/* Comments List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {data.comment && data.comment.length > 0 ? (
                <>
                  {data.comment.map((comment, index) => (
                    <CommentItem key={index} comment={comment} isUser={comment.role === "USER"} isLast={index === data.comment.length - 1} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada diskusi</p>
                  <p className="text-sm text-gray-400">Mulai diskusi dengan mengirim pesan</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tulis pesan..."
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    disabled={isSending}
                  />
                </div>
                <button
                  onClick={handleSendComment}
                  disabled={!newComment.trim() || isSending}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
                >
                  {isSending ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Tekan Enter untuk mengirim, Shift+Enter untuk baris baru</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DetailIzin = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, hideToast, showDanger, showSuccess } = useToast();

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!id) {
      setError("ID izin tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await detailIzin(id);
      if (response.success) {
        setData(response.data);
      } else {
        setError("Data tidak ditemukan");
      }
    } catch (error) {
      console.error("Error fetching detail izin:", error);
      setError(error.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Handle send comment
  const handleSendComment = async (message) => {
    try {
      const payload = {
        izinId: id,
        pesan: message,
      };

      await balasChat(payload);

      // Optimistically update UI
      const newComment = {
        role: "USER",
        pesan: message,
        waktu: new Date().toISOString(),
      };

      setData((prevData) => ({
        ...prevData,
        comment: [...(prevData.comment || []), newComment],
      }));

      showSuccess("Pesan berhasil dikirim!");
    } catch (error) {
      console.error("Error sending comment:", error);
      showDanger("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  // Handle edit izin
  const handleEditIzin = async (formData) => {
    try {
      const payload = {
        izinId: id,
        title: formData.title,
        content: formData.content,
        detail: formData.detail,
      };

      await editIzin(payload);

      // Update local data
      setData((prevData) => ({
        ...prevData,
        title: formData.title,
        content: formData.content,
        detail: formData.detail,
        status: "PENDING", // Status kembali ke pending setelah edit
      }));

      showSuccess("Izin berhasil diperbarui!");

      // Refresh data after edit
      setTimeout(() => {
        fetchData();
      }, 1000);
    } catch (error) {
      console.error("Error editing izin:", error);
      showDanger("Gagal memperbarui izin. Silakan coba lagi.");
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
            <div className="space-x-3">
              <button onClick={fetchData} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Coba Lagi
              </button>
              <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Kembali
              </button>
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
        <FooterNavigationUser activeTab={activeTab} setActiveTab={setActiveTab} />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DetailIzinContent data={data} loading={loading} onRefresh={handleRefresh} onSendComment={handleSendComment} onEditIzin={handleEditIzin} />
      <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
      <FooterNavigationUser activeTab={activeTab} setActiveTab={setActiveTab} />
    </UserLayout>
  );
};

export default DetailIzin;

import { useState } from "react";
import { Calendar, FileText, MessageSquare, User, Clock, CheckCircle, XCircle, RefreshCw, Check, X, Send, Download, MapPin, Phone, Building } from "lucide-react";
import Modal from "./Modal";

const PermissionDetailModal = ({ permission, isOpen, onClose, onAction, currentUser }) => {
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!permission) return null;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        text: "Menunggu Proses",
        bgColor: "bg-yellow-50",
      },
      approved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Disetujui",
        bgColor: "bg-green-50",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        text: "Ditolak",
        bgColor: "bg-red-50",
      },
      revision: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: RefreshCw,
        text: "Perlu Revisi",
        bgColor: "bg-blue-50",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(permission.status);
  const StatusIcon = statusConfig.icon;

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setIsSubmittingComment(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Comment submitted:", comment);
    setComment("");
    setIsSubmittingComment(false);
  };

  const handleQuickAction = (action) => {
    onAction(permission, action);
    onClose();
  };

  // Mock comments for demonstration
  const mockComments = [
    {
      id: 1,
      user: { name: "Admin HR", avatar: "AH" },
      message: "Mohon lampirkan surat keterangan dokter yang lebih detail",
      timestamp: "2024-01-14 10:30",
      type: "revision",
    },
    {
      id: 2,
      user: { name: permission.user.name, avatar: permission.user.avatar },
      message: "Baik, akan saya lampirkan surat dokter yang lebih lengkap",
      timestamp: "2024-01-14 11:15",
      type: "reply",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" title="Detail Pengajuan Izin">
      <div className="p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">{permission.user.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{permission.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{permission.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>Departemen IT</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{permission.user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 text-sm font-medium rounded-full border ${statusConfig.color} flex items-center space-x-2`}>
                <StatusIcon className="h-4 w-4" />
                <span>{statusConfig.text}</span>
              </span>
              <p className="text-xs text-gray-500 mt-2">ID: #{permission.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Permission Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Detail Pengajuan</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Jenis Izin</label>
                    <p className="text-gray-800 font-medium">{permission.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Tanggal Mulai</label>
                    <p className="text-gray-800">{permission.startDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Durasi</label>
                    <p className="text-gray-800">{permission.duration} hari</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Prioritas</label>
                    <p className="text-gray-800 font-medium">{permission.priority === "urgent" ? "Urgent" : permission.priority === "normal" ? "Normal" : "Rendah"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Tanggal Selesai</label>
                    <p className="text-gray-800">{permission.endDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Tanggal Pengajuan</label>
                    <p className="text-gray-800">{permission.submittedDate}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-500 block mb-2">Alasan/Keterangan</label>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-800 leading-relaxed">{permission.description}</p>
                </div>
              </div>

              {permission.attachment && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Lampiran</label>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 font-medium flex-1">{permission.attachment}</span>
                    <button className="text-blue-600 hover:text-blue-800 p-1">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Riwayat Komentar</span>
              </h3>

              <div className="space-y-4 mb-6">
                {mockComments.map((commentItem) => (
                  <div key={commentItem.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">{commentItem.user.avatar}</div>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800 text-sm">{commentItem.user.name}</span>
                          <span className="text-xs text-gray-500">{commentItem.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{commentItem.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">{currentUser?.name?.charAt(0) || "A"}</div>
                  <div className="flex-1">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tambahkan komentar..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleSubmitComment}
                        disabled={!comment.trim() || isSubmittingComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        <span>{isSubmittingComment ? "Mengirim..." : "Kirim"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {permission.status === "pending" && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
                <div className="space-y-3">
                  <button onClick={() => handleQuickAction("approve")} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Check className="h-4 w-4" />
                    <span>Setujui</span>
                  </button>
                  <button onClick={() => handleQuickAction("revision")} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <RefreshCw className="h-4 w-4" />
                    <span>Minta Revisi</span>
                  </button>
                  <button onClick={() => handleQuickAction("reject")} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <X className="h-4 w-4" />
                    <span>Tolak</span>
                  </button>
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pemohon</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{permission.user.name}</p>
                    <p className="text-xs text-gray-500">Nama Lengkap</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Departemen IT</p>
                    <p className="text-xs text-gray-500">Departemen</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">+62 812-3456-7890</p>
                    <p className="text-xs text-gray-500">No. Telepon</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Jakarta Selatan</p>
                    <p className="text-xs text-gray-500">Lokasi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Pengajuan Dibuat</p>
                    <p className="text-xs text-gray-500">{permission.submittedDate}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Menunggu Review</p>
                    <p className="text-xs text-gray-500">Status saat ini</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionDetailModal;

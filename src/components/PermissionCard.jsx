import { Calendar, FileText, MessageSquare, Eye, Check, X, RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";

const PermissionCard = ({ permission, onAction, onViewDetail }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        text: "Menunggu Proses",
        bgColor: "bg-yellow-50",
        borderColor: "border-l-yellow-400",
      },
      approved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Disetujui",
        bgColor: "bg-green-50",
        borderColor: "border-l-green-400",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        text: "Ditolak",
        bgColor: "bg-red-50",
        borderColor: "border-l-red-400",
      },
      revision: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: RefreshCw,
        text: "Perlu Revisi",
        bgColor: "bg-blue-50",
        borderColor: "border-l-blue-400",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: { color: "text-red-600", text: "Urgent", bg: "bg-red-100" },
      normal: { color: "text-blue-600", text: "Normal", bg: "bg-blue-100" },
      low: { color: "text-gray-600", text: "Rendah", bg: "bg-gray-100" },
    };
    return configs[priority] || configs.normal;
  };

  const statusConfig = getStatusConfig(permission.status);
  const priorityConfig = getPriorityConfig(permission.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${statusConfig.borderColor} flex flex-col h-[350px]`}>
      <div className="p-6 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">{permission.user.avatar}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">{permission.title}</h3>
              <p className="text-sm text-gray-600 font-medium">{permission.user.name}</p>
              <p className="text-xs text-gray-500">{permission.user.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 ml-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.color} flex items-center space-x-1 whitespace-nowrap`}>
              <StatusIcon className="h-3 w-3" />
              <span>{statusConfig.text}</span>
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityConfig.bg} ${priorityConfig.color}`}>{priorityConfig.text}</span>
          </div>
        </div>

        {/* Konten scrollable */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3 mb-4">
          {/* Tanggal */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {permission.startDate} - {permission.endDate} ({permission.duration} hari)
            </span>
          </div>

          {/* Tipe */}
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{permission.type}</span>
          </div>

          {/* Lampiran */}
          {permission.attachment && (
            <div className="flex items-center text-sm text-blue-600">
              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate hover:text-blue-800 cursor-pointer">{permission.attachment}</span>
            </div>
          )}

          {/* Deskripsi */}
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{permission.description}</p>

          {/* Komentar terakhir */}
          {permission.lastComment && (
            <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">Komentar Terakhir:</span>
              </div>
              <p className="text-sm text-gray-700">{permission.lastComment}</p>
            </div>
          )}
        </div>

        {/* Footer / Aksi */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between min-h-[44px]">
            <span className="text-xs text-gray-500">Diajukan {permission.submittedDate}</span>
            <div className="flex items-center space-x-1">
              <button onClick={() => onViewDetail(permission)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="Lihat Detail">
                <Eye className="h-4 w-4" />
              </button>

              {permission.status === "pending" && (
                <>
                  {/* <button onClick={() => onAction(permission, "approve")} className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors" title="Setujui">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => onAction(permission, "revision")} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="Minta Revisi">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button onClick={() => onAction(permission, "reject")} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" title="Tolak">
                    <X className="h-4 w-4" />
                  </button> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionCard;

import { useState } from "react";
import { Check, X, RefreshCw } from "lucide-react";
import Modal from "./Modal";

const ActionModal = ({ isOpen, onClose, selectedPermission, actionType, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !selectedPermission) return null;

  const actionConfig = {
    approve: {
      title: "Setujui Pengajuan",
      color: "bg-green-600 hover:bg-green-700",
      icon: Check,
      description: "Pengajuan akan disetujui dan user akan mendapat notifikasi",
      buttonText: "Setujui Pengajuan",
    },
    reject: {
      title: "Tolak Pengajuan",
      color: "bg-red-600 hover:bg-red-700",
      icon: X,
      description: "Pengajuan akan ditolak dan user akan mendapat notifikasi",
      buttonText: "Tolak Pengajuan",
    },
    revision: {
      title: "Minta Revisi",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: RefreshCw,
      description: "User akan diminta untuk merevisi pengajuan",
      buttonText: "Minta Revisi",
    },
  };

  const config = actionConfig[actionType];
  const isCommentRequired = actionType === "reject" || actionType === "revision";
  const isFormValid = !isCommentRequired || comment.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(actionType, selectedPermission.id, comment);
      handleReset();
    } catch (error) {
      console.error("Error submitting action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setComment("");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} size="md" closeOnOverlay={!isSubmitting}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-xl ${config.color}`}>
            <config.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{config.title}</h3>
            <p className="text-sm text-gray-600">{selectedPermission.title}</p>
          </div>
        </div>

        {/* Permission Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">{selectedPermission.user.avatar}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{selectedPermission.user.name}</p>
              <p className="text-sm text-gray-600">
                {selectedPermission.type} - {selectedPermission.duration} hari
              </p>
              <p className="text-sm text-gray-500">
                {selectedPermission.startDate} s/d {selectedPermission.endDate}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <p className="text-sm text-blue-800">{config.description}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Komentar {isCommentRequired ? <span className="text-red-500">*</span> : <span className="text-gray-500">(Opsional)</span>}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Berikan ${actionType === "approve" ? "catatan" : "alasan"} untuk keputusan ini...`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
            rows="4"
            disabled={isSubmitting}
          />
          {isCommentRequired && comment.trim().length === 0 && <p className="text-red-500 text-sm mt-1">Komentar wajib diisi untuk aksi ini</p>}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button onClick={handleReset} disabled={isSubmitting} className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200 ${config.color} disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <config.icon className="h-4 w-4" />
                <span>{config.buttonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ActionModal;

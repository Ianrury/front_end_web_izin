import React, { useState, useCallback } from "react";
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, Bell, Settings, LogOut, ChevronRight, Home, Users, Mail, ArrowLeft, Send, CalendarDays, MessageCircle, Edit3 } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import { Link } from "react-router-dom";
import useToast from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import { createIzin } from "../../services/user.api";

const AjukanIzinForm = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    detail: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toasts, hideToast, showDanger, showWarning, showSuccess: showSuccessToast } = useToast();

  const quickTemplates = [
    {
      id: 1,
      title: "Izin Sakit",
      content: "Saya sedang tidak sehat dan tidak dapat masuk kerja",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      color: "border-red-200 bg-red-50",
    },
    {
      id: 2,
      title: "Cuti Tahunan",
      content: "Mengajukan cuti tahunan untuk keperluan pribadi",
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      color: "border-blue-200 bg-blue-50",
    },
    {
      id: 3,
      title: "Izin Pribadi",
      content: "Mengajukan izin untuk keperluan keluarga",
      icon: <User className="w-5 h-5 text-green-500" />,
      color: "border-green-200 bg-green-50",
    },
  ];

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleTemplateSelect = useCallback((template) => {
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      content: template.content,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validasi form
    if (!formData.title || !formData.content || !formData.detail) {
      showDanger("Form belum lengkap", {
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        detail: formData.detail,
        comment: formData.comment || null, 
      };

      const response = await createIzin(payload);

      // Jika berhasil
      console.log("Izin berhasil dibuat:", response);

      // Tampilkan success state
      setShowSuccess(true);

      // Tampilkan toast success (opsional)
      showSuccessToast("Pengajuan izin berhasil dikirim!", {
        duration: 3000,
      });

      // Reset form setelah 2 detik
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          title: "",
          content: "",
          detail: "",
          comment: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Error creating izin:", error);

      // Tampilkan pesan error
      if (error.response?.data?.message) {
        showDanger(error.response.data.message, {
          duration: 5000,
        });
      } else {
        showDanger("Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.", {
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, showDanger, showSuccessToast]);

  const isFormValid = formData.title && formData.content && formData.detail;

  // Conditional rendering berdasarkan showSuccess
  if (showSuccess) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-sm w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Berhasil Diajukan!</h2>
            <p className="text-gray-600 mb-6">Pengajuan izin Anda telah berhasil dikirim dan sedang menunggu persetujuan.</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
            </div>
          </div>
          <FooterNavigationUser activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link to="/user">
                <button className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Ajukan Izin</h1>
                <p className="text-blue-100 text-sm">Buat pengajuan izin baru</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 -mt-6 relative z-10 pb-24">
          <div className="space-y-6">
            {/* Quick Templates */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-blue-600" />
                Template Cepat
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {quickTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-sm ${template.color} ${formData.title === template.title ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      {template.icon}
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{template.title}</div>
                        <div className="text-sm text-gray-600">{template.content}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Detail Pengajuan
              </h3>

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
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.detail}
                      onChange={(e) => handleInputChange("detail", e.target.value)}
                      placeholder="Contoh: 25-26 Juni 2025"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Comment Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.comment}
                      onChange={(e) => handleInputChange("comment", e.target.value)}
                      placeholder="Tambahkan catatan atau keterangan lain (opsional)"
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            {isFormValid && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Preview Pengajuan
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Judul:</span>
                    <p className="text-gray-900 font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Alasan:</span>
                    <p className="text-gray-900">{formData.content}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Periode:</span>
                    <p className="text-gray-900 font-medium">{formData.detail}</p>
                  </div>
                  {formData.comment && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Catatan:</span>
                      <p className="text-gray-900">{formData.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
                  isFormValid && !isSubmitting ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95" : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Pengajuan</span>
                  </>
                )}
              </button>

              {!isFormValid && <p className="text-center text-sm text-gray-500 mt-2">Lengkapi semua field yang wajib diisi</p>}
            </div>
          </div>
        </div>

        <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
        <FooterNavigationUser activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </UserLayout>
  );
};

export default AjukanIzinForm;

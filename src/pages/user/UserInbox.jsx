import React, { useState } from "react";
import { Search, Filter, Mail, MailOpen, Bell, Settings, Clock, User, MoreVertical, Star, StarOff, Trash2, Archive, ChevronRight } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import CustomHelmet from "../../components/CustomHelmet";

// Data dummy inbox messages
const inboxData = [
  {
    id: "1",
    sender: "Ahmad Wijaya",
    senderRole: "Frontend Developer",
    subject: "Update Progress Project Dashboard",
    content: "Halo, saya ingin memberikan update terkait progress pengembangan dashboard. Saat ini sudah mencapai 85% dan diperkirakan akan selesai minggu depan.",
    timestamp: "2024-06-24T10:30:00",
    isRead: false,
    isStarred: true,
    priority: "high",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "2",
    sender: "HR Department",
    senderRole: "Human Resources",
    subject: "Pengumuman Cuti Bersama Lebaran",
    content: "Kepada seluruh karyawan, berikut adalah pengumuman resmi mengenai jadwal cuti bersama Lebaran 2024. Mohon untuk mempersiapkan pekerjaan dengan baik.",
    timestamp: "2024-06-24T09:15:00",
    isRead: true,
    isStarred: false,
    priority: "medium",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "3",
    sender: "Maya Putri",
    senderRole: "Project Manager",
    subject: "Meeting Reminder - Weekly Standup",
    content: "Reminder untuk meeting weekly standup hari ini pukul 14.00 WIB. Agenda: review sprint progress, blockers, dan planning sprint berikutnya.",
    timestamp: "2024-06-24T08:45:00",
    isRead: false,
    isStarred: false,
    priority: "high",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "4",
    sender: "IT Support",
    senderRole: "IT Infrastructure",
    subject: "Maintenance Server Scheduled",
    content: "Informasi maintenance server yang dijadwalkan pada hari Sabtu, 29 Juni 2024 pukul 02.00-06.00 WIB. Harap backup data penting sebelumnya.",
    timestamp: "2024-06-23T16:20:00",
    isRead: true,
    isStarred: true,
    priority: "medium",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "5",
    sender: "Sari Indah",
    senderRole: "UI/UX Designer",
    subject: "Review Design System Update",
    content: "Hi team, saya sudah update design system untuk mobile app. Mohon review dan feedback nya. File sudah saya upload di shared drive.",
    timestamp: "2024-06-23T14:10:00",
    isRead: false,
    isStarred: false,
    priority: "low",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: "6",
    sender: "Finance Department",
    senderRole: "Finance",
    subject: "Reimbursement Request Approved",
    content: "Pengajuan reimbursement Anda dengan nomor REF-2024-0156 telah disetujui. Dana akan ditransfer dalam 2-3 hari kerja.",
    timestamp: "2024-06-23T11:30:00",
    isRead: true,
    isStarred: false,
    priority: "low",
    avatar: "/api/placeholder/40/40",
  },
];

const filterOptions = ["Semua", "Belum Dibaca", "Berbintang", "Prioritas Tinggi"];
const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

// Helper functions
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getPriorityLabel = (priority) => {
  const labels = {
    high: "Tinggi",
    medium: "Sedang",
    low: "Rendah",
  };
  return labels[priority];
};

const InboxContent = ({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter, filteredMessages, activeTab, toggleStar, markAsRead }) => (
  <>
    <CustomHelmet title="Inbox | Aplikasi Izin" description="Halaman Inbox User" />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-sm font-bold">Inbox</h1>
              <p className="text-blue-100 text-sm">Pesan dan notifikasi</p>
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-500 bg-opacity-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">{inboxData.length}</div>
            <div className="text-xs text-blue-100">Total Pesan</div>
          </div>
          <div className="bg-blue-500 bg-opacity-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">{inboxData.filter((msg) => !msg.isRead).length}</div>
            <div className="text-xs text-blue-100">Belum Dibaca</div>
          </div>
          <div className="bg-blue-500 bg-opacity-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">{inboxData.filter((msg) => msg.isStarred).length}</div>
            <div className="text-xs text-blue-100">Berbintang</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="px-4 -mt-4 relative z-10 mb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari pengirim, subjek, atau isi pesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">Filter Pesan</div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Message Filter */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedFilter === filter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 mb-4">
        <div className="text-sm text-gray-600">
          Menampilkan {filteredMessages.length} dari {inboxData.length} pesan
        </div>
      </div>

      {/* Messages List */}
      <div className="px-4 space-y-3 pb-24">
        {filteredMessages.map((message) => (
          <div key={message.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4  }`} onClick={() => markAsRead(message.id)}>
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">{getInitials(message.sender)}</span>
              </div>

              {/* Message Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-sm font-semibold ${!message.isRead ? "text-gray-900" : "text-gray-700"}`}>{message.sender}</h3>
                      {!message.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{message.senderRole}</p>
                    <p className={`text-sm mb-2 ${!message.isRead ? "font-medium text-gray-900" : "text-gray-700"}`}>{message.subject}</p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(message.id);
                      }}
                      className="p-1 text-gray-400 hover:text-yellow-500"
                    >
                      {message.isStarred ? <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Preview */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{message.content}</p>

                {/* Message Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatTimestamp(message.timestamp)}</span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${message.priority === "high" ? "bg-red-100 text-red-700" : message.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                      >
                        {getPriorityLabel(message.priority)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">{message.isRead ? <MailOpen className="w-3 h-3 text-gray-400" /> : <Mail className="w-3 h-3 text-blue-500" />}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                  <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Balas
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                    <Archive className="w-4 h-4 mr-1" />
                    Arsip
                  </button>
                  <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pesan ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau filter pesan</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <FooterNavigationUser activeTab={activeTab} />
    </div>
  </>
);

const InboxPage = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [messages, setMessages] = useState(inboxData);

  const toggleStar = (messageId) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg)));
  };

  const markAsRead = (messageId) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg)));
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = message.sender.toLowerCase().includes(searchTerm.toLowerCase()) || message.subject.toLowerCase().includes(searchTerm.toLowerCase()) || message.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "Semua" || (selectedFilter === "Belum Dibaca" && !message.isRead) || (selectedFilter === "Berbintang" && message.isStarred) || (selectedFilter === "Prioritas Tinggi" && message.priority === "high");

    return matchesSearch && matchesFilter;
  });

  return (
    <UserLayout>
      <InboxContent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filteredMessages={filteredMessages}
        activeTab={activeTab}
        toggleStar={toggleStar}
        markAsRead={markAsRead}
      />
    </UserLayout>
  );
};

export default InboxPage;

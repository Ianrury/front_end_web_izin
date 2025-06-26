// pages/admin/AdminUsers.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Plus, Search, Filter, Eye, Edit, Trash2, Check, X, MoreVertical } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import CustomHelmet from "../../components/CustomHelmet";
import { Link } from "react-router-dom";
import { ListUser, ubahRoleUser } from "../../services/admin.api";
import useToast from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";

const AdminUsers = ({ navigate, currentPage = "users" }) => {
  const { toasts, hideToast, showSuccess, showDanger, showWarning } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal states for role change
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Pagination states
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await ListUser();
        setUsers(response.data || []);
        setError("");
      } catch (err) {
        showWarning("Gagal mengambil data user.", { duration: 4000 });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      setUpdatingRole(true);
      await ubahRoleUser(selectedUser.id);

      setUsers((prevUsers) => prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, role: user.role === "USER" ? "VERIFIER" : "USER" } : user)));

      setShowRoleModal(false);
      setSelectedUser(null);
      showSuccess("Role user berhasil diubah!", { duration: 4000 });
    } catch (error) {
      showWarning("Gagal mengubah role user.", { duration: 4000 });
    } finally {
      setUpdatingRole(false);
    }
  };

  // Open role change modal
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  // Close role change modal
  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  // Filter and search logic using useMemo for performance
  const filteredUsers = useMemo(() => {
    if (!users.length) return [];

    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" || user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || user.department?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && user.status === "Karyawan Tetap") ||
        (filterStatus === "pending" && user.status === "Pending") ||
        (filterStatus === "inactive" && user.status === "Tidak Aktif") ||
        (filterStatus === "verified" && user.verifikasi === "Terverifikasi") ||
        (filterStatus === "unverified" && user.verifikasi !== "Terverifikasi");

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, filterStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPageNum - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchTerm, filterStatus]);

  // Pagination handlers - using useCallback to prevent unnecessary re-renders
  const goToPage = useCallback(
    (page) => {
      setCurrentPageNum(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const goToPrevious = useCallback(() => {
    setCurrentPageNum((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentPageNum((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPageNum - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPageNum, totalPages]);

  // Get role badge color
  const getRoleBadgeColor = useCallback((role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "VERIFIER":
        return "bg-purple-100 text-purple-800";
      case "USER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  // Get status badge color
  const getStatusBadgeColor = useCallback((status) => {
    switch (status) {
      case "Karyawan Tetap":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Tidak Aktif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((e) => {
    setFilterStatus(e.target.value);
  }, []);

  return (
    <AdminLayout navigate={navigate} currentPage={currentPage}>
      <div>
        <CustomHelmet title="User | Aplikasi Izin" description="User Admin" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kelola User</h1>
              <p className="text-gray-600">Kelola pengguna dan hak akses sistem</p>
            </div>
            <Link to="/admin/create-user">
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Tambah User</span>
              </button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari user berdasarkan nama, email, atau departemen..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select value={filterStatus} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Semua Status</option>
                  <option value="active">Karyawan Tetap</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="verified">Terverifikasi</option>
                  <option value="unverified">Belum Verifikasi</option>
                </select>
              </div>
            </div>

            {/* Search Results Info */}
            {(searchTerm || filterStatus !== "all") && (
              <div className="mt-3 text-sm text-gray-600">
                Menampilkan {filteredUsers.length} dari {users.length} user
                {searchTerm && (
                  <span className="ml-2">
                    untuk pencarian "<strong>{searchTerm}</strong>"
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Memuat data user...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {currentUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {filteredUsers.length === 0 ? (searchTerm || filterStatus !== "all" ? "Tidak ada user yang sesuai dengan kriteria pencarian." : "Belum ada user yang terdaftar.") : "Tidak ada data pada halaman ini."}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departemen</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verifikasi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bergabung</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentUsers.map((userData, index) => (
                          <tr key={userData.id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-medium">{userData.username?.charAt(0)?.toUpperCase() || "U"}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{userData.username || "N/A"}</div>
                                  <div className="text-sm text-gray-500">{userData.email || "N/A"}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">{userData.department || "N/A"}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(userData.role)}`}>{userData.role || "N/A"}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(userData.status)}`}>{userData.status || "N/A"}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {userData.verifikasi === "Terverifikasi" ? (
                                <span className="text-green-600 flex items-center text-sm">
                                  <Check className="h-4 w-4 mr-1" />
                                  Terverifikasi
                                </span>
                              ) : (
                                <span className="text-red-600 flex items-center text-sm">
                                  <X className="h-4 w-4 mr-1" />
                                  Belum Verifikasi
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userData.bergabung || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                {userData.role !== "ADMIN" && (
                                  <button onClick={() => openRoleModal(userData)} className="text-green-600 hover:text-green-800 p-1 tooltip" title={userData.role === "USER" ? "Jadikan Verifier" : "Jadikan User"}>
                                    <Edit className="h-4 w-4" />
                                  </button>
                                )}
                                {userData.role === "ADMIN" && <span className="text-gray-400 text-xs">-</span>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={goToPrevious}
                      disabled={currentPageNum === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={currentPageNum === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Menampilkan <span className="font-medium">{startIndex + 1}</span> sampai <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> dari{" "}
                        <span className="font-medium">{filteredUsers.length}</span> hasil
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={goToPrevious}
                          disabled={currentPageNum === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {getPageNumbers().map((page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPageNum ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={goToNext}
                          disabled={currentPageNum === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Role Change Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Ubah Role</h3>

                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-medium">{selectedUser?.username?.charAt(0)?.toUpperCase() || "U"}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{selectedUser?.username || "N/A"}</div>
                      <div className="text-sm text-gray-500">{selectedUser?.email || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">
                    Apakah Anda yakin ingin mengubah role user ini dari <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(selectedUser?.role)}`}>{selectedUser?.role}</span> menjadi{" "}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(selectedUser?.role === "USER" ? "VERIFIER" : "USER")}`}>{selectedUser?.role === "USER" ? "VERIFIER" : "USER"}</span>?
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button onClick={closeRoleModal} disabled={updatingRole} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    Batal
                  </button>
                  <button onClick={handleRoleChange} disabled={updatingRole} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {updatingRole ? "Mengubah..." : "Ya, Ubah Role"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <ToastContainer toasts={toasts} onHideToast={hideToast} position="top-right" />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

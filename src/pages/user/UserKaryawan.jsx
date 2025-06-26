import React, { useState } from "react";
import { Search, Filter, Users, Phone, Mail, MapPin, Calendar, ChevronRight, User, MoreVertical, MessageCircle, Building, Award, Home, Bell, Settings } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import CustomHelmet from "../../components/CustomHelmet";


// Data dummy karyawan
const employeesData = [
  {
    id: "1",
    name: "Ahmad Wijaya",
    position: "Frontend Developer",
    department: "IT Development",
    email: "ahmad.wijaya@company.com",
    phone: "+62 812-3456-7890",
    location: "Jakarta",
    joinDate: "2023-01-15",
    avatar: "/api/placeholder/60/60",
    status: "active",
    division: "Technology",
  },
  {
    id: "2",
    name: "Sari Indah",
    position: "UI/UX Designer",
    department: "Design",
    email: "sari.indah@company.com",
    phone: "+62 813-4567-8901",
    location: "Bandung",
    joinDate: "2022-11-20",
    avatar: "/api/placeholder/60/60",
    status: "active",
    division: "Creative",
  },
  {
    id: "3",
    name: "Budi Santoso",
    position: "Backend Developer",
    department: "IT Development",
    email: "budi.santoso@company.com",
    phone: "+62 814-5678-9012",
    location: "Surabaya",
    joinDate: "2023-03-10",
    avatar: "/api/placeholder/60/60",
    status: "active",
    division: "Technology",
  },
  {
    id: "4",
    name: "Maya Putri",
    position: "Project Manager",
    department: "Management",
    email: "maya.putri@company.com",
    phone: "+62 815-6789-0123",
    location: "Jakarta",
    joinDate: "2021-08-05",
    avatar: "/api/placeholder/60/60",
    status: "active",
    division: "Management",
  },
  {
    id: "5",
    name: "Rizky Pratama",
    position: "DevOps Engineer",
    department: "IT Infrastructure",
    email: "rizky.pratama@company.com",
    phone: "+62 816-7890-1234",
    location: "Yogyakarta",
    joinDate: "2022-12-01",
    avatar: "/api/placeholder/60/60",
    status: "active",
    division: "Technology",
  },
  {
    id: "6",
    name: "Dewi Lestari",
    position: "HR Specialist",
    department: "Human Resources",
    email: "dewi.lestari@company.com",
    phone: "+62 817-8901-2345",
    location: "Jakarta",
    joinDate: "2023-02-14",
    avatar: "/api/placeholder/60/60",
    status: "active",
    division: "HR",
  },
];

const departments = ["Semua", "IT Development", "Design", "Management", "IT Infrastructure", "Human Resources"];

// Fungsi helper dipindahkan ke luar komponen
const formatJoinDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getDivisionColor = (division) => {
  const colors = {
    Technology: "bg-blue-100 text-blue-700",
    Creative: "bg-purple-100 text-purple-700",
    Management: "bg-green-100 text-green-700",
    HR: "bg-orange-100 text-orange-700",
  };
  return colors[division] || "bg-gray-100 text-gray-700";
};

// Komponen KaryawanContent dipindahkan ke luar dan menerima props
const KaryawanContent = ({ searchTerm, setSearchTerm, selectedDepartment, setSelectedDepartment, showFilter, setShowFilter, filteredEmployees, activeTab }) => (
  <>
    <CustomHelmet title="Karyawan | Aplikasi Izin" description="Halaman User" />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-sm font-bold">Karyawan</h1>
              <p className="text-blue-100 text-sm">Daftar karyawan perusahaan</p>
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
            <div className="text-lg font-bold">{employeesData.length}</div>
            <div className="text-xs text-blue-100">Total Karyawan</div>
          </div>
          <div className="bg-blue-500 bg-opacity-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">{departments.length - 1}</div>
            <div className="text-xs text-blue-100">Departemen</div>
          </div>
          <div className="bg-blue-500 bg-opacity-50 rounded-xl p-3 text-center">
            <div className="text-lg font-bold">{employeesData.filter((e) => e.status === "active").length}</div>
            <div className="text-xs text-blue-100">Aktif</div>
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
              placeholder="Cari nama, posisi, atau departemen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">Filter Departemen</div>
            <button onClick={() => setShowFilter(!showFilter)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedDepartment === dept ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 mb-4">
        <div className="text-sm text-gray-600">
          Menampilkan {filteredEmployees.length} dari {employeesData.length} karyawan
        </div>
      </div>

      {/* Employee List */}
      <div className="px-4 space-y-3 pb-24">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">{getInitials(employee.name)}</span>
              </div>

              {/* Employee Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{employee.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{employee.position}</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDivisionColor(employee.division)}`}>
                      <Building className="w-3 h-3 mr-1" />
                      {employee.department}
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Mail className="w-3 h-3 mr-2" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Phone className="w-3 h-3 mr-2" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-2" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      <span>Bergabung {formatJoinDate(employee.joinDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
                    <User className="w-4 h-4 mr-1" />
                    Profil
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
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada karyawan ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau filter departemen</p>
          </div>
        )}
      </div>
      {/* Bottom Navigation */}
      <FooterNavigationUser activeTab={activeTab} />
    </div>
  </>
);

const KaryawanPage = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("Semua");
  const [showFilter, setShowFilter] = useState(false);

  const filteredEmployees = employeesData.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || employee.position.toLowerCase().includes(searchTerm.toLowerCase()) || employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = selectedDepartment === "Semua" || employee.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <UserLayout>
      <KaryawanContent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        filteredEmployees={filteredEmployees}
        activeTab={activeTab}
      />
    </UserLayout>
  );
};

export default KaryawanPage;

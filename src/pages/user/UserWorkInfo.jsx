import React, { useState } from "react";
import { User, Calendar, MapPin, Heart, Users, ArrowLeft, Save, Edit3, Building, Briefcase, Clock, Award, Mail, Phone, CreditCard } from "lucide-react";
import FooterNavigationUser from "../../components/FooterNavigasiUser";
import UserLayout from "../../layouts/UserLayout";
import CustomHelmet from "../../components/CustomHelmet";

const WorkInfoPage = () => {
  const [activeTab, setActiveTab] = useState("account");

  // Data informasi kerja karyawan
  const workData = {
    employeeId: "EMP-2024-001",
    fullName: "John Doe",
    position: "Senior Software Developer",
    department: "Information Technology",
    division: "Product Development",
    employmentType: "Karyawan Tetap",
    startDate: "2022-01-15",
    workLocation: "Jakarta Office",
    reportingTo: "Jane Smith",
    employmentStatus: "Aktif",
    workingHours: "08:00 - 17:00 WIB",
    workingDays: "Senin - Jumat",
    salary: "Rp 15.000.000",
    level: "Senior Level",
    company: {
      name: "PT. Teknologi Maju Indonesia",
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      phone: "+62 21 1234 5678",
      email: "hr@teknologimaju.co.id",
    },
    benefits: ["Asuransi Kesehatan", "BPJS Ketenagakerjaan", "Tunjangan Transport", "Tunjangan Makan", "Annual Leave 12 hari"],
    workHistory: [
      {
        position: "Senior Software Developer",
        startDate: "2024-01-01",
        endDate: "Sekarang",
        status: "current",
      },
      {
        position: "Software Developer",
        startDate: "2022-01-15",
        endDate: "2023-12-31",
        status: "previous",
      },
    ],
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calculateWorkDuration = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} tahun ${months} bulan`;
    } else {
      return `${months} bulan`;
    }
  };

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );

  return (
    <>
      <CustomHelmet title="Informasi Kerja | Aplikasi Izin" description="Informasi kerja karyawan" />

      <UserLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-b-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button className="p-2 bg-blue-500 rounded-full hover:bg-blue-400 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold">Informasi Kerja</h1>
                  <p className="text-blue-100 text-sm">Data informasi kerja karyawan</p>
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>

            {/* Employee Summary Card */}
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{workData.fullName}</h2>
                  <p className="text-blue-100">{workData.position}</p>
                  <p className="text-blue-200 text-sm">{workData.department}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{workData.employmentStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Informasi Dasar */}
            <InfoCard icon={CreditCard} title="Informasi Dasar">
              <div className="space-y-1">
                <InfoRow label="ID Karyawan" value={workData.employeeId} />
                <InfoRow label="Jabatan" value={workData.position} />
                <InfoRow label="Departemen" value={workData.department} />
                <InfoRow label="Divisi" value={workData.division} />
                <InfoRow label="Status Karyawan" value={workData.employmentType} />
                <InfoRow label="Level" value={workData.level} />
              </div>
            </InfoCard>

            {/* Informasi Kerja */}
            <InfoCard icon={Clock} title="Informasi Kerja">
              <div className="space-y-1">
                <InfoRow label="Tanggal Masuk" value={formatDate(workData.startDate)} />
                <InfoRow label="Masa Kerja" value={calculateWorkDuration(workData.startDate)} />
                <InfoRow label="Lokasi Kerja" value={workData.workLocation} icon={MapPin} />
                <InfoRow label="Atasan Langsung" value={workData.reportingTo} icon={User} />
                <InfoRow label="Jam Kerja" value={workData.workingHours} icon={Clock} />
                <InfoRow label="Hari Kerja" value={workData.workingDays} icon={Calendar} />
              </div>
            </InfoCard>

            {/* Informasi Perusahaan */}
            <InfoCard icon={Building} title="Informasi Perusahaan">
              <div className="space-y-1">
                <InfoRow label="Nama Perusahaan" value={workData.company.name} />
                <InfoRow label="Alamat" value={workData.company.address} icon={MapPin} />
                <InfoRow label="Telepon" value={workData.company.phone} icon={Phone} />
                <InfoRow label="Email" value={workData.company.email} icon={Mail} />
              </div>
            </InfoCard>

            {/* Tunjangan & Benefit */}
            <InfoCard icon={Award} title="Tunjangan & Benefit">
              <div className="grid grid-cols-1 gap-3">
                {workData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">{benefit}</span>
                  </div>
                ))}
              </div>
            </InfoCard>

            {/* Riwayat Jabatan */}
            <InfoCard icon={Briefcase} title="Riwayat Jabatan">
              <div className="space-y-4">
                {workData.workHistory.map((history, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${history.status === "current" ? "bg-blue-500" : "bg-gray-300"}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{history.position}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${history.status === "current" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>{history.status === "current" ? "Aktif" : "Selesai"}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(history.startDate)} - {history.endDate === "Sekarang" ? "Sekarang" : formatDate(history.endDate)}
                        </p>
                      </div>
                    </div>
                    {index < workData.workHistory.length - 1 && <div className="absolute left-1.5 top-6 w-0.5 h-8 bg-gray-200"></div>}
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>

          {/* Footer Navigation */}
          <FooterNavigationUser activeTab={activeTab} />
        </div>
      </UserLayout>
    </>
  );
};

export default WorkInfoPage;

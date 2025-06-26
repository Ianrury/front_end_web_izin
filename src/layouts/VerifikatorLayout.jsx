import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";

const VerifikatorLayout = ({ children, navigate, currentPage }) => {
  const { user } = useAuth();
  const initial = user.username.charAt(0).toUpperCase();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header navigate={navigate} currentPage={currentPage} hideOnMobile={false} showHeader={true} userInitial={initial} username={user.username} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar navigate={navigate} currentPage={currentPage} />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default VerifikatorLayout;

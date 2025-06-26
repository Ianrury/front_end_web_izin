import React from "react";
import Header from "../components/Header";

const UserLayout = ({ children, navigate, currentPage, username = "User", userInitial = "U" }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        navigate={navigate}
        currentPage={currentPage}
        username={username}
        userInitial={userInitial}
        hideOnMobile={true}
        showHeader={true}
      />
      <div className="flex">
        <main className="flex-1 px-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

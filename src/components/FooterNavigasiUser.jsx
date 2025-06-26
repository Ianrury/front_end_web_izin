import { Home, Mail, User, Users } from "lucide-react";
import { Link } from "react-router-dom";

const FooterNavigationUser = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 max-w-7xl mx-auto">
      <div className="flex justify-around">
        <Link to="/user">
          <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${activeTab === "home" ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
        </Link>

        <Link to="/user/akun">
          <button onClick={() => setActiveTab("account")} className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${activeTab === "account" ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}>
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Akun</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FooterNavigationUser;

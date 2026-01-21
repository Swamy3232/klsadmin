import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // KLS JEWELS logo
import {
  Menu,
  X,
  UserPlus,
  CheckCircle,
  Users,
  CreditCard,
  LogOut,
  Home,
  ChevronDown,
  User,
  IndianRupee,
  Plus,
  Gem,
  Settings
} from "lucide-react";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    // { 
    //   name: "Dashboard", 
    //   path: "/dashboard", 
    //   icon: <Home className="w-4 h-4 md:w-5 md:h-5" />
    // },
    { 
      name: "Add New Member", 
      path: "/add-member", 
      icon: <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "Approve Members", 
      path: "/approve-members", 
      icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "Chitti Collections", 
      path: "/all-chitti", 
      icon: <Gem className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "New Collection", 
      path: "/add-collection", 
      icon: <Plus className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "Transactions", 
      path: "/payments", 
      icon: <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
    },
    {
      name: "Update Payments",
      path: "/update-payments",
      icon: <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
    },
    {
      name: "Gold Rates",
      path: "/update-rates",
      icon: <IndianRupee className="w-4 h-4 md:w-5 md:h-5" />
    }
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-900 via-yellow-900 to-amber-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-amber-800 transition"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <Link to="/dashboard" className="flex items-center space-x-3">
                {/* Logo Image */}
               <img
  src={logo}
  alt="KLS Jewels Logo"
  className="w-12 h-12 md:w-10 md:h-12 object-contain"
/>

                
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold tracking-tight text-amber-100">KLS JEWELS</h1>
                  <p className="text-xs text-amber-300">Gold Management System</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-3 mx-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg"
                      : "hover:bg-amber-800/50 text-amber-100"
                  }`}
                >
                  <div className={`${location.pathname === link.path ? 'text-white' : 'text-amber-300'}`}>
                    {link.icon}
                  </div>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Desktop Profile Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-amber-800/50 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-amber-900" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-amber-200 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-amber-900 rounded-xl shadow-2xl border border-amber-700 z-50 py-2">
                      <div className="px-4 py-3 border-b border-amber-700">
                        <p className="text-sm font-semibold text-amber-100">Admin User</p>
                        <p className="text-xs text-amber-300 mt-1">Gold Administrator</p>
                      </div>
                      <div className="py-2">
                        <button className="w-full px-4 py-3 text-left text-sm hover:bg-amber-800 text-amber-100 flex items-center space-x-3">
                          <User className="w-4 h-4 text-amber-300" />
                          <span>Profile</span>
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm hover:bg-amber-800 text-amber-100 flex items-center space-x-3">
                          <Settings className="w-4 h-4 text-amber-300" />
                          <span>Settings</span>
                        </button>
                      </div>
                      <div className="pt-2 border-t border-amber-700">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-red-600/20 text-amber-300 hover:text-red-400 flex items-center space-x-3"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="md:hidden p-2 rounded-lg hover:bg-amber-800 transition"
                aria-label="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-amber-900 to-yellow-900 shadow-2xl z-50 overflow-y-auto">
              <div className="p-6 border-b border-amber-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-500 rounded-full p-1">
                    <div className="w-full h-full bg-amber-900 rounded-full flex items-center justify-center">
                      <img 
                        src={logo} 
                        alt="KLS Jewels Logo" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-amber-100">KLS JEWELS</h2>
                    <p className="text-sm text-amber-300">Gold Management</p>
                  </div>
                </div>
              </div>

              {/* Mobile Profile Info */}
              <div className="p-6 border-b border-amber-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-amber-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-100">Admin</p>
                    <p className="text-sm text-amber-300">Gold Administrator</p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="p-4">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        location.pathname === link.path
                          ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white"
                          : "hover:bg-amber-800/50 text-amber-100"
                      }`}
                    >
                      <div className="flex-shrink-0">{link.icon}</div>
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Additional Options */}
              <div className="p-4 border-t border-amber-800">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-amber-100 hover:bg-amber-800/50 transition">
                    <User className="w-4 h-4 text-amber-300" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-amber-100 hover:bg-amber-800/50 transition">
                    <Settings className="w-4 h-4 text-amber-300" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              {/* Mobile Logout */}
              <div className="p-4 border-t border-amber-800">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-800 rounded-xl text-sm font-semibold text-amber-100 hover:from-amber-800 hover:to-amber-900 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-amber-600 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-amber-900" />
        </button>
      </div>

      {/* Breadcrumb for Mobile */}
      {location.pathname !== "/dashboard" && (
        <div className="md:hidden bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100 py-2 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/dashboard" className="text-amber-300 hover:text-amber-100">
                Dashboard
              </Link>
              <span className="text-amber-500">/</span>
              <span className="font-medium text-amber-100">
                {navLinks.find(link => link.path === location.pathname)?.name || "Current Page"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
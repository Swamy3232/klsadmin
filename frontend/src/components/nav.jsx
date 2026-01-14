import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  User
} from "lucide-react";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <Home className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "Add New Member", 
      path: "/add-member", 
      icon: <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "Accept/Reject Members", 
      path: "/approve-members", 
      icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "All Chitti", 
      path: "/all-chitti", 
      icon: <Users className="w-4 h-4 md:w-5 md:h-5" />
    },
    { 
      name: "Add New Collection", 
      path: "/add-collection", 
      icon: <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
    },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const userProfile = {
    name: "Admin User",
    email: "admin@chitti.com",
    role: "Administrator"
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-blue-800 transition"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Users className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold tracking-tight">Chitti Admin</h1>
                  <p className="text-xs text-blue-200">Management System</p>
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
                      ? "bg-white/20 text-white shadow-lg"
                      : "hover:bg-white/10 text-gray-200"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            {/* User Profile and Actions */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Desktop Profile Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{userProfile.name}</p>
                    <p className="text-xs text-gray-300">{userProfile.role}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 py-2">
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-semibold">{userProfile.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{userProfile.email}</p>
                      </div>
                      <div className="py-2">
                        <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-700 flex items-center space-x-3">
                          <User className="w-4 h-4" />
                          <span>Profile Settings</span>
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-700 flex items-center space-x-3">
                          <CreditCard className="w-4 h-4" />
                          <span>Billing</span>
                        </button>
                      </div>
                      <div className="pt-2 border-t border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-red-600/20 text-red-400 flex items-center space-x-3"
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
                className="md:hidden p-2 rounded-lg hover:bg-red-600/20 transition"
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
            <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-900 to-blue-900 shadow-2xl z-50 overflow-y-auto">
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Chitti Admin</h2>
                    <p className="text-sm text-blue-300">Management System</p>
                  </div>
                </div>
              </div>

              {/* Mobile Profile Info */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{userProfile.name}</p>
                    <p className="text-sm text-gray-400">{userProfile.role}</p>
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
                          ? "bg-white/20 text-white"
                          : "hover:bg-white/10 text-gray-200"
                      }`}
                    >
                      <div className="flex-shrink-0">{link.icon}</div>
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Additional Options */}
              <div className="p-4 border-t border-gray-800">
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-200 hover:bg-white/10 transition">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm text-gray-200 hover:bg-white/10 transition">
                    <CreditCard className="w-4 h-4" />
                    <span>Billing</span>
                  </button>
                </div>
              </div>

              {/* Mobile Logout */}
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Floating Action Button (For quick access) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Breadcrumb for Mobile */}
      {location.pathname !== "/dashboard" && (
        <div className="md:hidden bg-gradient-to-r from-gray-800 to-blue-800 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/dashboard" className="text-blue-300 hover:text-white">
                Dashboard
              </Link>
              <span className="text-gray-400">/</span>
              <span className="font-medium">
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
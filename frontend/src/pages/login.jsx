import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  LogIn,
  Building2,
  Users
} from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Predefined credentials
  const validCredentials = {
    username: "Admin",
    password: "KLSgold2026"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (username === validCredentials.username && password === validCredentials.password) {
        // Store login state
        localStorage.setItem("isLoggedIn", "true");
        if (rememberMe) {
          localStorage.setItem("rememberedUser", username);
        } else {
          localStorage.removeItem("rememberedUser");
        }
        
        // Navigate to dashboard
        navigate("/add-member");
      } else {
        setError("Invalid username or password. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setUsername(validCredentials.username);
    setPassword(validCredentials.password);
  };

  const handleForgotPassword = () => {
    alert("Default credentials:\nUsername: Admin\nPassword: KLSgold2026");
  };

  // Check for remembered user
  React.useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      setUsername(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-4 sm:py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center md:justify-start">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg sm:rounded-xl">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">KLS Gold Chitti</h1>
                <p className="text-xs sm:text-sm text-blue-200">Admin Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-12 relative z-10">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Side - Branding & Info */}
            <div className="text-center lg:text-left">
              <div className="mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center lg:justify-start mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-2xl">
                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                  Secure Admin Access
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-blue-200 mb-6 sm:mb-8 px-4 lg:px-0">
                  Manage your chitti members and collections with full control
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-800/50 rounded-lg sm:rounded-xl flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Member Management</h3>
                    <p className="text-sm sm:text-base text-blue-200">Add, view, and manage all chitti members</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-purple-800/50 rounded-lg sm:rounded-xl flex-shrink-0">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white">Secure Payments</h3>
                    <p className="text-sm sm:text-base text-blue-200">Track and manage all EMI payments securely</p>
                  </div>
                </div>
              </div>

              {/* <div className="mt-10 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <p className="text-blue-200 text-sm">
                  <strong>Demo Credentials:</strong> Username: <code className="bg-white/10 px-2 py-1 rounded">Admin</code> • Password: <code className="bg-white/10 px-2 py-1 rounded">KLSgold2026</code>
                </p>
              </div> */}
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                    <LogIn className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Admin Login</h3>
                  <p className="text-sm sm:text-base text-blue-200 mt-1 sm:mt-2">Enter your credentials to continue</p>
                </div>

                {error && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg sm:rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-red-200 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 sm:pl-10 pr-3 py-3 sm:py-3.5 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                        placeholder="Enter username"
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 sm:pl-10 pr-10 py-3 sm:py-3.5 bg-white/5 border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                        placeholder="Enter password"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center min-w-[44px]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 hover:text-blue-300" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 hover:text-blue-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/5"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-blue-200">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs sm:text-sm text-blue-300 hover:text-blue-200 transition min-h-[44px] sm:min-h-0"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full min-h-[44px] py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Sign In
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="w-full min-h-[44px] py-3 px-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-yellow-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition text-sm sm:text-base"
                    >
                      Use Demo Credentials
                    </button>
                  </div>
                </form>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-blue-200">
                      <span className="text-white font-semibold">Important:</span> Keep your credentials secure. 
                      Contact system administrator for any issues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-3 sm:py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-blue-300">
              © {new Date().getFullYear()} KLS Gold Chitti Admin System. All rights reserved.
            </p>
            <p className="text-xs text-blue-400 mt-1">
              Version 2.0 • Secure Authentication Enabled
            </p>
          </div>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default LoginPage;
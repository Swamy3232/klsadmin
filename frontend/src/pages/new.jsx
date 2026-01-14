import React, { useState } from "react";
import axios from "axios";
import { 
  UserPlus, 
  Phone, 
  User, 
  Home, 
  Lock, 
  Package, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    phone: "",
    full_name: "",
    address: "",
    password: "",
    selected_pack: "",
    start_date: "",
    total_months: 24, // Fixed to 24 months
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo data for quick fill
  const demoData = [
    {
      phone: "9876543210",
      full_name: "John Smith",
      address: "123 Main St, New York",
      password: "demo123",
      selected_pack: "3000",
      start_date: new Date().toISOString().split('T')[0],
    },
    {
      phone: "9123456789",
      full_name: "Sarah Johnson",
      address: "456 Oak Ave, Chicago",
      password: "demo456",
      selected_pack: "2000",
      start_date: new Date().toISOString().split('T')[0],
    }
  ];

  // Pack options as per requirement: 500,1000,2000,3000,4000,5000
  const packOptions = [
    { value: "500", label: "Basic Plan - ₹500" },
    { value: "1000", label: "Standard Plan - ₹1,000" },
    { value: "2000", label: "Premium Plan - ₹2,000" },
    { value: "3000", label: "Business Plan - ₹3,000" },
    { value: "4000", label: "Professional Plan - ₹4,000" },
    { value: "5000", label: "Enterprise Plan - ₹5,000" },
  ];

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fill with demo data
  const fillWithDemo = (index) => {
    setFormData({
      ...demoData[index],
      total_months: 24,
      start_date: new Date().toISOString().split('T')[0]
    });
    setMessage("");
    setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "https://klsbackend.onrender.com/create-customer",
        formData
      );
      setMessage(res.data.message || "Customer added successfully!");
      setFormData({
        phone: "",
        full_name: "",
        address: "",
        password: "",
        selected_pack: "",
        start_date: "",
        total_months: 24, // Reset to 24
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      phone: "",
      full_name: "",
      address: "",
      password: "",
      selected_pack: "",
      start_date: "",
      total_months: 24,
    });
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Add New Customer
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Add new customers to your system. All plans are for a fixed 24-month period.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              {/* Status Messages */}
              {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 font-medium">{message}</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        placeholder="Enter full name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Home className="w-4 h-4" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter complete address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        placeholder="Set password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Subscription Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Package className="w-4 h-4" />
                        Select Package
                      </label>
                      <select
                        name="selected_pack"
                        value={formData.selected_pack}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                        required
                      >
                        <option value="">Choose a package</option>
                        {packOptions.map((pack) => (
                          <option key={pack.value} value={pack.value}>
                            {pack.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4" />
                        Duration (Fixed)
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl flex items-center justify-between">
                        <span className="text-gray-700">24 Months</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                          Fixed Term
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Add Customer
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar - Demo & Info */}
          <div className="space-y-8">
            {/* Demo Data Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Quick Demo Fill
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Click below to fill form with demo data for testing:
              </p>
              
              <div className="space-y-3">
                {demoData.map((demo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => fillWithDemo(index)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-blue-300 hover:shadow-md transition"
                  >
                    <div className="font-medium text-gray-800">{demo.full_name}</div>
                    <div className="text-sm text-gray-600 mt-1">Phone: {demo.phone}</div>
                    <div className="text-sm text-gray-600">Package: ₹{demo.selected_pack}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Package Info Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Package Details
              </h3>
              <div className="space-y-3">
                {packOptions.map((pack) => (
                  <div
                    key={pack.value}
                    className={`p-3 border rounded-lg ${
                      formData.selected_pack === pack.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-gray-800">₹{pack.value}</div>
                    <div className="text-sm text-gray-600">{pack.label.split(' - ')[0]}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Note</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      All subscriptions are for a fixed 24-month period. The duration cannot be changed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Current Selection</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Package:</span>
                  <span className="font-semibold">
                    {formData.selected_pack ? `₹${formData.selected_pack}` : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Duration:</span>
                  <span className="font-semibold">24 months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Start Date:</span>
                  <span className="font-semibold">
                    {formData.start_date || 'Not selected'}
                  </span>
                </div>
                <div className="pt-4 border-t border-blue-500">
                  <div className="flex justify-between items-center text-lg">
                    <span>Total Value:</span>
                    <span className="font-bold">
                      {formData.selected_pack 
                        ? `₹${(parseInt(formData.selected_pack) || 0).toLocaleString()}`
                        : '₹0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
import React, { useState } from "react";
import axios from "axios";
import { 
  UserPlus, 
  Phone, 
  User, 
  Home, 
  Lock, 
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
    start_date: "",
    total_months: 24,
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
      start_date: new Date().toISOString().split('T')[0],
      total_months: 24,
    },
    {
      phone: "9123456789",
      full_name: "Sarah Johnson",
      address: "456 Oak Ave, Chicago",
      password: "demo456",
      start_date: new Date().toISOString().split('T')[0],
      total_months: 12,
    }
  ];

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fill with demo data
  const fillWithDemo = (index) => {
    setFormData({
      ...demoData[index],
      start_date: new Date().toISOString().split('T')[0]
    });
    setMessage("");
    setError("");
  };

  // Helper function to extract error message from FastAPI validation errors
  const extractErrorMessage = (error) => {
    if (!error?.response?.data) {
      return "Something went wrong. Please try again.";
    }

    const detail = error.response.data.detail;

    // If detail is a string, return it directly
    if (typeof detail === "string") {
      return detail;
    }

    // If detail is an array (FastAPI validation errors)
    if (Array.isArray(detail)) {
      return detail.map((err) => {
        const field = err.loc && err.loc.length > 1 ? err.loc[err.loc.length - 1] : "field";
        return `${field}: ${err.msg}`;
      }).join(", ");
    }

    // If detail is an object
    if (typeof detail === "object") {
      return detail.msg || detail.message || JSON.stringify(detail);
    }

    return "Something went wrong. Please try again.";
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      // Prepare payload matching backend API - convert total_months to number
      const payload = {
        phone: formData.phone,
        full_name: formData.full_name,
        address: formData.address,
        password: formData.password,
        start_date: formData.start_date,
        total_months: parseInt(formData.total_months, 10),
      };

      const res = await axios.post(
        "https://klsbackend.onrender.com/create-customer",
        payload
      );
      setMessage(res.data.message || "Customer added successfully!");
      setFormData({
        phone: "",
        full_name: "",
        address: "",
        password: "",
        start_date: "",
        total_months: 24,
      });
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
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
            Add new customers to your system. Select duration of 12 or 24 months.
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
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Subscription Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Duration
                      </label>
                      <select
                        name="total_months"
                        value={formData.total_months}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                        required
                      >
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                      </select>
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
                    <div className="text-sm text-gray-600">Duration: {demo.total_months} months</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Subscription Info
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-800">12 Months Plan</div>
                  <div className="text-sm text-gray-600">Short-term subscription</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-800">24 Months Plan</div>
                  <div className="text-sm text-gray-600">Long-term subscription</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Note</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Customer will be created with "pending" status and requires admin approval.
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
                  <span className="text-blue-100">Duration:</span>
                  <span className="font-semibold">
                    {formData.total_months || 24} months
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Start Date:</span>
                  <span className="font-semibold">
                    {formData.start_date || 'Not selected'}
                  </span>
                </div>
                <div className="pt-4 border-t border-blue-500">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-100">Status:</span>
                    <span className="font-semibold text-yellow-300">Pending Approval</span>
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
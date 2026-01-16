import React, { useState } from "react";
import axios from "axios";
import { 
  CreditCard, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Smartphone,
  IndianRupee,
  Hash,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    paidAmount: "",
    utrNumber: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    // Phone validation (Indian format: 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    // Amount validation
    if (!formData.paidAmount) {
      errors.paidAmount = "Amount is required";
    } else if (parseFloat(formData.paidAmount) <= 0) {
      errors.paidAmount = "Amount must be greater than 0";
    } else if (parseFloat(formData.paidAmount) > 1000000) {
      errors.paidAmount = "Amount exceeds maximum limit";
    }

    // UTR validation
    const utrRegex = /^[a-zA-Z0-9]{8,20}$/;
    if (!formData.utrNumber) {
      errors.utrNumber = "UTR number is required";
    } else if (!utrRegex.test(formData.utrNumber)) {
      errors.utrNumber = "Please enter a valid UTR number (8-20 characters)";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setFormErrors({});

    try {
      const response = await axios.post("https://klsbackend.onrender.com/create-payment", {
        phone: formData.phone,
        paid_amount: parseFloat(formData.paidAmount),
        utr_number: formData.utrNumber
      });

      setMessage({ 
        text: response.data.message || "Payment submitted successfully!", 
        type: "success" 
      });
      
      // Reset form
      setFormData({
        phone: "",
        paidAmount: "",
        utrNumber: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);

    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          "Error submitting payment. Please try again.";
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl mb-6">
            <CreditCard className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Payment Submission
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Submit your EMI payment securely with UTR verification
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="text-sm text-gray-600">Bank-level security</p>
                </div>
              </div>
              <p className="text-gray-700">
                All transactions are encrypted and processed securely with UTR verification.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Processing</h3>
                  <p className="text-sm text-gray-600">Real-time updates</p>
                </div>
              </div>
              <p className="text-gray-700">
                Payments are processed immediately and reflected in your account instantly.
              </p>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-3">Need Help?</h3>
              <p className="mb-4 text-emerald-100">
                Contact our support team for assistance with payments.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Smartphone className="w-3 h-3" />
                  </div>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-3 h-3" />
                  </div>
                  <span>support@goldfinance.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                  <p className="text-gray-600">Enter your payment information below</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Phone Number
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">+91</span>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit phone number"
                      className={`w-full pl-14 pr-4 py-3 border ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      maxLength="10"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Payment Amount
                    </div>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-700 font-medium">₹</span>
                    </div>
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-4 py-3 border ${
                        formErrors.paidAmount ? 'border-red-300' : 'border-gray-300'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      step="0.01"
                      min="1"
                    />
                  </div>
                  {formErrors.paidAmount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.paidAmount}
                    </p>
                  )}
                </div>

                {/* UTR Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      UTR Number
                    </div>
                  </label>
                  <input
                    type="text"
                    name="utrNumber"
                    value={formData.utrNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your transaction reference number"
                    className={`w-full px-4 py-3 border ${
                      formErrors.utrNumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                  />
                  {formErrors.utrNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.utrNumber}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Unique Transaction Reference number from your bank receipt
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
                    loading ? 'opacity-80 cursor-not-allowed' : 'hover:from-emerald-600 hover:to-emerald-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      Submit Payment
                    </div>
                  )}
                </button>
              </form>

              {/* Status Message */}
              {message.text && (
                <div className={`mt-6 p-4 rounded-xl border ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'success' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        message.type === 'success' ? 'text-emerald-800' : 'text-red-800'
                      }`}>
                        {message.text}
                      </p>
                      {message.type === 'success' && (
                        <p className="text-sm text-emerald-600 mt-1">
                          Payment details have been recorded successfully.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  By submitting this payment, you agree to our{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </a>
                  . All payments are subject to verification and processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
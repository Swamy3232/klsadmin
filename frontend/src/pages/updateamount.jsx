import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CreditCard,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  TrendingUp,
  IndianRupee,
  Calendar,
  User,
  Phone,
  Eye,
  MoreVertical,
  ChevronRight,
  Shield,
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight as RightIcon,
  Check,
  X,
  BarChart3,
  FileText,
  Layers
} from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // "table" or "monthly"

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter, monthFilter, yearFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://klsbackend.onrender.com/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMonths = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];
    
    const months = [
      { value: "01", label: "January", short: "Jan" },
      { value: "02", label: "February", short: "Feb" },
      { value: "03", label: "March", short: "Mar" },
      { value: "04", label: "April", short: "Apr" },
      { value: "05", label: "May", short: "May" },
      { value: "06", label: "June", short: "Jun" },
      { value: "07", label: "July", short: "Jul" },
      { value: "08", label: "August", short: "Aug" },
      { value: "09", label: "September", short: "Sep" },
      { value: "10", label: "October", short: "Oct" },
      { value: "11", label: "November", short: "Nov" },
      { value: "12", label: "December", short: "Dec" }
    ];

    return { years, months };
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        p =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.phone?.includes(searchTerm) ||
          p.utr_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.approval_status === statusFilter);
    }

    // Apply month filter
    if (monthFilter !== "all") {
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.created_at);
        const paymentMonth = String(paymentDate.getMonth() + 1).padStart(2, '0');
        const paymentYear = paymentDate.getFullYear();
        
        if (monthFilter === "current") {
          const now = new Date();
          return paymentMonth === String(now.getMonth() + 1).padStart(2, '0') && 
                 paymentYear === now.getFullYear();
        }
        
        return paymentMonth === monthFilter && paymentYear === parseInt(yearFilter);
      });
    }

    setFilteredPayments(filtered);
  };

  const updateStatus = async (payment, status) => {
    try {
      setUpdatingId(payment.id);

      await axios.put("https://klsbackend.onrender.com/update-payment", {
        phone: payment.phone,
        created_at: payment.created_at,
        approval_status: status,
      });

      fetchPayments();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedPayments.length === 0) return;

    try {
      const promises = selectedPayments.map(paymentId => {
        const payment = payments.find(p => p.id === paymentId);
        if (!payment) return Promise.resolve();
        
        return axios.put("https://klsbackend.onrender.com/update-payment", {
          phone: payment.phone,
          created_at: payment.created_at,
          approval_status: bulkAction,
        });
      });

      await Promise.all(promises);
      setSelectedPayments([]);
      setBulkAction("");
      fetchPayments();
    } catch (err) {
      console.error("Bulk update failed:", err);
    }
  };

  const togglePaymentSelection = (paymentId) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const selectAllPayments = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(p => p.id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getMonthlyStats = () => {
    const monthlyData = {};
    const { years, months } = getMonths();

    // Initialize monthly data
    years.forEach(year => {
      monthlyData[year] = {};
      months.forEach(month => {
        monthlyData[year][month.value] = {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          amount: 0
        };
      });
    });

    // Populate with actual data
    payments.forEach(payment => {
      const date = new Date(payment.created_at);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      
      if (monthlyData[year] && monthlyData[year][month]) {
        monthlyData[year][month].total++;
        monthlyData[year][month][payment.approval_status]++;
        if (payment.approval_status === "approved") {
          monthlyData[year][month].amount += payment.paid_amount || 0;
        }
      }
    });

    return monthlyData;
  };

  const getStats = () => {
    // Use filteredPayments to show stats according to current filters
    const total = filteredPayments.length;
    const approved = filteredPayments.filter(p => p.approval_status === "approved").length;
    const pending = filteredPayments.filter(p => p.approval_status === "pending").length;
    const rejected = filteredPayments.filter(p => p.approval_status === "rejected").length;
    const totalAmount = filteredPayments
      .filter(p => p.approval_status === "approved")
      .reduce((sum, p) => sum + (p.paid_amount || 0), 0);

    return { total, approved, pending, rejected, totalAmount };
  };

  const stats = getStats();
  const monthlyStats = getMonthlyStats();
  const { years, months } = getMonths();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading payments data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payments Dashboard</h1>
                <p className="text-gray-600">Manage and review all payment transactions</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-xl border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 flex items-center gap-2 ${viewMode === "table" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-4 py-2 flex items-center gap-2 ${viewMode === "monthly" ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">Monthly</span>
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={fetchPayments}
              className="flex items-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Payments</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.total}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Approved</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Pending</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-600 mt-1 sm:mt-2">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Rejected</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mt-1 sm:mt-2">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Amount</p>
                <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="relative">
                <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronRight className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 rotate-90 pointer-events-none" />
              </div>

              <div className="relative">
                <CalendarDays className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm sm:text-base"
                >
                  <option value="all">All Months</option>
                  <option value="current">Current Month</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 rotate-90 pointer-events-none" />
              </div>

              {monthFilter !== "all" && monthFilter !== "current" && (
                <div className="relative">
                  <Calendar className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm sm:text-base"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPayments.length > 0 && (
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedPayments.length} payment{selectedPayments.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-blue-700">Choose an action below</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Action</option>
                  <option value="approved">Approve Selected</option>
                  <option value="rejected">Reject Selected</option>
                </select>
                
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                
                <button
                  onClick={() => setSelectedPayments([])}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Monthly View */}
        {viewMode === "monthly" ? (
          <div className="space-y-6">
            {/* Year Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Payment Summary</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-bold">{yearFilter}</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <RightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Monthly Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {months.map(month => {
                  const monthData = monthlyStats[yearFilter]?.[month.value] || {
                    total: 0, approved: 0, pending: 0, rejected: 0, amount: 0
                  };
                  
                  return (
                    <div 
                      key={month.value}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setMonthFilter(month.value);
                        setViewMode("table");
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{month.label}</h4>
                        <div className="text-sm text-gray-500">{monthData.total} payments</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Approved</span>
                          <span className="font-semibold text-green-600">{monthData.approved}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Pending</span>
                          <span className="font-semibold text-amber-600">{monthData.pending}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rejected</span>
                          <span className="font-semibold text-red-600">{monthData.rejected}</span>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Amount</span>
                            <span className="font-bold text-purple-600">
                              ₹{monthData.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                          onChange={selectAllPayments}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 sm:w-5 sm:h-5"
                        />
                        <span className="hidden sm:inline">Customer</span>
                        <span className="sm:hidden">Customer</span>
                      </div>
                    </th>
                    <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </div>
                    </th>
                    <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4" />
                        <span className="hidden sm:inline">Amount</span>
                        <span className="sm:hidden">Amt</span>
                      </div>
                    </th>
                    <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        UTR Number
                      </div>
                    </th>
                    <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date & Time
                      </div>
                    </th>
                    <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <CreditCard className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                          <p className="text-gray-600 max-w-md">
                            {searchTerm || statusFilter !== "all" || monthFilter !== "all"
                              ? "Try adjusting your search or filter criteria"
                              : "No payment transactions available"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="p-3 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <input
                              type="checkbox"
                              checked={selectedPayments.includes(payment.id)}
                              onChange={() => togglePaymentSelection(payment.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                            />
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{payment.name}</p>
                              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Payment #{payment.id?.slice(-6)}</p>
                              <p className="text-xs text-gray-500 sm:hidden">{payment.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 sm:p-6 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm">{payment.phone}</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-6">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-lg sm:text-xl font-bold text-gray-900">
                              ₹{payment.paid_amount?.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-6 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            </div>
                            <span className="font-mono text-xs sm:text-sm truncate">{payment.utr_number}</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-6">
                          <span
                            className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border text-xs sm:text-sm font-medium ${getStatusColor(
                              payment.approval_status
                            )}`}
                          >
                            {getStatusIcon(payment.approval_status)}
                            <span className="hidden sm:inline">{payment.approval_status?.charAt(0).toUpperCase() + payment.approval_status?.slice(1)}</span>
                            <span className="sm:hidden">{payment.approval_status?.charAt(0).toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="p-3 sm:p-6 hidden lg:table-cell">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {new Date(payment.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(payment.created_at).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="p-3 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            {payment.approval_status === "pending" ? (
                              <>
                                <button
                                  onClick={() => updateStatus(payment, "approved")}
                                  disabled={updatingId === payment.id}
                                  className="min-h-[44px] px-3 sm:px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                  {updatingId === payment.id ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  <span className="hidden sm:inline">Approve</span>
                                  <span className="sm:hidden">App</span>
                                </button>
                                <button
                                  onClick={() => updateStatus(payment, "rejected")}
                                  disabled={updatingId === payment.id}
                                  className="min-h-[44px] px-3 sm:px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                  {updatingId === payment.id ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                  <span className="hidden sm:inline">Reject</span>
                                  <span className="sm:hidden">Rej</span>
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button className="min-h-[44px] min-w-[44px] p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                  <Eye className="w-5 h-5" />
                                </button>
                                <span className="text-gray-400 italic text-xs sm:text-sm hidden sm:inline">Processed</span>
                              </div>
                            )}
                            <button className="min-h-[44px] min-w-[44px] p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {filteredPayments.length > 0 && (
              <div className="px-3 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing <span className="font-semibold">{filteredPayments.length}</span> of{" "}
                  <span className="font-semibold">{payments.length}</span> payments
                  {monthFilter !== "all" && (
                    <span className="hidden sm:inline"> ({monthFilter === "current" ? "Current Month" : 
                      `${months.find(m => m.value === monthFilter)?.label} ${yearFilter}`})</span>
                  )}
                </p>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button className="min-h-[44px] text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                    Previous
                  </button>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">1</span>
                  <button className="min-h-[44px] text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                Payment Summary
              </h3>
              <p className="text-sm sm:text-base text-blue-700 mt-1">
                Total approved amount: <span className="font-bold">₹{stats.totalAmount.toLocaleString()}</span>
                {(searchTerm || statusFilter !== "all" || monthFilter !== "all") && (
                  <span className="text-xs sm:text-sm ml-1 sm:ml-2 text-blue-600 block sm:inline">
                    (Based on current filters)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {filteredPayments.filter(p => p.approval_status === "approved").length}
                </div>
                <div className="text-xs sm:text-sm text-green-700">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-600">
                  {filteredPayments.filter(p => p.approval_status === "pending").length}
                </div>
                <div className="text-xs sm:text-sm text-amber-700">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-red-600">
                  {filteredPayments.filter(p => p.approval_status === "rejected").length}
                </div>
                <div className="text-xs sm:text-sm text-red-700">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
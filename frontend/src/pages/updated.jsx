import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  MoreVertical,
  ChevronRight,
  Download,
  Eye
} from "lucide-react";

const UpdateCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [editStatusCustomer, setEditStatusCustomer] = useState(null);
  const [editApprovalStatus, setEditApprovalStatus] = useState("pending");

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://klsbackend.onrender.com/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone?.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.approval_status === statusFilter);
    }

    setFilteredCustomers(filtered);
  };

  const updateCustomerStatus = async (phone, status) => {
    try {
      await axios.put("https://klsbackend.onrender.com/update-customer", {
        phone,
        approval_status: status,
      });
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const openEditStatus = (customer) => {
    setEditStatusCustomer(customer);
    setEditApprovalStatus(customer?.approval_status || "pending");
    setIsEditStatusOpen(true);
  };

  const closeEditStatus = () => {
    setIsEditStatusOpen(false);
    setEditStatusCustomer(null);
    setEditApprovalStatus("pending");
  };

  const saveEditStatus = async () => {
    if (!editStatusCustomer?.phone) return;
    await updateCustomerStatus(editStatusCustomer.phone, editApprovalStatus);
    closeEditStatus();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "rejected":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getStats = () => {
    const total = customers.length;
    const approved = customers.filter(c => c.approval_status === "approved").length;
    const pending = customers.filter(c => c.approval_status === "pending").length;
    const rejected = customers.filter(c => c.approval_status === "rejected").length;
    
    return { total, approved, pending, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading customer data...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-1">Manage and review customer applications</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={fetchCustomers}
              className="flex items-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Total Customers</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.total}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
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
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm sm:text-base"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronRight className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="p-3 sm:p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                        <p className="text-gray-600 max-w-md">
                          {searchTerm || statusFilter !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "No customers available in the system"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.phone} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-3 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{customer.full_name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">Customer ID: {customer.phone?.slice(-6)}</p>
                            <p className="text-xs text-gray-600 mt-1 sm:hidden">{customer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 sm:p-6 hidden sm:table-cell">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 font-medium text-sm">{customer.phone}</span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-6">
                        <span
                          className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border text-xs sm:text-sm ${getStatusColor(
                            customer.approval_status
                          )}`}
                        >
                          {getStatusIcon(customer.approval_status)}
                          <span className="font-medium capitalize">{customer.approval_status}</span>
                        </span>
                      </td>
                      <td className="p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <button
                            onClick={() => updateCustomerStatus(customer.phone, "approved")}
                            className="min-h-[44px] px-3 sm:px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200 font-medium text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateCustomerStatus(customer.phone, "rejected")}
                            className="min-h-[44px] px-3 sm:px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => openEditStatus(customer)}
                            className="min-h-[44px] px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
                          >
                            Edit Status
                          </button>
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
          {filteredCustomers.length > 0 && (
            <div className="px-3 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing <span className="font-semibold">{filteredCustomers.length}</span> of{" "}
                <span className="font-semibold">{customers.length}</span> customers
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

        {/* Edit Status Modal */}
        {isEditStatusOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={closeEditStatus}
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Edit Approval Status</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editStatusCustomer?.full_name || "Customer"} ({editStatusCustomer?.phone})
                </p>
              </div>

              <div className="p-5 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Approval Status
                </label>
                <select
                  value={editApprovalStatus}
                  onChange={(e) => setEditApprovalStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="p-5 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={closeEditStatus}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditStatus}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateCustomer;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  User,
  Phone,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit
} from "lucide-react";

const UpdateCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.selected_pack?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(customer => 
        customer.approval_status === statusFilter
      );
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const updateCustomer = async (phone, approval_status, last_month_paid) => {
    try {
      await axios.put(
        "https://klsbackend.onrender.com/update-customer",
        { phone, approval_status, last_month_paid }
      );
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const toggleRowExpansion = (phone) => {
    setExpandedRows(prev => ({
      ...prev,
      [phone]: !prev[phone]
    }));
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateRemainingMonths = (startDate, totalMonths) => {
    if (!startDate || !totalMonths) return "N/A";
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + parseInt(totalMonths));
    const today = new Date();
    const diffMonths = (end.getFullYear() - today.getFullYear()) * 12 + 
                      (end.getMonth() - today.getMonth());
    return Math.max(0, diffMonths);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
              <p className="text-gray-600 mt-2">Update customer status and payment information</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchCustomers}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Customers
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or package..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-800">{filteredCustomers.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Showing</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {Math.min(itemsPerPage, filteredCustomers.length)}/{filteredCustomers.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Package</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Last Paid</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No customers found matching your criteria
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <CustomerRow
                      key={customer.phone}
                      customer={customer}
                      onUpdate={updateCustomer}
                      onViewDetails={handleViewDetails}
                      isExpanded={expandedRows[customer.phone]}
                      onToggleExpand={() => toggleRowExpansion(customer.phone)}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                      formatDate={formatDate}
                      calculateRemainingMonths={calculateRemainingMonths}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.full_name}</h2>
                  <p className="text-gray-600">{selectedCustomer.phone}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">{selectedCustomer.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">₹{selectedCustomer.selected_pack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedCustomer.start_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Months:</span>
                      <span className="font-medium">{selectedCustomer.total_months}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Payment:</span>
                      <span className="font-medium">{formatDate(selectedCustomer.last_month_paid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining Months:</span>
                      <span className="font-medium">
                        {calculateRemainingMonths(selectedCustomer.start_date, selectedCustomer.total_months)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCustomer.approval_status)}`}>
                        {selectedCustomer.approval_status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Update Information</h3>
                <CustomerUpdateForm
                  customer={selectedCustomer}
                  onUpdate={updateCustomer}
                  onClose={() => setShowDetailsModal(false)}
                  getStatusColor={getStatusColor}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerRow = ({ 
  customer, 
  onUpdate, 
  onViewDetails,
  isExpanded,
  onToggleExpand,
  getStatusColor,
  getStatusIcon,
  formatDate,
  calculateRemainingMonths 
}) => {
  const [status, setStatus] = useState(customer.approval_status || "pending");
  const [date, setDate] = useState(customer.last_month_paid || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    onUpdate(customer.phone, status, date);
    setIsEditing(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 transition">
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{customer.full_name}</p>
              <p className="text-sm text-gray-500">Since {formatDate(customer.start_date)}</p>
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="font-mono">{customer.phone}</span>
          </div>
        </td>
        <td className="p-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <span>₹{customer.selected_pack}</span>
          </span>
        </td>
        <td className="p-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {status?.toUpperCase()}
          </span>
        </td>
        <td className="p-4">
          {isEditing ? (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDate(date)}</span>
            </div>
          )}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit payment"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewDetails(customer)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={onToggleExpand}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title="Quick update"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      
      {/* Expanded Row for Quick Update */}
      {isExpanded && (
        <tr className="bg-blue-50">
          <td colSpan="6" className="p-4">
            <div className="max-w-md">
              <h4 className="font-medium text-gray-800 mb-3">Quick Update</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update
                </button>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <div className="mb-1">
                  <span className="font-medium">Package:</span>{" "}
                  ₹{customer.selected_pack}
                </div>
                <span className="font-medium">Remaining months:</span>{" "}
                {calculateRemainingMonths(customer.start_date, customer.total_months)} months
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const CustomerUpdateForm = ({ customer, onUpdate, onClose, getStatusColor }) => {
  const [status, setStatus] = useState(customer.approval_status || "pending");
  const [date, setDate] = useState(customer.last_month_paid || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(customer.phone, status, date);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Payment Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Customer
        </button>
      </div>
    </form>
  );
};

export default UpdateCustomer;
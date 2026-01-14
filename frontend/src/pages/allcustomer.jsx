import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Phone,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  User,
  BarChart3,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const AllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const TOTAL_EMI = 24;

  const packageOptions = useMemo(() => {
    const packages = [...new Set(customers.map(c => c.selected_pack).filter(Boolean))];
    return packages.sort((a, b) => parseInt(a) - parseInt(b));
  }, [customers]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, searchTerm, statusFilter, packageFilter, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://klsbackend.onrender.com/customers/all");
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to load customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCustomers = () => {
    let filtered = [...customers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(customer => 
        customer.approval_status === statusFilter
      );
    }

    // Apply package filter
    if (packageFilter !== "all") {
      filtered = filtered.filter(customer => 
        customer.selected_pack === packageFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.full_name?.toLowerCase();
          bValue = b.full_name?.toLowerCase();
          break;
        case "phone":
          aValue = a.phone;
          bValue = b.phone;
          break;
        case "package":
          aValue = parseInt(a.selected_pack) || 0;
          bValue = parseInt(b.selected_pack) || 0;
          break;
        case "paid":
          aValue = calculatePaidEMI(a);
          bValue = calculatePaidEMI(b);
          break;
        case "remaining":
          aValue = calculateRemainingEMI(a);
          bValue = calculateRemainingEMI(b);
          break;
        default:
          aValue = a.full_name?.toLowerCase();
          bValue = b.full_name?.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const calculatePaidEMI = (customer) => {
    return customer.remaining_emi !== null ? TOTAL_EMI - customer.remaining_emi : 0;
  };

  const calculateRemainingEMI = (customer) => {
    return customer.remaining_emi !== null ? customer.remaining_emi : TOTAL_EMI;
  };

  const calculateCompletionPercentage = (customer) => {
    const paid = calculatePaidEMI(customer);
    return Math.round((paid / TOTAL_EMI) * 100);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "rejected": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleRowExpansion = (phone) => {
    setExpandedRows(prev => ({
      ...prev,
      [phone]: !prev[phone]
    }));
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleExportCSV = () => {
    const headers = [
      'Phone', 'Name', 'Address', 'Package', 'Start Date',
      'Last EMI Paid', 'Paid EMI', 'Remaining EMI', 'Status'
    ];
    
    const csvData = filteredCustomers.map(customer => [
      customer.phone,
      customer.full_name,
      customer.address,
      customer.selected_pack,
      customer.start_date,
      customer.last_month_paid || '-',
      calculatePaidEMI(customer),
      calculateRemainingEMI(customer),
      customer.approval_status
    ].map(field => `"${field}"`).join(','));

    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const stats = useMemo(() => {
    const total = filteredCustomers.length;
    const approved = filteredCustomers.filter(c => c.approval_status === 'approved').length;
    const totalPaidEMI = filteredCustomers.reduce((sum, c) => sum + calculatePaidEMI(c), 0);
    const avgPaidEMI = total > 0 ? (totalPaidEMI / total).toFixed(1) : 0;
    
    return { total, approved, avgPaidEMI };
  }, [filteredCustomers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer data...</p>
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
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Chitti Members</h1>
              </div>
              <p className="text-gray-600">Manage and track all chitti members and their EMI payments</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Paid EMI</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.avgPaidEMI}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total EMI</p>
                  <p className="text-2xl font-bold text-gray-800">{TOTAL_EMI}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Members
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

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
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Package
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={packageFilter}
                    onChange={(e) => setPackageFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="all">All Packages</option>
                    {packageOptions.map(pkg => (
                      <option key={pkg} value={pkg}>${pkg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="phone">Phone</option>
                  <option value="package">Package</option>
                  <option value="paid">Paid EMI</option>
                  <option value="remaining">Remaining EMI</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Member
                      {sortBy === "name" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => toggleSort("phone")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Phone
                      {sortBy === "phone" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => toggleSort("package")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Package
                      {sortBy === "package" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Last EMI Paid</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => toggleSort("paid")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Paid EMI
                      {sortBy === "paid" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    <button
                      onClick={() => toggleSort("remaining")}
                      className="flex items-center gap-1 hover:text-gray-900"
                    >
                      Remaining EMI
                      {sortBy === "remaining" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium text-gray-400">No members found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => {
                    const paidEmi = calculatePaidEMI(customer);
                    const remainingEmi = calculateRemainingEMI(customer);
                    const completionPercentage = calculateCompletionPercentage(customer);

                    return (
                      <React.Fragment key={customer.phone}>
                        <tr className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{customer.full_name}</p>
                                <p className="text-sm text-gray-500">{customer.address}</p>
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
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                              <Package className="w-3 h-3" />
                              <span className="font-semibold">${customer.selected_pack}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{formatDate(customer.start_date)}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-700">
                              {customer.last_month_paid ? formatDate(customer.last_month_paid) : "-"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-2">
                              <span className="font-bold text-green-600">{paidEmi}</span>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getCompletionColor(completionPercentage)}`}
                                  style={{ width: `${completionPercentage}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500">{completionPercentage}% complete</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-red-600">{remainingEmi}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.approval_status)}`}>
                              {getStatusIcon(customer.approval_status)}
                              {customer.approval_status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => viewCustomerDetails(customer)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleRowExpansion(customer.phone)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                title="Quick view"
                              >
                                {expandedRows[customer.phone] ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {expandedRows[customer.phone] && (
                          <tr className="bg-blue-50">
                            <td colSpan="9" className="p-4">
                              <div className="max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-white p-4 rounded-xl shadow">
                                    <h4 className="font-medium text-gray-800 mb-3">Payment Progress</h4>
                                    <div className="space-y-3">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Total EMI:</span>
                                        <span className="font-semibold">{TOTAL_EMI}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Paid EMI:</span>
                                        <span className="font-semibold text-green-600">{paidEmi}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Remaining EMI:</span>
                                        <span className="font-semibold text-red-600">{remainingEmi}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Completion:</span>
                                        <span className="font-semibold">{completionPercentage}%</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white p-4 rounded-xl shadow">
                                    <h4 className="font-medium text-gray-800 mb-3">Member Details</h4>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">{customer.address}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Joined: {formatDate(customer.start_date)}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">Package: ${customer.selected_pack}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-white p-4 rounded-xl shadow">
                                    <h4 className="font-medium text-gray-800 mb-3">Quick Stats</h4>
                                    <div className="space-y-3">
                                      <div>
                                        <div className="text-sm text-gray-600">EMI Progress</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                          <div
                                            className={`h-2 rounded-full ${getCompletionColor(completionPercentage)}`}
                                            style={{ width: `${completionPercentage}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                      <div className="text-sm">
                                        <span className="text-gray-600">Monthly Payment: </span>
                                        <span className="font-semibold">
                                          ${Math.round((parseInt(customer.selected_pack) || 0) / TOTAL_EMI)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} members
              </div>
              <div className="flex items-center gap-2">
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
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.full_name}</h2>
                    <p className="text-gray-600">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Member Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">{selectedCustomer.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">${selectedCustomer.selected_pack}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedCustomer.start_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Months:</span>
                      <span className="font-medium">{TOTAL_EMI}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Payment Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Payment:</span>
                      <span className="font-medium">
                        {selectedCustomer.last_month_paid ? formatDate(selectedCustomer.last_month_paid) : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid EMI:</span>
                      <span className="font-semibold text-green-600">{calculatePaidEMI(selectedCustomer)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining EMI:</span>
                      <span className="font-semibold text-red-600">{calculateRemainingEMI(selectedCustomer)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-semibold">{calculateCompletionPercentage(selectedCustomer)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">EMI Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {calculateCompletionPercentage(selectedCustomer)}%</span>
                    <span>{calculatePaidEMI(selectedCustomer)}/{TOTAL_EMI} EMI</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getCompletionColor(calculateCompletionPercentage(selectedCustomer))}`}
                      style={{ width: `${calculateCompletionPercentage(selectedCustomer)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCustomers;
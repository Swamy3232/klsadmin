import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Clock,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Calendar,
  User,
  Phone,
  BarChart3,
  Filter,
  Search
} from "lucide-react";

const GoldUsersSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    paymentStatus: 'all', // all, completed, pending, partial
    remainingMonths: 'all', // all, 0-3, 4-6, 7-12, 13+
    totalPaid: 'all' // all, 0-50000, 50001-100000, 100001+
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }
    
    // Apply payment status filter
    if (filters.paymentStatus !== 'all') {
      switch (filters.paymentStatus) {
        case 'completed':
          result = result.filter(user => user.remaining_months === 0);
          break;
        case 'pending':
          result = result.filter(user => user.payments_count === 0);
          break;
        case 'partial':
          result = result.filter(user => user.payments_count > 0 && user.remaining_months > 0);
          break;
      }
    }
    
    // Apply remaining months filter
    if (filters.remainingMonths !== 'all') {
      switch (filters.remainingMonths) {
        case '0-3':
          result = result.filter(user => user.remaining_months >= 0 && user.remaining_months <= 3);
          break;
        case '4-6':
          result = result.filter(user => user.remaining_months >= 4 && user.remaining_months <= 6);
          break;
        case '7-12':
          result = result.filter(user => user.remaining_months >= 7 && user.remaining_months <= 12);
          break;
        case '13+':
          result = result.filter(user => user.remaining_months >= 13);
          break;
      }
    }
    
    // Apply total paid filter
    if (filters.totalPaid !== 'all') {
      switch (filters.totalPaid) {
        case '0-50000':
          result = result.filter(user => user.total_paid >= 0 && user.total_paid <= 50000);
          break;
        case '50001-100000':
          result = result.filter(user => user.total_paid >= 50001 && user.total_paid <= 100000);
          break;
        case '100001+':
          result = result.filter(user => user.total_paid >= 100001);
          break;
      }
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredData(result);
  }, [data, searchTerm, sortConfig, filters]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("https://klsbackend.onrender.com/gold_users_summary");
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      setError("Failed to load payment summary");
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    const totalUsers = filteredData.length;
    const totalPaid = filteredData.reduce((sum, user) => sum + (user.total_paid || 0), 0);
    const totalEmis = filteredData.reduce((sum, user) => sum + (user.payments_count || 0), 0);
    const remainingEmis = filteredData.reduce((sum, user) => sum + (user.remaining_months || 0), 0);
    
    return { totalUsers, totalPaid, totalEmis, remainingEmis };
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ['Phone', 'Customer Name', 'Total EMIs', 'Paid EMIs', 'Remaining EMIs', 'Amount Paid'];
    const csvData = filteredData.map(user => [
      user.phone,
      user.full_name,
      user.total_months,
      user.payments_count,
      user.remaining_months,
      user.total_paid
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gold_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading gold users summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Data</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchSummary}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
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
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gold Users Dashboard</h1>
            </div>
            <p className="text-gray-600">Comprehensive overview of gold scheme payments and EMI status</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={fetchSummary}
              className="flex items-center gap-2 px-4 py-2.5 text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gold Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">₹{stats.totalPaid.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total EMIs Paid</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.totalEmis}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining EMIs</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.remainingEmis}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  {(filters.paymentStatus !== 'all' || filters.remainingMonths !== 'all' || filters.totalPaid !== 'all') && (
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  )}
                </button>
                
                {showFilters && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <select
                          value={filters.paymentStatus}
                          onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="all">All Users</option>
                          <option value="completed">Completed Payments</option>
                          <option value="pending">No Payments Yet</option>
                          <option value="partial">Partial Payments</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remaining EMIs</label>
                        <select
                          value={filters.remainingMonths}
                          onChange={(e) => setFilters({...filters, remainingMonths: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="all">All</option>
                          <option value="0-3">0-3 months</option>
                          <option value="4-6">4-6 months</option>
                          <option value="7-12">7-12 months</option>
                          <option value="13+">13+ months</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount Paid</label>
                        <select
                          value={filters.totalPaid}
                          onChange={(e) => setFilters({...filters, totalPaid: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="all">All Amounts</option>
                          <option value="0-50000">₹0 - ₹50,000</option>
                          <option value="50001-100000">₹50,001 - ₹1,00,000</option>
                          <option value="100001+">₹1,00,001+</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setFilters({ paymentStatus: 'all', remainingMonths: 'all', totalPaid: 'all' })}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="flex-1 px-3 py-2 text-sm text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('phone')}
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone {getSortIcon('phone')}
                    </div>
                  </th>
                  <th 
                    className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('full_name')}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer {getSortIcon('full_name')}
                    </div>
                  </th>
                  <th 
                    className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('total_months')}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Total EMIs {getSortIcon('total_months')}
                    </div>
                  </th>
                  <th 
                    className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('payments_count')}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Paid EMIs {getSortIcon('payments_count')}
                    </div>
                  </th>
                  <th 
                    className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('remaining_months')}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Remaining {getSortIcon('remaining_months')}
                    </div>
                  </th>
                  <th 
                    className="p-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => requestSort('total_paid')}
                  >
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Amount Paid {getSortIcon('total_paid')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600 max-w-md">
                          {searchTerm 
                            ? "No users match your search criteria" 
                            : "No gold users data available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((user) => (
                    <tr 
                      key={user.phone} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-mono font-medium text-gray-900">{user.phone}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.full_name}</p>
                            <p className="text-sm text-gray-500">Gold Plan Member</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-700">{user.total_months}</span>
                          </div>
                          <div className="text-sm text-gray-600">Total months</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <span className="text-lg font-bold text-emerald-700">{user.payments_count}</span>
                          </div>
                          <div className="text-sm text-gray-600">EMIs completed</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <span className="text-lg font-bold text-amber-700">{user.remaining_months}</span>
                          </div>
                          <div className="text-sm text-gray-600">Months left</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="text-xl font-bold text-gray-900">₹{user.total_paid?.toLocaleString()}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                                style={{ 
                                  width: `${Math.min((user.payments_count / user.total_months) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round((user.payments_count / user.total_months) * 100)}% completed
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredData.length}</span> of{" "}
                <span className="font-semibold">{data.length}</span> gold users
              </p>
              <div className="flex items-center gap-4">
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100">
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-900">1</span>
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-900">Gold Scheme Performance</h3>
              <p className="text-amber-700 mt-1">
                {filteredData.length === data.length ? 'Total' : 'Filtered'} collection from {filteredData.length === data.length ? 'all' : ''} gold users: <span className="font-bold">₹{stats.totalPaid.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-amber-700">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">
                {filteredData.length > 0 ? 
                  Math.round((stats.totalEmis / (stats.totalEmis + stats.remainingEmis)) * 100) : 0}% EMI Completion Rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldUsersSummary;
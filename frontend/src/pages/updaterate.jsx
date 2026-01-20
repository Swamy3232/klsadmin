import React, { useState, useEffect } from "react";

const MetalRates = () => {
  const [metalRates, setMetalRates] = useState([]);
  const [newMetalForm, setNewMetalForm] = useState({
    metal_type: "",
    purity: "",
    rate_per_gram: "",
    rate_per_carat: "",
    currency: "INR",
    effective_date: "",
    updated_by: "",
  });
  
  const [editingRate, setEditingRate] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const apiUrl = "https://klsbackend.onrender.com";

  // ---------------- GET ----------------
  const fetchMetalRates = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-metal-rates`);
      const data = await res.json();
      setMetalRates(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMetalRates();
  }, []);

  // ---------------- POST ----------------
  const handleAddMetal = async () => {
    try {
      const res = await fetch(`${apiUrl}/create-metal-rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMetalForm),
      });
      const data = await res.json();
      alert(data.message || "Metal rate added successfully!");
      fetchMetalRates();
      resetNewMetalForm();
      setIsAddingNew(false);
    } catch (err) {
      console.error(err);
      alert("Error adding metal rate");
    }
  };

  // ---------------- PUT ----------------
 const handleUpdate = async () => {
  if (!editingRate || !editingRate.id) {
    alert("Invalid record selected");
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/update-metal-rate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingRate.id,                // ✅ REQUIRED
        purity: editingRate.purity,
        rate_per_gram: Number(editingRate.rate_per_gram),
        rate_per_carat: Number(editingRate.rate_per_carat),
        currency: editingRate.currency,
        updated_by: editingRate.updated_by,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to update metal rate");
    }

    const data = await res.json();
    alert(data.message || "Updated successfully!");
    fetchMetalRates();
    setEditingRate(null);
  } catch (err) {
    console.error(err);
    alert(err.message || "Error updating metal rate");
  }
};

  // Helper functions
  const resetNewMetalForm = () => {
    setNewMetalForm({
      metal_type: "",
      purity: "",
      rate_per_gram: "",
      rate_per_carat: "",
      currency: "INR",
      effective_date: "",
      updated_by: "",
    });
  };

  const startEdit = (rate) => {
    setEditingRate({ ...rate });
  };

  const cancelEdit = () => {
    setEditingRate(null);
  };

  const cancelAddNew = () => {
    setIsAddingNew(false);
    resetNewMetalForm();
  };

  // Filter metal rates based on search
  const filteredRates = metalRates.filter(rate =>
    rate.metal_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.purity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique metal types for dropdown
  const metalTypes = [...new Set(metalRates.map(rate => rate.metal_type))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Metal Rates Management</h1>
          <p className="text-gray-600">Manage and update current metal rates</p>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search metals or purity..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Metal Rate
          </button>
        </div>

        {/* Metal Rates Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Current Metal Rates</h2>
            <p className="text-sm text-gray-600 mt-1">Click edit to update rates for specific metals</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Metal Type",
                    "Purity",
                    "Rate/Gram (₹)",
                    "Rate/Carat (₹)",
                    "Currency",
                    "Effective Date",
                    "Updated By",
                    "Actions"
                  ].map((head) => (
                    <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRates.map((rate) => (
                  <React.Fragment key={rate.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {rate.metal_type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {rate.purity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{parseFloat(rate.rate_per_gram).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{parseFloat(rate.rate_per_carat).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rate.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(rate.effective_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rate.updated_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startEdit(rate)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                    
                    {/* Edit Form Row */}
                    {editingRate && editingRate.id === rate.id && (
                      <tr className="bg-blue-50">
                        <td colSpan="8" className="px-6 py-4">
                          <div className="bg-white p-4 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                              Edit {rate.metal_type} Rate (Effective: {new Date(rate.effective_date).toLocaleDateString('en-IN')})
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Metal Type (Cannot be changed)
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                  value={editingRate.metal_type}
                                  readOnly
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Effective Date (Cannot be changed)
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                  value={new Date(editingRate.effective_date).toLocaleDateString('en-IN')}
                                  readOnly
                                  disabled
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Purity *
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  value={editingRate.purity}
                                  onChange={(e) => setEditingRate({...editingRate, purity: e.target.value})}
                                  placeholder="e.g., 24K, 99.9%"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Rate per Gram (₹) *
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  value={editingRate.rate_per_gram}
                                  onChange={(e) => setEditingRate({...editingRate, rate_per_gram: e.target.value})}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Rate per Carat (₹)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  value={editingRate.rate_per_carat}
                                  onChange={(e) => setEditingRate({...editingRate, rate_per_carat: e.target.value})}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Currency
                                </label>
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  value={editingRate.currency}
                                  onChange={(e) => setEditingRate({...editingRate, currency: e.target.value})}
                                >
                                  <option value="INR">INR (₹)</option>
                                  <option value="USD">USD ($)</option>
                                  <option value="EUR">EUR (€)</option>
                                  <option value="GBP">GBP (£)</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Updated By *
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  value={editingRate.updated_by}
                                  onChange={(e) => setEditingRate({...editingRate, updated_by: e.target.value})}
                                  placeholder="Enter your name"
                                />
                              </div>
                              <div className="flex items-end gap-2">
                                <button
                                  onClick={handleUpdate}
                                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                  Save Changes
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                              * Note: Metal Type and Effective Date cannot be changed as they are used to identify the rate entry.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Metal Form */}
        {isAddingNew && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Metal Rate</h2>
              <button
                onClick={cancelAddNew}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metal Type *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Gold, Silver, Platinum, Diamond"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newMetalForm.metal_type}
                  onChange={(e) => setNewMetalForm({...newMetalForm, metal_type: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purity (e.g., 24K, 99.9%, 1 Carat) *
                </label>
                <input
                  type="text"
                  placeholder="24K"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newMetalForm.purity}
                  onChange={(e) => setNewMetalForm({...newMetalForm, purity: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate per Gram (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newMetalForm.rate_per_gram}
                  onChange={(e) => setNewMetalForm({...newMetalForm, rate_per_gram: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rate per Carat (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1000.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newMetalForm.rate_per_carat}
                  onChange={(e) => setNewMetalForm({...newMetalForm, rate_per_carat: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newMetalForm.currency}
                  onChange={(e) => setNewMetalForm({...newMetalForm, currency: e.target.value})}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date *
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newMetalForm.effective_date}
                  onChange={(e) => setNewMetalForm({...newMetalForm, effective_date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Updated By *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newMetalForm.updated_by}
                  onChange={(e) => setNewMetalForm({...newMetalForm, updated_by: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={cancelAddNew}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMetal}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Metal Rate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetalRates;
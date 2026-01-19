import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  Check, 
  X,
  Image as ImageIcon
} from 'lucide-react';

const KLSGoldAdmin = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Gold',
    weight_gm: '',
    gender: 'Male',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const itemTypes = ['Gold', 'Silver', 'Diamond', 'Platinum', 'Other'];
  const genders = ['Male', 'Female', 'Unisex'];

  // Fetch all collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/gold');
      const result = await response.json();
      if (result.status === 'success') {
        setCollections(result.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setDeleteLoading(id);
    try {
      const response = await fetch(`http://127.0.0.1:8000/gold/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.status === 'deleted') {
        setCollections(collections.filter(item => item.id !== id));
        setSuccessMessage('Item deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.weight_gm || formData.weight_gm <= 0) {
      errors.weight_gm = 'Valid weight is required';
    }
    
    if (!formData.image) {
      errors.image = 'Image is required';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('weight_gm', formData.weight_gm);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('image', formData.image);
      
      const response = await fetch('http://127.0.0.1:8000/gold', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setSuccessMessage('New item added successfully!');
        setCollections(prev => [...prev, result.data[0]]);
        resetForm();
        setShowAddForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding collection:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Gold',
      weight_gm: '',
      gender: 'Male',
      image: null
    });
    setPreviewImage(null);
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 shadow-lg">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KLS Gold Admin</h1>
          <p className="text-gray-600 mt-2">Manage your gold collection</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collections List - Takes 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">All Collections</h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add New Item
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
                  <p className="text-gray-500">Add your first gold item to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collections.map((item) => (
                    <div 
                      key={item.id} 
                      className="relative group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteLoading === item.id}
                        className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        {deleteLoading === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Item Content */}
                      <div className="flex">
                        {/* Image */}
                        <div className="w-32 h-32 flex-shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.type === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                              item.type === 'Silver' ? 'bg-gray-100 text-gray-800' :
                              item.type === 'Diamond' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Weight:</span>
                              <span>{item.weight_gm} gm</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Gender:</span>
                              <span>{item.gender}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Added:</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Form Sidebar */}
          {showAddForm && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Add New Item</h2>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Diamond Ring, Gold Chain"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {itemTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type }))}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                            formData.type === type
                              ? type === 'Gold' 
                                ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                : type === 'Silver'
                                ? 'bg-gray-100 border-gray-500 text-gray-700'
                                : type === 'Diamond'
                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : 'bg-purple-100 border-purple-500 text-purple-700'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight and Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (gm) *
                      </label>
                      <input
                        type="number"
                        name="weight_gm"
                        value={formData.weight_gm}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                          formErrors.weight_gm ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="42.0"
                      />
                      {formErrors.weight_gm && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.weight_gm}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        {genders.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image *
                    </label>
                    <div className="space-y-4">
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setFormData(prev => ({ ...prev, image: null }));
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="block">
                          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 transition-colors cursor-pointer bg-gray-50">
                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload image
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, JPEG up to 5MB
                            </p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                      {formErrors.image && (
                        <p className="text-sm text-red-600">{formErrors.image}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Add Item
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Floating Add Button (Mobile) */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-colors z-40"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default KLSGoldAdmin;
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../../utils/axios';

function EditActivityModal({ isOpen, onClose, onConfirm, isLoading, activity }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hours: '',
    month: '',
    format: 'ออนไลน์',
    max_attempts: '',
    category_id: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const months = [
    { value: '1', label: 'มกราคม' },
    { value: '2', label: 'กุมภาพันธ์' },
    { value: '3', label: 'มีนาคม' },
    { value: '4', label: 'เมษายน' },
    { value: '5', label: 'พฤษภาคม' },
    { value: '6', label: 'มิถุนายน' },
    { value: '7', label: 'กรกฎาคม' },
    { value: '8', label: 'สิงหาคม' },
    { value: '9', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (activity) {
      setFormData({
        name: activity.name || '',
        description: activity.description || '',
        hours: activity.hours || '',
        month: activity.month || '',
        format: activity.format || 'ออนไลน์',
        max_attempts: activity.max_attempts || '',
        category_id: activity.category_id || ''
      });
      if (activity.image_url) {
        setImagePreview(activity.image_url);
      }
    }
  }, [activity]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/category/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
    }
  };

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Validate required fields
      if (!formData.name || !formData.hours || !formData.month || !formData.category_id) {
        setError('กรุณากรอกข้อมูลให้ครบถ้วน');
        setSubmitting(false);
        return;
      }

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const result = await onConfirm(submitData);
      
      if (result?.success) {
        // Reset form
        setImageFile(null);
        setImagePreview('');
        setError('');
        onClose();
      } else {
        setError(result?.message || 'เกิดข้อผิดพลาดในการแก้ไขกิจกรรม');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขกิจกรรม');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user makes changes
  };

  const isDisabled = isLoading || submitting;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">แก้ไขกิจกรรม</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDisabled}
            className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อกิจกรรม
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
                placeholder="กรุณากรอกชื่อกิจกรรม"
                required
                disabled={isDisabled}
              />
            </div>

            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                เดือนที่จัดกิจกรรม
              </label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
                required
                disabled={isDisabled}
              >
                <option value="">เลือกเดือน</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-2">
                จำนวนชั่วโมงกิจกรรม
              </label>
              <input
                type="number"
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
                placeholder="กรุณากรอกจำนวนชั่วโมง"
                required
                min="1"
                disabled={isDisabled}
              />
            </div>

            <div>
              <label htmlFor="max_attempts" className="block text-sm font-medium text-gray-700 mb-2">
                จำนวนครั้งที่ทำได้
              </label>
              <input
                type="number"
                id="max_attempts"
                name="max_attempts"
                value={formData.max_attempts}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
                placeholder="กรุณากรอกจำนวนครั้งที่ทำได้"
                required
                min="1"
                disabled={isDisabled}
              />
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
                รูปแบบกิจกรรม
              </label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
                disabled={isDisabled}
              >
                <option value="ออนไลน์">ออนไลน์</option>
                <option value="ออนไซต์">ออนไซต์</option>
              </select>
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
                disabled={isDisabled}
                required
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปภาพกิจกรรม
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        คลิกเพื่อเลือกรูปภาพ หรือลากไฟล์มาวาง
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isDisabled}
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                รายละเอียดกิจกรรม
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
                placeholder="กรุณากรอกรายละเอียดกิจกรรม"
                disabled={isDisabled}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDisabled}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className="px-4 py-2 text-sm font-medium text-white bg-[#3BB77E] hover:bg-[#2ea86d] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                'บันทึก'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditActivityModal;
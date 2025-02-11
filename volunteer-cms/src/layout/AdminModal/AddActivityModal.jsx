import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

function AddActivityModal({ isOpen, onClose, onConfirm, isLoading }) {
  // แยก initial state ออกมาเพื่อใช้ในการ reset
  const initialFormState = {
    name: '',
    description: '',
    hours: '',
    month: '', 
    format: 'ออนไลน์',
    max_attempts: '',
    category_id: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ใช้ useMemo เพื่อไม่ต้องสร้าง array ใหม่ทุกครั้งที่ render
  const months = useMemo(() => [
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
    { value: '12', label: 'ธันวาคม' },
    { value: '13', label: 'ไม่จำกัดระยะเวลา' }
  ], []);

  // ใช้ useCallback เพื่อไม่ต้องสร้างฟังก์ชันใหม่ทุกครั้งที่ render
  const fetchCategories = useCallback(async () => {
    try {
      // ถ้ามี categories อยู่แล้วไม่ต้องเรียก API ใหม่
      if (categories.length > 0) return;

      const response = await api.get('/category/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
    }
  }, [categories.length]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  // Image compression utility
  const compressImage = async (file) => {
    try {
      // ถ้าขนาดไฟล์น้อยกว่า 1MB ไม่ต้อง compress
      if (file.size < 1024 * 1024) return file;

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: (progress) => {
          setUploadProgress(Math.round(progress));
        }
      };

      const compressedBlob = await imageCompression(file, options);
      return new File([compressedBlob], file.name, { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error compressing image:', error);
      return file;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    setLocalLoading(true);
    try {
      const compressedFile = await compressImage(file);
      setImageFile(compressedFile);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
    } finally {
      setLocalLoading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'month', 'hours', 'max_attempts', 'category_id'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localLoading || !validateForm()) return;

    setLocalLoading(true);
    setUploadProgress(0);

    try {
      const submitData = new FormData();
      
      // ใส่เฉพาะข้อมูลที่มีค่า
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const config = {
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await onConfirm(submitData, config);
      
      if (response?.success) {
        toast.success('เพิ่มกิจกรรมสำเร็จ');
        handleReset();
        onClose();
      } else {
        throw new Error(response?.message || 'เกิดข้อผิดพลาดในการเพิ่มกิจกรรม');
      }
    } catch (error) {
      console.error('Error submitting activity:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง');
      } else {
        toast.error(error?.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มกิจกรรม');
      }
    } finally {
      setLocalLoading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleReset = () => {
    setFormData(initialFormState);
    setImageFile(null);
    setUploadProgress(0);
  };

  if (!isOpen) return null;

  const isFormDisabled = isLoading || localLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">เพิ่มกิจกรรม</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isFormDisabled}
            className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Input fields */}
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
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
                min="1"
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
                disabled={isFormDisabled}
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
                disabled={isFormDisabled}
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

            {/* Image upload */}
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
                      {uploadProgress > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          กำลังประมวลผล: {uploadProgress}%
                        </p>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isFormDisabled}
                    />
                  </label>
                </div>
                {imageFile && (
                  <div className="px-4 py-2 bg-gray-100 rounded-lg flex items-center">
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {imageFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                      disabled={isFormDisabled}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
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
                disabled={isFormDisabled}
              />
            </div>
          </div>

          {/* Loading Progress Bar */}
          {(isLoading || localLoading) && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#3BB77E] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isFormDisabled}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isFormDisabled}
              className="px-4 py-2 text-sm font-medium text-white bg-[#3BB77E] hover:bg-[#2ea86d] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormDisabled ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังบันทึก... {uploadProgress}%</span>
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

export default AddActivityModal;
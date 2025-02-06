import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

function DeleteCategoriesModal({ isOpen, onClose, onConfirm, categoryName, isLoading }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">ยืนยันการลบหมวดหมู่</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            คุณต้องการลบหมวดหมู่{' '}
            <span className="font-medium text-gray-900">{categoryName}</span>{' '}
            ใช่หรือไม่? การลบหมวดหมู่จะส่งผลต่อกิจกรรมทั้งหมดในหมวดหมู่นี้ และไม่สามารถย้อนกลับได้
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>กำลังลบ...</span>
              </>
            ) : (
              'ยืนยันการลบ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCategoriesModal;
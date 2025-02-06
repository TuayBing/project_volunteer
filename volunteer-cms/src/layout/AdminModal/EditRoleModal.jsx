import React, { useState } from 'react';
import { UserCog, X } from 'lucide-react';

function EditRoleModal({ isOpen, onClose, onConfirm, userName, currentRole, isLoading }) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      if (selectedRole === currentRole) {
        setError('กรุณาเลือกบทบาทใหม่ที่แตกต่างจากบทบาทปัจจุบัน');
        return;
      }
      await onConfirm(selectedRole);
    } catch (error) {
      setError(error?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนบทบาท');
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch(role.toLowerCase()) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 font-medium';
      case 'admin':
        return 'bg-blue-100 text-blue-800 font-medium';
      default:
        return 'bg-green-100 text-green-800 font-medium';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#3BB77E]/10 rounded-full">
              <UserCog className="w-6 h-6 text-[#3BB77E]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">เปลี่ยนบทบาทผู้ใช้</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            เปลี่ยนบทบาทของผู้ใช้{' '}
            <span className="font-medium text-gray-900">{userName}</span>
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 w-28">บทบาทปัจจุบัน:</label>
              <span className={`px-3 py-1.5 rounded-full text-xs ${getRoleBadgeStyle(currentRole)}`}>
                {currentRole}
              </span>
            </div>
            <div className="flex items-center">
              <label className="text-sm text-gray-600 w-28">บทบาทใหม่:</label>
              <select
                className="rounded-lg border border-gray-300 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent w-48
                          bg-white shadow-sm transition-colors cursor-pointer hover:border-[#3BB77E]"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setError(''); // Clear error when selection changes
                }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors 
                     disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || selectedRole === currentRole}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#3BB77E] hover:bg-[#3BB77E]/90 
                     rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 
                     disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#3BB77E] focus:ring-offset-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              'บันทึกการเปลี่ยนแปลง'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRoleModal;
import React from 'react';
import { CheckCircle } from 'lucide-react';

const UploadSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            อัพโหลดไฟล์สำเร็จ
          </h3>
          <p className="text-sm text-gray-500">
            ไฟล์ของคุณถูกอัพโหลดเข้าสู่ระบบเรียบร้อยแล้ว
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSuccessModal;
import React from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Modal Header */}
        <div className="bg-[#3BB77E] rounded-t-lg px-6 py-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <LogIn className="w-6 h-6" />
            เข้าสู่ระบบ
          </h3>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <LogIn className="w-12 h-12 text-[#3BB77E]" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              กรุณาเข้าสู่ระบบ
            </h4>
            <p className="text-gray-600 mb-6">
              คุณจำเป็นต้องเข้าสู่ระบบก่อนเข้าใช้งานส่วนนี้
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 bg-[#3BB77E] text-white font-medium rounded-full hover:bg-[#2ea36b] transition-colors duration-200"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
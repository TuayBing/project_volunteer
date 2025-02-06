import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyProfileState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[800px] p-6">
      <div className="text-center bg-white rounded-xl shadow-md border border-gray-200 p-10 max-w-md w-full">
        <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          ไม่พบข้อมูลนักศึกษา
        </h3>
        <p className="text-base text-gray-600 mb-6">
          กรุณากรอกข้อมูลส่วนตัวและข้อมูลนักศึกษาเพื่อเริ่มใช้งานระบบ
        </p>
        <button
          onClick={() => navigate('/profilesettings')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#3BB77E] hover:bg-[#2ea36b] transition-colors"
        >
          กรอกข้อมูลส่วนตัว
        </button>
      </div>
    </div>
  );
};

export default EmptyProfileState;
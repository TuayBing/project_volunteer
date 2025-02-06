import React from "react";
import { CheckCircle2 } from "lucide-react";

const SuccessForgot = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-green-500">
              สำเร็จ!
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              เปลี่ยนรหัสผ่านเรียบร้อยแล้ว
            </p>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium text-white bg-[#3BB77E] hover:bg-[#2ea86d] transition-colors duration-200"
            >
              ดำเนินการต่อ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessForgot;
import React from 'react';
import { X } from 'lucide-react';

const PersonalDataModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-lg p-6">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">กรอกข้อมูลเพิ่มเติม</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อ</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">นามสกุล</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">เพศ</label>
            <select className="w-full p-2 border rounded-md" required>
              <option value="">เลือกเพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">รหัสนักศึกษา</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">คณะ</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">สาขา</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#3BB77E] text-white py-2 rounded-lg hover:bg-[#2ea36b]"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalDataModal;
// components/ActivityLog/StatusComponents.js
import React from 'react';
import { CheckCircle, Clock, XCircle, ChevronDown } from 'lucide-react';

// สถานะที่แสดงผล (Badge) แยกจากส่วนที่สามารถคลิกได้
export const StatusBadge = ({ status }) => {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-l-lg text-sm font-medium 
      ${status === 'สำเร็จ' || status === 'ยกเลิก' ? 'rounded-lg' : 'border-r'}
      ${getStatusStyle(status)}`}
    >
      {getStatusIcon(status)}
      <span>{status}</span>
    </div>
  );
};

// ปุ่มเปลี่ยนสถานะ จะแสดงเฉพาะสถานะที่สามารถเปลี่ยนได้
export const StatusChangeButton = ({ status, onClick }) => {
  if (status === 'สำเร็จ' || status === 'ยกเลิก') return null;

  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-r-lg transition-colors duration-200 hover:shadow-sm
        ${status === 'กำลังดำเนินการ' 
          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`}
      title="เปลี่ยนสถานะ"
    >
      <ChevronDown className="w-4 h-4" />
    </button>
  );
};

// Component หลักที่รวม Badge และปุ่มเปลี่ยนสถานะ
export const StatusControlGroup = ({ status, onStatusClick }) => {
  return (
    <div className="flex items-center relative">
      <StatusBadge status={status} />
      <StatusChangeButton status={status} onClick={onStatusClick} />
    </div>
  );
};

// Function กำหนดสไตล์ตามสถานะ
export const getStatusStyle = (status) => {
  switch (status) {
    case 'สำเร็จ':
      return 'bg-green-50 text-green-700 ring-1 ring-green-500/20 hover:bg-green-100';
    case 'กำลังดำเนินการ':
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 hover:bg-blue-100';
    case 'ยกเลิก':
      return 'bg-red-50 text-red-700 ring-1 ring-red-500/20 hover:bg-red-100';
    default:
      return 'bg-gray-50 text-gray-700 ring-1 ring-gray-500/20 hover:bg-gray-100';
  }
};

// Function กำหนดไอคอนตามสถานะ
export const getStatusIcon = (status) => {
  switch (status) {
    case 'สำเร็จ': 
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'กำลังดำเนินการ': 
      return <Clock className="w-4 h-4 text-blue-600" />;
    case 'ยกเลิก': 
      return <XCircle className="w-4 h-4 text-red-600" />;
    default: 
      return null;
  }
};

export default {
  StatusBadge,
  StatusChangeButton,
  StatusControlGroup,
  getStatusStyle,
  getStatusIcon
};
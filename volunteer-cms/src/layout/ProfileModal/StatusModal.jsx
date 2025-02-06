import React from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateActivityStatusThunk, fetchActivityDashboardStats } from '../../store/activityDashboardSlice';

const StatusModal = ({ isOpen, onClose, activity, currentStatus, onUpdateStatus }) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleStatusUpdate = async (status) => {
    try {
      await dispatch(updateActivityStatusThunk({
        activityId: activity.id,
        newStatus: status
      }));
      await dispatch(fetchActivityDashboardStats());
      onUpdateStatus(status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'สำเร็จ': return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case 'ยกเลิก': return <XCircle className="w-6 h-6 text-red-600" />;
      default: return null;
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = "flex items-center gap-4 w-full px-6 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5";
    
    switch (status) {
      case 'สำเร็จ':
        return currentStatus === 'สำเร็จ'
          ? `${baseStyle} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 opacity-50 cursor-not-allowed`
          : `${baseStyle} bg-white hover:bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:ring-emerald-600/30 hover:shadow-lg`;
      case 'ยกเลิก':
        return `${baseStyle} bg-white hover:bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:ring-red-600/30 hover:shadow-lg`;
      default:
        return baseStyle;
    }
  };

  const isDisabled = (status) => {
    return currentStatus === 'สำเร็จ' || (currentStatus === 'ยกเลิก' && status === 'ยกเลิก');
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900">
              เปลี่ยนสถานะกิจกรรม
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Activity Name Section */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-500">ชื่อกิจกรรม</span>
            </div>
            <p className="text-lg font-medium text-gray-900">
              {activity?.name}
            </p>
          </div>
        </div>

        {/* Current Status */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-blue-700 ml-2">
            สถานะปัจจุบัน: <span className="font-medium">{currentStatus}</span>
          </p>
        </div>

        {/* Status Buttons */}
        <div className="space-y-4">
          {['สำเร็จ', 'ยกเลิก'].map((status) => (
            <button
              key={status}
              className={getStatusStyle(status)}
              onClick={() => !isDisabled(status) && handleStatusUpdate(status)}
              disabled={isDisabled(status)}
            >
              {getStatusIcon(status)}
              <div className="flex flex-col items-start">
                <span className="font-medium text-base">{status}</span>
                <span className="text-sm opacity-75">
                  {status === 'สำเร็จ' ? 'ทำเครื่องหมายว่าเสร็จสิ้น' : 'ยกเลิกกิจกรรมนี้'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
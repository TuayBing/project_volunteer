import React from 'react';
import { AlertCircle, X, Clock, Archive } from 'lucide-react';

const ActivityStatusModal = ({ 
  isOpen, 
  onClose, 
  activity, 
  type = 'alreadyPrepared' 
}) => {
  if (!isOpen) return null;
 
  const modalConfig = {
    alreadyPrepared: {
      icon: <Archive className="w-6 h-6 text-red-600" />,
      bgColor: 'bg-yellow-50',
      iconBgColor: 'bg-yellow-100',
      title: 'กิจกรรมถูกเตรียมบันทึกแล้ว',
      message: 'คุณได้เตรียมบันทึกกิจกรรมนี้ไว้แล้ว กรุณาตรวจสอบในรายการกิจกรรมที่เตรียมบันทึก',
      buttonColor: 'text-yellow-600 hover:bg-yellow-50',
      borderColor: 'border-yellow-100'
    },
    maxAttemptsReached: {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      bgColor: 'bg-red-50',
      iconBgColor: 'bg-red-100',
      title: 'ไม่สามารถบันทึกกิจกรรมได้',
      message: `คุณได้ทำกิจกรรมนี้ครบจำนวนครั้งที่กำหนดแล้ว (${activity?.max_attempts || 0} ครั้ง)`,
      buttonColor: 'text-red-600 hover:bg-red-50',
      borderColor: 'border-red-100'
    }
  };

  const config = modalConfig[type];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500/75 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Close Button */}
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={onClose}
            >
              <span className="sr-only">ปิด</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Header Section */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-full ${config.iconBgColor}`}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-xl font-semibold text-gray-900"
                  id="modal-title"
                >
                  {config.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {config.message}
                </p>
              </div>
            </div>

            {/* Activity Info Card */}
            <div className={`bg-gray-50 rounded-xl p-4 mb-6 border ${config.borderColor}`}>
              <div className="flex items-start gap-4">
                {/* Activity Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={activity?.image_url || "/api/placeholder/420/126"}
                    alt={activity?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate ">
                    {activity?.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${activity?.format === 'ออนไลน์' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-orange-100 text-orange-800'}`}
                    >
                      {activity?.format}
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {activity?.hours} ชั่วโมง
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-sm font-medium 
                  ring-1 ring-inset ring-gray-300 hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                  transition-all duration-200 ease-in-out
                  ${config.buttonColor}`}
                onClick={onClose}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityStatusModal;
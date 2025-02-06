import React, { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'success'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center">
            {type === 'success' ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
            )}
            
            <h3 className={`text-lg font-medium mb-2 ${
              type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}>
              {title}
            </h3>
            
            <p className="text-sm text-gray-500 text-center mb-6">
              {message}
            </p>

            <button
              onClick={onClose}
              className={`
                w-full sm:w-auto px-6 py-2 rounded-md text-sm font-medium text-white
                ${type === 'success' 
                  ? 'bg-[#3BB77E] hover:bg-[#2ea86d]' 
                  : 'bg-red-500 hover:bg-red-600'
                }
                transition-colors duration-200
              `}
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
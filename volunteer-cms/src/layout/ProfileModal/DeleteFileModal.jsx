import React from 'react';
import { Trash2, File } from 'lucide-react';

const DeleteFileModal = ({ isOpen, onClose, onDelete, file, isDeleting, formatFileSize }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">ยืนยันการลบไฟล์</h3>
          </div>
          <p className="text-sm text-gray-500 ml-10">
            ไฟล์นี้จะถูกลบออกจากระบบอย่างถาวร
          </p>
        </div>

        {/* File Info */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <File className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">{file?.name}</p>
              <p className="text-sm text-gray-500">
                ไฟล์ PDF • {formatFileSize(file?.size)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            ยกเลิก
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600/30 border-t-red-600"></div>
                <span>กำลังลบ...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>ลบไฟล์</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFileModal;
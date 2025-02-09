import React, { useState, useEffect } from 'react';
import { Upload, File, X, Loader2, Printer, Trash2, Folder } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFiles, setLoading } from '../../store/fileSlice';
import axios from '../../utils/axios';
import DeleteFileModal from '../../layout/ProfileModal/DeleteFileModal';
import UploadSuccessModal from '../../layout/ProfileModal/UploadSuccessModal';
import { formatFileSize, formatDate } from '../../utils/formatters';

const Documents = () => {
  const dispatch = useDispatch();
  const { files, isLoading } = useSelector((state) => state.file);
  const [dragOver, setDragOver] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('/getfiles');
      if (response.data.success) {
        dispatch(setFiles(response.data.files));
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleDeleteClick = (file) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/deletefile/${selectedFile.id}`);
      if (response.data.success) {
        fetchFiles();
        setShowDeleteModal(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFiles = [...e.dataTransfer.files];
    const pdfFiles = droppedFiles.filter((file) => file.type === 'application/pdf');

    if (pdfFiles.length !== droppedFiles.length) {
      alert('กรุณาอัพโหลดเฉพาะไฟล์ PDF เท่านั้น');
      setDragOver(false);
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = pdfFiles.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      alert('ไฟล์บางรายการมีขนาดเกิน 5MB');
      setDragOver(false);
      return;
    }

    handleFiles(pdfFiles);
    setDragOver(false);
  };

  const handleFileInput = async (e) => {
    const selectedFiles = [...e.target.files];
    handleFiles(selectedFiles);
  };

  const handleFiles = async (newFiles) => {
    dispatch(setLoading(true));
    const formData = new FormData();
    newFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('/uploadfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setShowUploadSuccessModal(true);
        fetchFiles();
        document.getElementById('file-upload').value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพโหลด');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePrint = async (fileId, fileName) => {
    try {
      const response = await axios.get(`/files/download/${fileId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Print error:', error);
    }
  };

  const handleModalClose = () => {
    setShowUploadSuccessModal(false);
    document.getElementById('file-upload').value = '';
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Folder className="w-5 h-5 text-green-600" />
            แฟ้มเก็บเอกสาร
          </h2>
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={handleFileInput}
            accept=".pdf"
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            เพิ่มไฟล์
          </label>
        </div>

        {files.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[400px]">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-600 border-b border-gray-100">
              <div className="col-span-4">ชื่อ</div>
              <div className="col-span-3 text-center">ขนาดไฟล์</div>
              <div className="col-span-3 text-center">แก้ไขครั้งล่าสุด</div>
              <div className="col-span-2 text-right">จัดการ</div>
            </div>
            <div className="divide-y divide-gray-100 overflow-y-auto h-[calc(400px-57px)]">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 hover:bg-gray-50 items-center transition-colors"
                >
                  <div className="col-span-1 md:col-span-4 flex items-center min-w-0">
                    <File className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <p className="text-sm text-gray-900 truncate">{file.name}</p>
                  </div>
                  <div className="col-span-1 md:col-span-3 text-sm text-gray-500 md:text-center flex md:block items-center mt-2 md:mt-0">
                    <span className="md:hidden mr-2">ขนาด:</span>
                    {formatFileSize(file.size)}
                  </div>
                  <div className="col-span-1 md:col-span-3 text-sm text-gray-500 md:text-center flex md:block items-center mt-2 md:mt-0">
                    <span className="md:hidden mr-2">แก้ไขเมื่อ:</span>
                    {formatDate(file.created_at)}
                  </div>
                  <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handlePrint(file.id, file.name)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="พิมพ์"
                    >
                      <Printer className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(file)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-[400px] border border-dashed rounded-xl ${
              dragOver ? 'border-green-600 bg-green-50' : 'border-gray-200'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Folder className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">ยังไม่มีไฟล์เอกสาร</p>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              ลากไฟล์ PDF มาวางที่นี่ หรือ คลิกปุ่ม "เพิ่มไฟล์" ด้านบน
            </p>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-4">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <DeleteFileModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFile(null);
        }}
        onDelete={handleDelete}
        file={selectedFile}
        isDeleting={isDeleting}
        formatFileSize={formatFileSize}
      />

      <UploadSuccessModal
        isOpen={showUploadSuccessModal}
        onClose={handleModalClose}
      />
    </>
  );
};

export default Documents;
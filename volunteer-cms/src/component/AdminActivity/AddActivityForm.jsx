import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Clock, CheckCircle, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';
import AddActivityModal from '../../layout/AdminModal/AddActivityModal';
import EditActivityModal from '../../layout/AdminModal/EditActivityModal';
import DeleteActivityModal from '../../layout/AdminModal/DeleteActivityModal';
import * as XLSX from 'xlsx';
import { fetchActivities, addActivity, updateActivity, deleteActivity, selectActivities, selectActivityStatus } from '../../store/activitySlice';
import api from '../../utils/axios';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
 const canGoPrevious = currentPage > 1;
 const canGoNext = currentPage < totalPages;

 const getPageNumbers = () => {
   let pages = [];
   const maxPagesToShow = 4;

   if (totalPages <= maxPagesToShow) {
     for (let i = 1; i <= totalPages; i++) {
       pages.push(i);
     }
   } else {
     let start = Math.max(1, currentPage - 1);
     let end = Math.min(start + maxPagesToShow - 1, totalPages);
     
     if (end === totalPages) {
       start = Math.max(1, end - maxPagesToShow + 1);
     }

     for (let i = start; i <= end; i++) {
       pages.push(i);
     }
   }
   return pages;
 };

 return (
   <div className="flex justify-center items-center space-x-2 p-4">
     <button
       onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
       disabled={!canGoPrevious}
       className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
         !canGoPrevious
           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
           : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
       }`}
     >
       <ChevronLeft className="w-5 h-5" />
     </button>

     {getPageNumbers().map((number) => (
       <button
         key={number}
         onClick={() => onPageChange(number)}
         className={`w-8 h-8 rounded-full transition-all duration-200 ${
           currentPage === number
             ? 'bg-[#3BB77E] text-white'
             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
         }`}
       >
         {number}
       </button>
     ))}

     <button
       onClick={() => canGoNext && onPageChange(currentPage + 1)}
       disabled={!canGoNext}
       className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
         !canGoNext
           ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
           : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
       }`}
     >
       <ChevronRight className="w-5 h-5" />
     </button>
   </div>
 );
};

const AddActivityForm = () => {
 const dispatch = useDispatch();
 const activities = useSelector(selectActivities);
 const status = useSelector(selectActivityStatus);

 const [isAddModalOpen, setIsAddModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [selectedActivity, setSelectedActivity] = useState(null);
 const [searchTerm, setSearchTerm] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;

 const filteredActivities = activities.filter(activity =>
   activity.name.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);
 const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

 useEffect(() => {
   setCurrentPage(1);
 }, [searchTerm]);

 useEffect(() => {
   dispatch(fetchActivities());
 }, [dispatch]);

 const handleDownloadExcel = async (activity) => {
  try {
    const response = await api.get(`/activities/${activity.id}/stats`);
    
    const { completed } = response.data.data;
    const completedData = completed ? [completed] : [];

  
    const getMajorName = async (majorId) => {
      try {
        const majorResponse = await api.get(`/faculty/1/majors`); 
        const majors = majorResponse.data;
        const major = majors.find(m => m.id === majorId);
        return major ? major.name : 'ไม่ระบุสาขา';
      } catch (error) {
        console.error('Error fetching major:', error);
        return 'ไม่ระบุสาขา';
      }
    };

    const completedWithMajors = await Promise.all(completedData.map(async (user) => ({
      ...user,
      majorName: await getMajorName(user.major_id)
    })));

    const completedWS = XLSX.utils.json_to_sheet([
      [{
        v: `รายชื่อผู้ทำกิจกรรมสำเร็จ: ${activity.name}`,
        s: {
          font: { bold: true, sz: 16 },
          alignment: { horizontal: 'center' }
        }
      }],
      [],
      ['รหัสนักศึกษา', 'ชื่อ-นามสกุล', 'สาขาวิชา', 'วันที่ลงทะเบียน', 'วันที่สำเร็จ'].map(header => ({
        v: header,
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "3BB77E" } },
          alignment: { horizontal: 'center' },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        }
      })),
      ...completedWithMajors.map(user => ([
        {
          v: user.studentId,
          s: { 
            alignment: { horizontal: 'center' },
            border: { top: {style:'thin'}, bottom: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'} }
          }
        },
        {
          v: `${user.firstName} ${user.lastName}`,
          s: { 
            alignment: { horizontal: 'left' },
            border: { top: {style:'thin'}, bottom: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'} }
          }
        },
        {
          v: user.majorName, 
          s: { 
            alignment: { horizontal: 'left' },
            border: { top: {style:'thin'}, bottom: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'} }
          }
        },
        {
          v: new Date(user.registered_at).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          s: { 
            alignment: { horizontal: 'center' },
            border: { top: {style:'thin'}, bottom: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'} }
          }
        },
        {
          v: new Date(user.updated_at).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          s: { 
            alignment: { horizontal: 'center' },
            border: { top: {style:'thin'}, bottom: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'} }
          }
        }
      ]))
    ], { cellStyles: true });

    const wscols = [
      {wch: 15}, // รหัสนักศึกษา
      {wch: 25}, // ชื่อ-นามสกุล
      {wch: 40}, // สาขาวิชา
      {wch: 25}, // วันที่ลงทะเบียน
      {wch: 25}  // วันที่สำเร็จ
    ];

    completedWS['!cols'] = wscols;
    completedWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, completedWS, "ผู้ทำสำเร็จ");

    XLSX.writeFile(wb, `${activity.name}_ผู้ทำสำเร็จ.xlsx`);

  } catch (error) {
    console.error('Error downloading Excel:', error);
  }
};

const handleAddActivity = async (formData) => {
  try {
    const response = await dispatch(addActivity(formData)).unwrap();
    if (response.success) {  // ตรวจสอบ response
      setIsAddModalOpen(false);
      dispatch(fetchActivities());
      return response; // ส่งค่ากลับไป
    }
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

const handleEditActivity = async (formData) => {
  try {
    // Log formData for debugging
    console.log('FormData before dispatch:', Object.fromEntries(formData.entries()));
    
    const result = await dispatch(updateActivity({
      id: selectedActivity.id,
      formData  // ส่ง FormData ทั้งก้อน
    })).unwrap();
    
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedActivity(null);
      // เรียก fetchActivities หลังจากแก้ไขสำเร็จ
      await dispatch(fetchActivities());
    } else {
      console.error('Update failed:', result);
      alert(result.message || 'เกิดข้อผิดพลาดในการแก้ไขกิจกรรม');
    }
  } catch (error) {
    console.error('Error editing activity:', error);
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขกิจกรรม');
  }
};

 const handleDeleteActivity = async () => {
   if (!selectedActivity) return;
   try {
     await dispatch(deleteActivity(selectedActivity.id)).unwrap();
     setIsDeleteModalOpen(false);
     setSelectedActivity(null);
     dispatch(fetchActivities());
   } catch (error) {
     console.error('Error deleting activity:', error);
   }
 };

 const openEditModal = (activity) => {
   setSelectedActivity(activity);
   setIsEditModalOpen(true);
 };

 const openDeleteModal = (activity) => {
   setSelectedActivity(activity);
   setIsDeleteModalOpen(true);
 };

 const truncateText = (text, maxLength = 40) => {
   if (!text) return '';
   return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
 };

 if (status === 'loading' && activities.length === 0) {
   return (
     <div className="flex justify-center items-center h-48">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
     </div>
   );
 }

 return (
   <>
     <div className="bg-white rounded-lg shadow mt-10">
       <div className="p-4 border-b border-gray-200">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <h2 className="text-lg font-semibold text-gray-800">รายการกิจกรรม</h2>
           <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
             <div className="relative flex-grow sm:max-w-md">
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="ค้นหากิจกรรม..."
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E]/50 focus:border-[#3BB77E] transition-colors duration-200"
               />
               <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
             </div>
             <button
               onClick={() => setIsAddModalOpen(true)}
               className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#3BB77E]/90 transition-colors duration-200 whitespace-nowrap"
             >
               <Plus className="w-4 h-4" />
               เพิ่มกิจกรรม
             </button>
           </div>
         </div>
       </div>

       <div className="overflow-x-auto">
         <table className="w-full text-sm text-left">
           <thead className="text-xs text-gray-700 uppercase bg-gray-50">
             <tr>
               <th className="px-6 py-3">กิจกรรม</th>
               <th className="px-6 py-3 text-center">จำนวนชั่วโมง</th>
               <th className="px-6 py-3 text-center">ผู้สนใจ</th>
               <th className="px-6 py-3 text-center">สำเร็จแล้ว</th>
               <th className="px-6 py-3">หมวดหมู่</th>
               <th className="px-6 py-3">รูปแบบกิจกรรม</th>
               <th className="px-6 py-3 text-center">จัดการ</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
             {currentItems.length === 0 ? (
               <tr>
                 <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                   {searchTerm ? 'ไม่พบกิจกรรมที่ค้นหา' : 'ไม่พบข้อมูลกิจกรรม'}
                 </td>
               </tr>
             ) : (
               currentItems.map((activity) => (
                 <tr key={activity.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 font-medium">
                     <div className="max-w-xs" title={activity.name}>
                       {truncateText(activity.name)}
                     </div>
                   </td>
                   <td className="px-6 py-4 text-center">
                     <div className="flex items-center justify-center gap-1">
                       <Clock className="w-4 h-4 text-gray-500" />
                       <span>{activity.hours}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-center">
                     <div className="flex items-center justify-center gap-1">
                       <Users className="w-4 h-4 text-blue-500" />
                       <span>{activity.interested_count || 0}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-center">
                     <div className="flex items-center justify-center gap-1">
                       <CheckCircle className="w-4 h-4 text-green-500" />
                       <span>{activity.completed_count || 0}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                       {truncateText(activity.ActivityCategory?.name || 'ไม่ระบุ', 20)}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.format === 'ออนไลน์'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {activity.format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => openEditModal(activity)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadExcel(activity)}
                          className="text-green-600 hover:text-green-800 transition-colors duration-200"
                          title="ดาวน์โหลด Excel"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(activity)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <AddActivityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddActivity}
        isLoading={status === 'loading'}
      />

      <EditActivityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedActivity(null);
        }}
        onConfirm={handleEditActivity}
        activity={selectedActivity}
        isLoading={status === 'loading'}
      />

      <DeleteActivityModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedActivity(null);
        }}
        onConfirm={handleDeleteActivity}
        activityName={selectedActivity?.name}
        isLoading={status === 'loading'}
      />
    </>
  );
};

export default AddActivityForm;
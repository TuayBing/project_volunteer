import React, { useState, useEffect } from 'react';
import ActivityCard from './ActivityCard';
import ActivityHeader from './ActivityHeader';
import CalendarModal from '../../layout/ActivityModal/CalendarModal';
import api from '../../utils/axios';
import { useAuth } from '../../component/AuthContext';

const ActivityList = () => {
 const { token } = useAuth();
 const [activities, setActivities] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [currentPage, setCurrentPage] = useState(1);
 const [searchTerm, setSearchTerm] = useState('');
 const [showCalendar, setShowCalendar] = useState(false);
 const itemsPerPage = 12;

 useEffect(() => {
   fetchActivities();
 }, []);

 const fetchActivities = async () => {
   try {
     setLoading(true);
     const response = await api.get('/activities', {
       headers: token ? { Authorization: `Bearer ${token}` } : {}
     });
     const activitiesData = Array.isArray(response.data) ? response.data : response.data.data;
     
     if (!Array.isArray(activitiesData)) {
       throw new Error('ข้อมูลที่ได้รับไม่อยู่ในรูปแบบที่ถูกต้อง');
     }
     
     setActivities(activitiesData);
     setError(null);
   } catch (err) {
     console.error('Error fetching activities:', err);
     setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
     setActivities([]);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   setCurrentPage(1);
 }, [searchTerm]);

 const filteredActivities = activities.filter(activity =>
   activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   activity.description.toLowerCase().includes(searchTerm.toLowerCase())
 );

 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentActivities = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);
 const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

 if (loading) {
   return (
     <div className="flex justify-center items-center min-h-[400px]">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3BB77E]"></div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="text-center py-10">
       <div className="text-red-600 mb-2">
         <h3 className="text-lg font-semibold">เกิดข้อผิดพลาด</h3>
         <p className="text-gray-600">{error}</p>
       </div>
       <button 
         onClick={fetchActivities}
         className="mt-4 px-4 py-2 bg-[#3BB77E] text-white rounded-lg hover:bg-[#3BB77E]/90"
       >
         ลองใหม่อีกครั้ง
       </button>
     </div>
   );
 }

 return (
   <div className="px-6 py-10 bg-gray-50 min-h-screen">
     {/* Header */}
     <ActivityHeader
       searchTerm={searchTerm}
       onSearch={setSearchTerm}
       setShowCalendar={setShowCalendar}
       isAuthenticated={!!token}
     />

     {/* Activity Cards */}
     {currentActivities.length === 0 ? (
       <div className="text-center py-10">
         <p className="text-gray-500">
           {searchTerm ? 'ไม่พบกิจกรรมที่ค้นหา' : 'ไม่มีกิจกรรมในขณะนี้'}
         </p>
       </div>
     ) : (
       <div className="max-w-[1400px] mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
           {currentActivities.map((activity) => (
             <div key={activity.id} className="flex justify-center">
               <div className="w-full max-w-md transform transition-all duration-300 hover:-translate-y-1">
                 <ActivityCard 
                   activity={activity}
                   isAuthenticated={!!token}
                 />
               </div>
             </div>
           ))}
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
           <div className="mt-16">
             <div className="flex justify-center items-center gap-4">
               <button
                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                 disabled={currentPage === 1}
                 className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                   currentPage === 1
                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                     : 'bg-white text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 ก่อนหน้า
               </button>
               <div className="text-sm text-gray-600">
                 หน้า {currentPage} จาก {totalPages}
               </div>
               <button
                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                 disabled={currentPage === totalPages}
                 className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                   currentPage === totalPages
                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                     : 'bg-white text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 ถัดไป
               </button>
             </div>
           </div>
         )}
       </div>
     )}

     {/* Calendar Modal */}
     {token && (
       <CalendarModal
         isOpen={showCalendar}
         onClose={() => setShowCalendar(false)}
         activities={activities}
       />
     )}
   </div>
 );
};

export default ActivityList;
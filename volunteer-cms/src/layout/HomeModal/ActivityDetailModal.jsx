import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Clock, MapPin, Book, CalendarDays, CheckCircle } from 'lucide-react';
import { clearCart } from '../../store/cartSlice';
import api from '../../utils/axios';

const ActivityDetailModal = ({ isOpen, onClose, activityNum }) => {
 const [error, setError] = useState(null);
 const [user, setUser] = useState(null);
 const [activities, setActivities] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saved, setSaved] = useState(false);
 const dispatch = useDispatch();

 useEffect(() => {
   const userFromStorage = JSON.parse(localStorage.getItem('user'));
   setUser(userFromStorage);
 }, []);

 useEffect(() => {
   const fetchActivityData = async () => {
     if (isOpen && activityNum) {
       try {
         setLoading(true);
         setError(null);

         // เช็คว่า activityNum อยู่ในช่วง 1-4
         if (activityNum < 1 || activityNum > 4) {
           setError('ไม่พบแผนกิจกรรมที่เลือก');
           setLoading(false);
           return;
         }

         const planId = `PLAN${String(activityNum).padStart(3, '0')}`;
         const response = await api.get(`/plan-activities/plan/${planId}`);

         if (response.data.success) {
           if (response.data.data.length === 0) {
             setError('ขออภัย ยังไม่มีกิจกรรมในแผนนี้');
           } else {
             setActivities(response.data.data);
           }
         }
       } catch (error) {
         if (error.response?.status === 404) {
           setError('ขออภัย ยังไม่มีกิจกรรมในแผนนี้');
         } else {
           setError('เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
         }
         console.error('Debug Info:', error);
       } finally {
         setLoading(false);
       }
     }
   };

   fetchActivityData();
 }, [isOpen, activityNum]);

 const handleSave = async () => {
   try {
     if (!user) {
       setError('กรุณาเข้าสู่ระบบก่อนบันทึกกิจกรรม');
       return;
     }

     setSaved(true);
     setError(null);

     const activitiesToSave = activities.map(activity => ({
        user_id: Number(user.id),
        activity_id: activity.activity_id, 
        name: activity.name,
        description: activity.description || '',
        hours: Number(activity.hours),
        image_url: activity.image_url || '',
        category: activity.category || '',
        status: 'กำลังดำเนินการ'
      }));

     const response = await api.post('/profile/activities/register', {
       activities: activitiesToSave,
       userid: Number(user.id)
     });

     if (response.data.success) {
       dispatch(clearCart());
       setTimeout(() => {
         onClose();
         setSaved(false);
       }, 1500);
     }
   } catch (error) {
     console.error('Error saving activities:', {
       message: error.message,
       response: error.response?.data,
       status: error.response?.status
     });
     setError(error.response?.data?.message || 'ไม่สามารถบันทึกกิจกรรมได้');
     setSaved(false);
   }
 };

 if (!isOpen || loading || !user) return null;

 const totalHours = activities.reduce((sum, activity) => sum + activity.hours, 0);

 return (
   <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30">
     <div className="flex items-center justify-center min-h-screen p-4">
       <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
         <div className="absolute left-0 top-0 bottom-0 w-8 bg-green-600 rounded-l-lg flex items-center justify-center">
           <div className="transform -rotate-90 whitespace-nowrap text-white font-medium">
             สมุดบันทึกกิจกรรมจิตอาสา
           </div>
         </div>

         <div className="ml-8 bg-[#FFFDF7] p-8 max-h-[80vh] overflow-y-auto">
           <div className="border-b border-gray-200 pb-6 mb-6">
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                   <Book className="h-6 w-6 text-green-600" />
                   รายการกิจกรรมในแผน
                 </h2>
                 {!error && (
                   <p className="mt-2 text-gray-600">
                     รวมทั้งหมด {totalHours} ชั่วโมง (เลือกทำให้ครบ 36 ชั่วโมง)
                   </p>
                 )}
               </div>
               <button
                 onClick={onClose}
                 className="text-gray-400 hover:text-gray-600 p-2"
               >
                 <X className="h-5 w-5" />
               </button>
             </div>
           </div>

           {error ? (
             <div className="flex flex-col items-center justify-center py-12">
               <div className="text-gray-500 text-lg text-center">
                 <p>{error}</p>
                 <p className="mt-2 text-sm text-gray-400">
                   กรุณารอการอัพเดทกิจกรรมในเร็วๆ นี้
                 </p>
               </div>
             </div>
           ) : (
             <>
               <div className="space-y-6">
                 {activities.map((activity) => (
                   <div
                     key={activity.activity_id || activity.id}
                     className="relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500"
                   >
                     <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center space-x-3">
                         <img
                           src={activity.image_url || '/api/placeholder/400/320'}
                           alt={activity.name}
                           className="h-12 w-12 object-cover rounded-lg"
                         />
                         <h3 className="text-lg font-semibold text-gray-800">
                           {activity.name}
                         </h3>
                       </div>
                       <span className={`text-sm px-3 py-1 rounded-full ${
                         activity.format === 'ออนไลน์'
                           ? 'bg-blue-50 text-blue-600'
                           : 'bg-green-50 text-green-600'
                       }`}>
                         {activity.format}
                       </span>
                     </div>

                     <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                       <div className="flex items-center gap-1">
                         <Clock className="w-4 h-4" />
                         <span>{activity.hours} ชั่วโมง</span>
                       </div>
                       {activity.category && (
                         <div className="flex items-center gap-1">
                           <MapPin className="w-4 h-4" />
                           <span>{activity.category}</span>
                         </div>
                       )}
                       {activity.month && (
                         <div className="flex items-center gap-1">
                           <CalendarDays className="w-4 h-4" />
                           <span>{activity.month}</span>
                         </div>
                       )}
                     </div>

                     {activity.description && (
                       <p className="text-gray-600 mb-3">
                         {activity.description}
                       </p>
                     )}
                   </div>
                 ))}
               </div>

               <div className="mt-6 pt-4 border-t border-gray-200">
                 <div className="flex justify-between items-center">
                   <div>
                     <p className="text-sm font-medium text-gray-700">
                       กิจกรรมทั้งหมด {activities.length} กิจกรรม
                     </p>
                     <p className="text-sm text-gray-500">
                       เลือกทำกิจกรรมที่สนใจให้ครบ 36 ชั่วโมง จากกิจกรรมที่แนะนำข้างต้น
                     </p>
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={onClose}
                       className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                     >
                       ยกเลิก
                     </button>
                     <button
                       onClick={handleSave}
                       className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                       disabled={saved}
                     >
                       {saved ? (
                         <>
                           <span>บันทึกแล้ว</span>
                           <CheckCircle className="w-4 h-4" />
                         </>
                       ) : (
                         'บันทึกกิจกรรม'
                       )}
                     </button>
                   </div>
                 </div>
               </div>
             </>
           )}
         </div>
       </div>
     </div>
   </div>
 );
};

export default ActivityDetailModal;
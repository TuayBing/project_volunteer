import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Clock, MapPin, Book, CalendarDays, CheckCircle } from 'lucide-react';
import { clearCart } from '../../store/cartSlice';
import api from '../../utils/axios';
import { useAuth } from '../../component/AuthContext';

const ActivityDetailModal = ({ isOpen, onClose, activityNum, canSave }) => {
 const { token } = useAuth();
 const [error, setError] = useState(null);
 const [activities, setActivities] = useState([]);
 const [loading, setLoading] = useState(true);
 const [saved, setSaved] = useState(false);
 const dispatch = useDispatch();

 useEffect(() => {
   const fetchActivityData = async () => {
     if (isOpen && activityNum) {
       try {
         setLoading(true);
         setError(null);

         if (activityNum < 1 || activityNum > 4) {
           setError('ไม่พบแผนกิจกรรมที่เลือก');
           return;
         }

         const planId = `PLAN${String(activityNum).padStart(3, '0')}`;
         const response = await api.get(`/plan-activities/plan/${planId}`);

         if (response.data.success) {
           setActivities(response.data.data.length === 0 ? [] : response.data.data);
           if(response.data.data.length === 0) {
             setError('ขออภัย ยังไม่มีกิจกรรมในแผนนี้');
           }
         }
       } catch (error) {
         setError(error.response?.status === 404 
           ? 'ขออภัย ยังไม่มีกิจกรรมในแผนนี้'
           : 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
       } finally {
         setLoading(false);
       }
     }
   };

   fetchActivityData();
 }, [isOpen, activityNum]);

 const handleSave = async () => {
   try {
     if (!token) {
       setError('กรุณาเข้าสู่ระบบก่อนบันทึกกิจกรรม');
       return;
     }

     setSaved(true);
     setError(null);

     const user = JSON.parse(localStorage.getItem('user'));
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
     setError(error.response?.data?.message || 'ไม่สามารถบันทึกกิจกรรมได้');
     setSaved(false);
   }
 };

 if (!isOpen || loading) return null;

 const totalHours = activities.reduce((sum, activity) => sum + activity.hours, 0);

 return (
   <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30">
     <div className="flex items-center justify-center min-h-screen p-4">
       <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
         {/* Modal Content */}
         <div className="ml-8 bg-[#FFFDF7] p-8 max-h-[80vh] overflow-y-auto">
           {/* Header */}
           <div className="border-b border-gray-200 pb-6 mb-6">
             <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                   <Book className="h-6 w-6 text-green-600" />
                   รายการกิจกรรมในแผน
                 </h2>
                 {!error && (
                   <p className="mt-2 text-gray-600">
                     รวมทั้งหมด {totalHours} ชั่วโมง
                   </p>
                 )}
               </div>
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
                 <X className="h-5 w-5" />
               </button>
             </div>
           </div>

           {/* Content */}
           {error ? (
             <div className="text-center text-gray-500 py-12">{error}</div>
           ) : (
             <>
               {/* Activities List */}
               <div className="space-y-6">
                 {activities.map((activity) => (
                   <div key={activity.activity_id || activity.id} className="bg-white rounded-lg p-6 shadow-sm">
                     <div className="flex justify-between mb-3">
                       <h3 className="font-semibold">{activity.name}</h3>
                       <span className="text-sm">{activity.format}</span>
                     </div>
                     <div className="flex gap-4 text-sm text-gray-600">
                       <span>{activity.hours} ชั่วโมง</span>
                       {activity.category && <span>{activity.category}</span>}
                     </div>
                     {activity.description && <p className="mt-2">{activity.description}</p>}
                   </div>
                 ))}
               </div>

               {/* Footer */}
               <div className="mt-6 pt-4 border-t flex justify-between items-center">
                 <div>
                   <p className="text-sm">กิจกรรมทั้งหมด {activities.length} กิจกรรม</p>
                 </div>
                 <div className="flex gap-3">
                   <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                     ปิด
                   </button>
                   {canSave && token && (
                     <button
                       onClick={handleSave}
                       disabled={saved}
                       className="px-4 py-2 bg-green-600 text-white rounded-lg"
                     >
                       {saved ? (
                         <>
                           <span>บันทึกแล้ว</span>
                           <CheckCircle className="w-4 h-4 ml-2" />
                         </>
                       ) : (
                         'บันทึกกิจกรรม'
                       )}
                     </button>
                   )}
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
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/axios';

function EditPlanModal({ isOpen, onClose, onConfirm, isLoading, planData }) {
 const [formData, setFormData] = useState({
   plan_id: '',
   activity_id: ''
 });

 const [activities, setActivities] = useState([]);
 const [error, setError] = useState('');
 const [planOptions] = useState(['PLAN001', 'PLAN002', 'PLAN003', 'PLAN004']);

 useEffect(() => {
   if (planData) {
     setFormData({
       plan_id: planData.plan_id || '',
       activity_id: planData.activity_id || ''
     });
   }
 }, [planData]);

 useEffect(() => {
   const fetchActivities = async () => {
     try {
       const response = await api.get('/activities');
       setActivities(response.data.data || []);
     } catch (err) {
       setError('ไม่สามารถดึงข้อมูลกิจกรรมได้');
     }
   };

   if (isOpen) {
     fetchActivities();
   }
 }, [isOpen]);

 if (!isOpen) return null;

 const handleSubmit = async (e) => {
   e.preventDefault();
   
   try {
     const submitData = {
       ...formData,
       updated_at: new Date().toISOString(),
       id: planData.id
     };

     onConfirm(submitData);
     
     setFormData({
       plan_id: '',
       activity_id: ''
     });
     setError('');
   } catch (err) {
     setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
   }
 };

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
 };

 return (
   <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
     <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
       <div className="flex justify-between items-start mb-4">
         <div className="flex items-center gap-3">
           <h3 className="text-lg font-semibold text-gray-900">แก้ไขแผนกิจกรรม</h3>
         </div>
         <button
           onClick={onClose}
           disabled={isLoading}
           className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
         >
           <X className="w-5 h-5" />
         </button>
       </div>

       <form onSubmit={handleSubmit}>
         {error && (
           <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
             {error}
           </div>
         )}

         <div className="space-y-4 mb-6">
           <div>
             <label htmlFor="plan_id" className="block text-sm font-medium text-gray-700 mb-2">
               รหัสแผนกิจกรรม
             </label>
             <select
               id="plan_id"
               name="plan_id"
               value={formData.plan_id}
               onChange={handleChange}
               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
               required
               disabled={isLoading}
             >
               <option value="">เลือกรหัสแผนกิจกรรม</option>
               {planOptions.map((plan) => (
                 <option key={plan} value={plan}>
                   {plan}
                 </option>
               ))}
             </select>
           </div>

           <div>
             <label htmlFor="activity_id" className="block text-sm font-medium text-gray-700 mb-2">
               ชื่อกิจกรรม
             </label>
             <select
               id="activity_id"
               name="activity_id"
               value={formData.activity_id}
               onChange={handleChange}
               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BB77E] focus:border-transparent"
               required
               disabled={isLoading}
             >
               <option value="">เลือกชื่อกิจกรรม</option>
               {activities.map((activity) => (
                 <option key={activity.id} value={activity.id}>
                   {activity.name}
                 </option>
               ))}
             </select>
           </div>
         </div>

         <div className="flex justify-end gap-3">
           <button
             type="button"
             onClick={onClose}
             disabled={isLoading}
             className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             ยกเลิก
           </button>
           <button
             type="submit"
             disabled={isLoading}
             className="px-4 py-2 text-sm font-medium text-white bg-[#3BB77E] hover:bg-[#2ea86d] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isLoading ? (
               <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 <span>กำลังบันทึก...</span>
               </>
             ) : (
               'บันทึก'
             )}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
}

export default EditPlanModal;
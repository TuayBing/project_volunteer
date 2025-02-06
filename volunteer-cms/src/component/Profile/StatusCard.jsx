import React from 'react';
import { useSelector } from 'react-redux';
import { selectStats, selectLoading } from '../../store/activityDashboardSlice';

const StatusCard = () => {
 const stats = useSelector(selectStats);
 const loading = useSelector(selectLoading);

 if (loading) {
   return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto p-6">
       <div className="flex justify-center items-center h-40">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
       </div>
     </div>
   );
 }

 return (
   <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto p-6">
     <h3 className="text-lg font-semibold mb-6">สถานะ</h3>
     <div className="space-y-4">
       <div className="flex justify-between items-center">
         <span className="text-gray-600">จำนวนกิจกรรมทั้งหมด</span>
         <span className="font-medium">{stats.totalActivities} กิจกรรม</span>
       </div>
       <div className="flex justify-between items-center">
         <span className="text-gray-600">จำนวนกิจกรรมสำเร็จ</span>
         <span className="font-medium text-green-600">{stats.completedActivities} กิจกรรม</span>
       </div>
       <div className="flex justify-between items-center">
         <span className="text-gray-600">จำนวนกิจกรรมกำลังดำเนินการ</span>
         <span className="font-medium text-blue-600">{stats.inProgressActivities} กิจกรรม</span>
       </div>
       <div className="flex justify-between items-center">
         <span className="text-gray-600">จำนวนกิจกรรมที่ยกเลิก</span>
         <span className="font-medium text-red-500">{stats.expiredActivities} กิจกรรม</span>
       </div>
       <div className="flex justify-between items-center pt-2 border-t">
         <span className="text-gray-600">จำนวนชั่วโมง</span>
         <span className="font-medium">{stats.totalHours} ชั่วโมง</span>
       </div>
     </div>
   </div>
 );
};

export default StatusCard;
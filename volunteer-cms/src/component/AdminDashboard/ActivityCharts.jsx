import React, { useState, useEffect } from 'react';
import { Clock, Users, Calendar, Award } from 'lucide-react';
import api from '../../utils/axios';

const StatCard = ({ title, value, subValue, icon: Icon, color }) => (
 <div className="bg-white p-6 rounded-lg shadow">
   <div className="flex items-center justify-between">
     <div>
       <p className="text-sm text-gray-500 mb-1">{title}</p>
       <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
       {subValue && (
         <span className={`text-sm text-${color}-500`}>
           {subValue}
         </span>
       )}
     </div>
     <div className={`bg-${color}-100 p-3 rounded-full`}>
       <Icon className={`w-6 h-6 text-${color}-600`} />
     </div>
   </div>
 </div>
);

const ActivityCharts = () => {
 const [stats, setStats] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
   const fetchDashboardStats = async () => {
     try {
       setLoading(true);
       const response = await api.get('/dashboard-stats');
       const { stats } = response.data.data;

       setStats([
         {
           title: "จำนวนชั่วโมงทั้งหมด",
           value: stats[0].value,
           subValue: stats[0].subValue,
           icon: Clock,
           color: "blue"
         },
         {
           title: "ผู้เข้าร่วมทั้งหมด",
           value: stats[1].value,
           subValue: stats[1].subValue,
           icon: Users,
           color: "green"
         },
         {
           title: "กิจกรรมในเดือนนี้",
           value: stats[2].value,
           subValue: stats[2].subValue,
           icon: Calendar,
           color: "purple"
         },
         {
           title: "อัตราการเข้าร่วมสำเร็จ",
           value: stats[3].value,
           subValue: stats[3].subValue,
           icon: Award,
           color: "orange"
         }
       ]);
       setLoading(false);
     } catch (error) {
       console.error('Error fetching dashboard stats:', error);
       setError('ไม่สามารถโหลดข้อมูลสถิติได้');
       setLoading(false);
     }
   };

   fetchDashboardStats();
 }, []);

 if (loading) {
   return (
     <div className="flex justify-center items-center h-48">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="text-center py-8 text-red-500">
       {error}
     </div>
   );
 }

 return (
   <div className="space-y-6">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
       {stats.map((stat, index) => (
         <StatCard key={index} {...stat} />
       ))}
     </div>
   </div>
 );
};

export default ActivityCharts;
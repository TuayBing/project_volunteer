import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../utils/axios';

const StudentLoanStats = () => {
 const [stats, setStats] = useState({
   eligible: 0,
   notEligible: 0,
   total: 0
 });
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
   const fetchStats = async () => {
     try {
       setLoading(true);
       const response = await api.get('/user/loan-stats'); 
       setStats(response.data.data);
       setLoading(false);
     } catch (error) {
       console.error('Error fetching loan stats:', error);
       setError('ไม่สามารถโหลดข้อมูลสถิติได้');
       setLoading(false);
     }
   };

   fetchStats();
 }, []);

 const data = [
   { name: 'มีสิทธิ์กู้', value: stats.eligible },
   { name: 'ไม่มีสิทธิ์กู้', value: stats.notEligible }
 ];

 const COLORS = ['#3BB77E', '#EF4444'];
 const total = stats.total;
 const getPercent = (value) => ((value / total) * 100).toFixed(1);

 const CustomTooltip = ({ active, payload }) => {
   if (active && payload && payload.length) {
     const data = payload[0].payload;
     return (
       <div className="bg-white p-2 border rounded shadow-sm">
         <p className="font-medium">{data.name}</p>
         <p className="text-sm">
           จำนวน: {data.value.toLocaleString()} คน
           <span className="ml-2">
             ({getPercent(data.value)}%)
           </span>
         </p>
       </div>
     );
   }
   return null;
 };

 if (loading) {
   return (
     <div className="flex justify-center items-center h-full">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="text-center text-red-500 p-4">
       {error}
     </div>
   );
 }

 return (
   <div className="bg-white p-6 rounded-lg shadow h-full">
     <div className="mb-4">
       <h3 className="text-lg font-semibold text-gray-900">สถิตินักศึกษาที่มีสิทธิ์กู้</h3>
       <p className="text-sm text-gray-500 mt-1">
         ข้อมูลการกู้ยืมประจำปีการศึกษา {new Date().getFullYear() + 543}
       </p>
       <div className="flex items-center mt-2 space-x-4">
         <div className="flex items-center">
           <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
           <span className="ml-2 text-sm text-gray-500">นักศึกษาทั้งหมด</span>
         </div>
         <div className="text-sm text-green-600">
           {getPercent(stats.eligible)}% มีสิทธิ์กู้
         </div>
       </div>
     </div>
     
     <div className="h-80">
       <ResponsiveContainer width="100%" height="100%">
         <PieChart>
           <Pie
             data={data}
             cx="50%"
             cy="50%"
             labelLine={false}
             outerRadius={100}
             fill="#8884d8"
             dataKey="value"
           >
             {data.map((entry, index) => (
               <Cell 
                 key={`cell-${index}`}
                 fill={COLORS[index % COLORS.length]}
               />
             ))}
           </Pie>
           <Tooltip content={<CustomTooltip />} />
           <Legend
             verticalAlign="bottom"
             height={36}
             formatter={(value, entry) => (
               <span className="text-gray-700">
                 {value} ({getPercent(entry.payload.value)}%)
               </span>
             )}
           />
         </PieChart>
       </ResponsiveContainer>
     </div> 
   </div>
 );
};

export default StudentLoanStats;
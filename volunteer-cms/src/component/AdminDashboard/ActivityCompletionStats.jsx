import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 
import api from '../../utils/axios';

const ActivityCompletionStats = () => {
 const [data, setData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
   const fetchData = async () => {
     try {
       setLoading(true);
       const response = await api.get('/activities/top-activities');
       setData(response.data.data);
       setLoading(false);
     } catch (error) {
       console.error('Error fetching top activities:', error);
       setError('ไม่สามารถโหลดข้อมูลได้');
       setLoading(false);
     }
   };

   fetchData();
 }, []);

 const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
     const interested = payload[0].value;
     const completed = payload[1].value;
     const completionRate = ((completed / interested) * 100).toFixed(1);
     return (
       <div className="bg-white p-3 border rounded-lg shadow-sm">
         <p className="font-medium text-gray-900 mb-1">{label}</p>
         <p className="text-sm text-blue-600">
           สนใจเข้าร่วม: {interested} คน
         </p>
         <p className="text-sm text-green-600">
           เข้าร่วมสำเร็จ: {completed} คน
         </p>
         <p className="text-sm text-gray-500 mt-1">
           อัตราความสำเร็จ: {completionRate}%
         </p>
       </div>
     );
   }
   return null;
 };

 if (loading) {
   return (
     <div className="flex justify-center items-center h-full">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
       <h3 className="text-lg font-semibold text-gray-900">
         5 อันดับกิจกรรมที่มีผู้สนใจมากที่สุด
       </h3>
       <p className="text-sm text-gray-500 mt-1">
         เปรียบเทียบจำนวนผู้สนใจและผู้เข้าร่วมกิจกรรมสำเร็จ
       </p>
     </div>
     <div className="h-80">
       <ResponsiveContainer width="100%" height="100%">
         <BarChart
           data={data}
           margin={{
             top: 10,
             right: 30,
             left: 20,
             bottom: 40
           }}
         >
           <CartesianGrid strokeDasharray="3 3" vertical={false} />
           <XAxis
             dataKey="name"
             angle={-45}
             textAnchor="end"
             interval={0}
             height={60}
             tick={{ fontSize: 12 }}
           />
           <YAxis
             tick={{ fontSize: 12 }}
           />
           <Tooltip content={<CustomTooltip />} />
           <Legend
             wrapperStyle={{ paddingTop: "20px" }}
             formatter={(value) => {
               return value === 'interested' ? 'ผู้สนใจเข้าร่วม' : 'ผู้เข้าร่วมสำเร็จ';
             }}
           />
           <Bar
             dataKey="interested"
             fill="#60A5FA"
             radius={[4, 4, 0, 0]}
             name="interested"
           />
           <Bar
             dataKey="completed"
             fill="#34D399"
             radius={[4, 4, 0, 0]}
             name="completed"
           />
         </BarChart>
       </ResponsiveContainer>
     </div>
   </div>
 );
};

export default ActivityCompletionStats;
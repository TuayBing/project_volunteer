import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/axios';
import ActivityDetailModal from '../../layout/HomeModal/ActivityDetailModal';
import { useAuth } from '../../component/AuthContext';

const PlanActivity = () => {
 const { token } = useAuth();
 const [plans, setPlans] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [selectedPlan, setSelectedPlan] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);

 const fetchPlans = async () => {
   try {
     setLoading(true);
     const response = await api.get('/plan-activities');
     if (response.data.success) {
       setPlans(response.data.data);
     }
   } catch (error) {
     console.error('Error fetching plans:', error);
     setError('ไม่สามารถโหลดข้อมูลแผนกิจกรรมได้');
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchPlans();
 }, []);

 const handlePlanClick = (planId) => {
   setSelectedPlan(planId);
   setIsModalOpen(true);
 };

 if (loading) {
   return (
     <div className="flex justify-center items-center min-h-[400px]">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="text-center text-red-600 p-4">
       {error}
     </div>
   );
 }

 const planData = [
   {
     id: 1,
     title: "กิจกรรมแนะนำ 1",
     subtitle: "สำหรับนักศึกษาปีที่ 1",
     image: "activity1.svg"
   },
   {
     id: 2,
     title: "กิจกรรมแนะนำ 2",
     subtitle: "สำหรับนักศึกษาปีที่ 2",
     image: "activity2.svg"
   },
   {
     id: 3,
     title: "กิจกรรมแนะนำ 3",
     subtitle: "สำหรับนักศึกษาปีที่ 3",
     image: "activity3.svg"
   },
   {
     id: 4,
     title: "กิจกรรมแนะนำ 4",
     subtitle: "สำหรับนักศึกษาปีที่ 4",
     image: "activity4.svg"
   }
 ];

 return (
   <>
     <div>
       <div className="text-center mb-12">
         <motion.h2
           initial={{ opacity: 0, y: -50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, ease: "easeOut" }}
           className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1E1E]"
         >
           แผนสำหรับกิจกรรมจิตอาสา
         </motion.h2>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-4 lg:gap-2">
         {planData.map((plan, index) => (
           <motion.div
             key={plan.id}
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             whileHover={{ scale: 1.05 }}
             transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
             className="bg-white p-4 rounded-lg shadow-md w-full max-w-[300px] h-[300px] flex flex-col items-center justify-center cursor-pointer mx-auto"
             onClick={() => handlePlanClick(plan.id)}
           >
             <div className="bg-[#C1F1C6] rounded-full p-3 mb-4 flex justify-center items-center w-[140px] h-[140px]">
               <img
                 src={plan.image}
                 alt={plan.title}
                 className="w-full h-full object-cover"
               />
             </div>
             <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 text-[#1E1E1E] text-center">
               {plan.title}
             </h3>
             <p className="text-[#4A4A4A] text-sm md:text-base text-center">
               {plan.subtitle}
             </p>
           </motion.div>
         ))}
       </div>
     </div>

     <ActivityDetailModal
       isOpen={isModalOpen}
       onClose={() => {
         setIsModalOpen(false);
         setSelectedPlan(null);
       }}
       activityNum={selectedPlan}
       canSave={!!token}
     />
   </>
 );
};

export default PlanActivity;
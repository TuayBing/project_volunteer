import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Main = () => {
 const navigate = useNavigate();

 const fadeIn = {
   initial: { opacity: 0, y: 20 },
   animate: { opacity: 1, y: 0 },
   transition: { duration: 1.2 },
 };

 const handleNavigateToProfile = () => {
   navigate('/profile');
 };

 return (
   <div className="flex flex-col md:flex-row items-center justify-between max-w-screen-2xl mx-auto p-8 gap-x-12">
     {/* Text Section */}
     <div className="w-full md:w-1/2 p-6">
       <motion.div
         className="p-8 rounded-lg"
         initial="initial"
         animate="animate"
         variants={fadeIn}
       >
         <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold leading-relaxed text-center md:text-left">
           ร่วมสร้างโอกาสผ่าน<br />
           กิจกรรมจิตอาสา <span className="text-[#3BB77E]">กยศ</span>
         </h1>
         <p className="text-[#4A4A4A] mt-6 mb-4 text-sm md:text-base lg:text-lg leading-relaxed text-center md:text-left">
           เราคือพื้นที่ที่รวบรวมกิจกรรมจิตอาสาสำหรับนักศึกษา
           ให้คุณได้สร้างประสบการณ์ที่มีคุณค่า สะสมชั่วโมงจิตอาสา
           และเตรียมตัวให้พร้อมสำหรับการยื่นกู้เพื่อการศึกษา
         </p>
         {/* Button - แก้ไขขนาดปุ่มสำหรับมือถือ */}
         <div className="flex justify-center w-full md:justify-start">
           <motion.button
             className="bg-[#3BB77E] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-[#33c442] transition-colors text-sm sm:text-base md:text-lg"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={handleNavigateToProfile}
           >
             สมุดบันทึกกิจกรรม
           </motion.button>
         </div>
       </motion.div>
     </div>

     {/* Image Section */}
     <motion.div
       className="w-full md:w-1/2 flex justify-center items-center"
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.6, delay: 0.3 }}
     >
       <img
         src="/main2.svg"
         alt="กิจกรรมจิตอาสา"
         className="w-[90%] md:w-full h-auto object-contain"
       />
     </motion.div>
   </div>
 );
};

export default Main;
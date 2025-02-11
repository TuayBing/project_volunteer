import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import AutoActivityModal from '../../layout/ActivityModal/AutoActivityModal';

const ActivityHeader = ({ onSearch, searchTerm, setShowCalendar }) => {
 const [isModalOpen, setIsModalOpen] = useState(false);

 // ฟังก์ชันสำหรับตรวจสอบ token
 const checkAuth = () => {
   const token = localStorage.getItem('token');
   return !!token; // แปลงเป็น boolean (true ถ้ามี token, false ถ้าไม่มี)
 };

 // ฟังก์ชันสำหรับจัดการการเปิดปฏิทิน
 const handleCalendarClick = () => {
   if (checkAuth()) {
     setShowCalendar(true);
   }
 };

 // ฟังก์ชันสำหรับจัดการการเปิด Auto Activity Modal
 const handleAutoActivityClick = () => {
   if (checkAuth()) {
     setIsModalOpen(true);
   }
 };

 return (
   <>
     <div className="max-w-[1400px] mx-auto px-4 mb-8 sm:mb-10 md:mb-12">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
         {/* Left side - Styled Title */}
         <div className="flex flex-col w-full sm:w-auto">
           <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3BB77E] to-[#2D8E62] bg-clip-text text-transparent text-center sm:text-left">
             กิจกรรมจิตอาสา
           </h1>
           <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
             <div className="h-1 w-12 bg-[#3BB77E] rounded-full"></div>
             <span className="text-xs sm:text-sm text-gray-600">
               ร่วมสร้างสังคมที่ดีไปด้วยกัน
             </span>
           </div>
         </div>

         {/* Right side - Search and Buttons */}
         <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
           {/* Calendar Button */}
           <button
             onClick={handleCalendarClick}
             className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#3BB77E] text-white rounded-full shadow-lg shadow-[#3BB77E]/30 hover:bg-[#2D8E62] hover:shadow-[#3BB77E]/40 transition-all duration-300"
           >
             <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
           </button>

           {/* Auto Activity Button */}
           <button
             onClick={handleAutoActivityClick}
             className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[#3BB77E] text-white rounded-full shadow-lg shadow-[#3BB77E]/30 hover:bg-[#2D8E62] hover:shadow-[#3BB77E]/40 transition-all duration-300"
           >
             <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
           </button>

           {/* Search Input */}
           <div className="relative w-full sm:w-48 md:w-56 lg:w-64">
             <input
               type="text"
               value={searchTerm}
               onChange={(e) => onSearch(e.target.value)}
               placeholder="ค้นหากิจกรรม..."
               className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-[#3BB77E]/30 focus:border-[#3BB77E] shadow-sm hover:shadow transition-all duration-200"
             />
             <svg
               className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
               />
             </svg>
           </div>
         </div>
       </div>
     </div>

     {/* Auto Activity Modal */}
     <AutoActivityModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
     />
   </>
 );
};

export default ActivityHeader;
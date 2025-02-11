import React, { useState, useEffect } from 'react';
import { Info, X, CheckCircle2, Shield, Users, Clock, Lock, Mail, Phone, AlertTriangle } from 'lucide-react';

const PDPAModal = () => {
 const [isOpen, setIsOpen] = useState(false);
 const [isChecked, setIsChecked] = useState(false);

 useEffect(() => {
   const hasAccepted = localStorage.getItem('pdpaAccepted');
   if (!hasAccepted) {
     setIsOpen(true);
   }
 }, []);

 const handleAccept = () => {
   if (!isChecked) return;
   localStorage.setItem('pdpaAccepted', 'true');
   setIsOpen(false);
 };

 const handleReject = () => {
   window.history.back();
 };

 if (!isOpen) return null;

 return (
   <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
     <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
       {/* Header */}
       <div className="bg-[#3BB77E]/10 p-6 border-b flex items-center justify-between">
         <div className="flex items-center gap-3">
           <Shield className="w-8 h-8 text-[#3BB77E]" />
           <h2 className="text-2xl font-bold text-gray-800">นโยบายคุ้มครองข้อมูลส่วนบุคคล</h2>
         </div>
         <button 
           onClick={handleReject} 
           className="text-gray-500 hover:text-gray-700 transition-colors"
         >
           <X className="w-6 h-6" />
         </button>
       </div>

       {/* Content */}
       <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
         {/* Sections */}
         <div className="grid gap-6 md:grid-cols-2">
           <section className="bg-gray-50 p-4 rounded-lg">
             <div className="flex items-center gap-2 mb-3">
               <Users className="w-5 h-5 text-[#3BB77E]" />
               <h3 className="text-lg font-semibold">ข้อมูลที่เก็บรวบรวม</h3>
             </div>
             <ul className="space-y-2 ml-7 list-disc text-gray-600">
               <li>ชื่อ-นามสกุล</li>
               <li>เบอร์โทรศัพท์</li>
               <li>รหัสนักศึกษา</li>
               <li>คณะและสาขาที่ศึกษา</li>
               <li>อีเมล</li>
             </ul>
           </section>

           <section className="bg-gray-50 p-4 rounded-lg">
             <div className="flex items-center gap-2 mb-3">
               <Info className="w-5 h-5 text-[#3BB77E]" />
               <h3 className="text-lg font-semibold">วัตถุประสงค์</h3>
             </div>
             <ul className="space-y-2 ml-7 list-disc text-gray-600">
               <li>ยืนยันตัวตนนักศึกษา กยศ.</li>
               <li>บริหารจัดการกิจกรรมจิตอาสา</li>
               <li>ติดต่อประสานงาน</li>
               <li>จัดทำสถิติและรายงาน</li>
             </ul>
           </section>
         </div>

         <section className="bg-gray-50 p-4 rounded-lg">
           <div className="flex items-center gap-2 mb-3">
             <Lock className="w-5 h-5 text-[#3BB77E]" />
             <h3 className="text-lg font-semibold">การรักษาความปลอดภัย</h3>
           </div>
           <p className="text-gray-600">เราให้ความสำคัญกับการรักษาความปลอดภัยของข้อมูลส่วนบุคคลของท่าน โดยมีมาตรการรักษาความปลอดภัยที่เหมาะสม และจำกัดการเข้าถึงข้อมูลส่วนบุคคลเฉพาะผู้ที่ได้รับอนุญาตเท่านั้น</p>
         </section>

         <section className="bg-gray-50 p-4 rounded-lg">
           <div className="flex items-center gap-2 mb-3">
             <Clock className="w-5 h-5 text-[#3BB77E]" />
             <h3 className="text-lg font-semibold">ระยะเวลาการเก็บข้อมูล</h3>
           </div>
           <p className="text-gray-600">เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านตามระยะเวลาที่จำเป็นตามวัตถุประสงค์ที่เราได้รับข้อมูลนั้นมา หรือตามที่กฎหมายกำหนด</p>
         </section>

         <section className="bg-gray-50 p-4 rounded-lg">
           <div className="flex items-center gap-2 mb-3">
             <Mail className="w-5 h-5 text-[#3BB77E]" />
             <h3 className="text-lg font-semibold">ติดต่อเรา</h3>
           </div>
           <div className="space-y-2 text-gray-600">
             <div className="flex items-center gap-2">
               <Mail className="w-4 h-4" />
               <p>privacy@example.com</p>
             </div>
             <div className="flex items-center gap-2">
               <Phone className="w-4 h-4" />
               <p>02-XXX-XXXX</p>
             </div>
           </div>
         </section>
       </div>

       {/* Footer */}
       <div className="border-t p-6 bg-gray-50">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
           <label className="flex items-center gap-2 cursor-pointer">
             <input 
               type="checkbox"
               checked={isChecked}
               onChange={(e) => setIsChecked(e.target.checked)}
               className="w-4 h-4 text-[#3BB77E] border-gray-300 rounded focus:ring-[#3BB77E]"
             />
             <span className="text-sm text-gray-600">
               ข้าพเจ้าได้อ่านและยอมรับนโยบายความเป็นส่วนตัว
             </span>
           </label>
           
           <div className="flex items-center gap-3">
             <button
               onClick={handleReject}
               className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
             >
               <X className="w-5 h-5" />
               <span>ปฏิเสธ</span>
             </button>
             <button
               onClick={handleAccept}
               disabled={!isChecked}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                 ${isChecked 
                   ? 'bg-[#3BB77E] text-white hover:bg-[#2ea36b]' 
                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                 }`}
             >
               <CheckCircle2 className="w-5 h-5" />
               <span>ยอมรับ</span>
             </button>
           </div>
         </div>
         {!isChecked && (
           <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
             <AlertTriangle className="w-4 h-4" />
             <span>กรุณาติ๊กถูกเพื่อยอมรับนโยบาย</span>
           </div>
         )}
       </div>
     </div>
   </div>
 );
};

export default PDPAModal;
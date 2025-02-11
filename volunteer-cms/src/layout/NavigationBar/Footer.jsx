import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
 return (
   <footer className="bg-white py-8 border-t mt-auto">
     <div className="container mx-auto px-4">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {/* Logo and Description */}
         <div className="col-span-1">
           <img src="/logo.svg" alt="Logo" className="h-[120px]" />
           <p className="text-gray-600 text-sm">
             แพลตฟอร์มรวบรวมกิจกรรมจิตอาสาสำหรับนักศึกษาผู้กู้ กยศ. เพื่อสร้างโอกาสทางการเเละประสบการณ์ที่มีคุณค่า
           </p>
         </div>

         {/* Links Column 1 */}
         <div className="col-span-1">
           <h3 className="font-semibold text-gray-900 mb-4">ลิงก์ที่มีประโยชน์</h3>
           <ul className="space-y-2">
             <li><Link to="/profile" className="text-gray-600 hover:text-gray-900">โปรไฟล์</Link></li>
             <li><Link to="/activity" className="text-gray-600 hover:text-gray-900">กิจกรรม</Link></li>
           </ul>
         </div>

         {/* Links Column 2 */}
         <div className="col-span-1">
           <h3 className="font-semibold text-gray-900 mb-4">เมนูหลัก</h3>
           <ul className="space-y-2">
             <li><Link to="/" className="text-gray-600 hover:text-gray-900">หน้าหลัก</Link></li>
             <li><Link to="/activity" className="text-gray-600 hover:text-gray-900">กิจกรรม</Link></li>
             <li><Link to="/profile" className="text-gray-600 hover:text-gray-900">โปรไฟล์</Link></li>
             <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">ติดต่อเรา</Link></li>
           </ul>
         </div>

         {/* Contact Info */}
         <div className="col-span-1">
           <h3 className="font-semibold text-gray-900 mb-4">ติดต่อเรา</h3>
           <ul className="space-y-2">
             <li className="text-gray-600">example@email.com</li>
             <li className="text-gray-600">+64 958 248 966</li>
           </ul>
         </div>
       </div>

       {/* Copyright */}
       <div className="text-center mt-8 pt-8 border-t border-gray-200">
         <p className="text-gray-600 text-sm">
           Copyright © 2024 Volunteer | All rights reserved
         </p>
       </div>
     </div>
   </footer>
 );
}

export default Footer;
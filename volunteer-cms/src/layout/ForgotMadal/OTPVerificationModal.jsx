import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const OTPVerificationModal = ({ isOpen, onClose, onSubmit, email }) => {
 const [otp, setOtp] = useState('');
 const [newPassword, setNewPassword] = useState('');
 const [timeLeft, setTimeLeft] = useState(300);
 const [attempts, setAttempts] = useState(0);
 const [error, setError] = useState('');

 useEffect(() => {
   if (!isOpen) {
     setAttempts(0);
     setError('');
     setOtp('');
     setNewPassword('');
   }
 }, [isOpen]);

 useEffect(() => {
   if (!isOpen) return;
   const timer = setInterval(() => {
     setTimeLeft(prev => {
       if (prev <= 0) {
         clearInterval(timer);
         return 0;
       }
       return prev - 1;
     });
   }, 1000);
   return () => clearInterval(timer);
 }, [isOpen]);

 const formatTime = (seconds) => {
   const mins = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${mins}:${secs.toString().padStart(2, '0')}`;
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  try {
    await onSubmit({ otp, newPassword });
    // ไม่ต้อง onClose ที่นี่ เพราะจะจัดการใน BoxForgotForm
  } catch (err) {
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts >= 3) {
        setError('ใส่รหัส OTP ผิดเกิน 3 ครั้ง กรุณาขอรหัสใหม่');
        setTimeout(() => {
          onClose();
          setAttempts(0);
          setOtp('');
          setNewPassword('');
        }, 1500);
        return newAttempts;
      }
      setError(`รหัส OTP ไม่ถูกต้อง (เหลือโอกาสอีก ${3 - newAttempts} ครั้ง)`);
      return newAttempts;
    });
  }
};

 if (!isOpen) return null;

 return (
   <div className="fixed inset-0 z-50 flex items-center justify-center">
     <div className="absolute inset-0 bg-black/50" onClick={onClose} />
     <div className="relative bg-white rounded-lg w-full max-w-md p-6">
       <button
         onClick={onClose}
         className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
       >
         <X size={20} />
       </button>

       <h3 className="text-lg font-semibold mb-4">ยืนยันรหัส OTP</h3>
       <div className="text-sm text-gray-500 mb-4">
         รหัสได้ถูกส่งไปที่ {email}
       </div>

       {error && (
         <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm text-center font-medium">
           {error}
         </div>
       )}

       <div className="mb-4 text-center">
         <div className="text-sm text-gray-600">รหัสจะหมดอายุใน</div>
         <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-emerald-500'}`}>
           {formatTime(timeLeft)}
         </div>
       </div>

       <form onSubmit={handleSubmit} className="space-y-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             รหัส OTP
           </label>
           <input
             type="text"
             maxLength={6}
             value={otp}
             onChange={(e) => setOtp(e.target.value)}
             className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm"
             placeholder="กรอกรหัส OTP 6 หลัก"
             required
             disabled={attempts >= 3}
           />
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             รหัสผ่านใหม่
           </label>
           <input
             type="password"
             value={newPassword}
             onChange={(e) => setNewPassword(e.target.value)}
             className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm"
             placeholder="รหัสผ่านใหม่"
             required
             minLength={6}
             disabled={attempts >= 3}
           />
         </div>

         <button
           type="submit"
           disabled={timeLeft === 0 || attempts >= 3}
           className={`w-full rounded-md py-2 text-sm font-medium text-white transition
             ${timeLeft === 0 || attempts >= 3
               ? 'bg-gray-400 cursor-not-allowed'
               : 'bg-emerald-500 hover:bg-emerald-600'}`}
         >
           {attempts >= 3 ? 'กรุณาขอรหัส OTP ใหม่' : 'ยืนยัน'}
         </button>
       </form>
     </div>
   </div>
 );
};

export default OTPVerificationModal;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import OTPVerificationModal from '../../layout/ForgotMadal/OTPVerificationModal';
import SuccessForgot from '../../layout/ForgotMadal/SuccessForgot';

const BoxForgotForm = () => {
 const [email, setEmail] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [showOTPModal, setShowOTPModal] = useState(false);
 const [showSuccessModal, setShowSuccessModal] = useState(false);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   setError('');
   setSuccess('');
   try {
     const response = await api.post('auth/forgot-password', { email });
     setSuccess(response.data.message);
     setShowOTPModal(true);
   } catch (err) {
     setError(err.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
   } finally {
     setLoading(false);
   }
 };

 const handleVerifyOTP = async ({ otp, newPassword }) => {
   try {
     const response = await api.post('auth/verify-otp', {
       email,
       otp,
       newPassword
     });
     setShowOTPModal(false);
     setShowSuccessModal(true);
     setTimeout(() => {
       setShowSuccessModal(false);
       window.location.href = '/login';
     }, 2000);
   } catch (err) {
     throw err;
   }
 };

 return (
   <div className="flex items-center justify-center h-screen">
     <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 flex flex-col md:flex-row">
       <div className="md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
         <img
           src="/forgot.svg"
           alt="ลืมรหัสผ่าน"
           className="h-full max-h-[300px] md:max-h-[400px] w-auto object-contain"
         />
       </div>
       <div className="md:w-1/2 flex flex-col justify-center">
         <h1 className="text-2xl font-bold text-center mb-6">ลืมรหัสผ่าน</h1>
         {error && (
           <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
             {error}
           </div>
         )}
         {success && (
           <div className="mb-4 p-2 bg-green-100 text-green-600 rounded text-sm">
             {success}
           </div>
         )}
         <form className="space-y-4" onSubmit={handleSubmit}>
           <div>
             <label className="block text-sm font-medium text-gray-700">อีเมล</label>
             <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
               placeholder="ป้อนอีเมลของคุณ"
               required
               disabled={loading}
             />
           </div>
           <button
             type="submit"
             className={`w-full rounded-md py-2 text-sm font-medium text-white transition duration-200
               ${loading
                 ? 'bg-gray-400 cursor-not-allowed'
                 : 'bg-emerald-500 hover:bg-emerald-600'}`}
             disabled={loading}
           >
             {loading ? 'กำลังดำเนินการ...' : 'รีเซ็ตรหัสผ่าน'}
           </button>
           <div className="mt-4 text-center text-sm">
             นึกออกแล้ว?{' '}
             <Link to="/login" className="text-emerald-500 hover:text-emerald-600">
               กลับไปลงชื่อเข้าใช้
             </Link>
           </div>
         </form>
       </div>
     </div>
     <OTPVerificationModal
       isOpen={showOTPModal}
       onClose={() => setShowOTPModal(false)}
       onSubmit={handleVerifyOTP}
       email={email}
     />
     <SuccessForgot
       isOpen={showSuccessModal}
       onClose={() => {
         setShowSuccessModal(false);
         window.location.href = '/login';
       }}
     />
   </div>
 );
};

export default BoxForgotForm;
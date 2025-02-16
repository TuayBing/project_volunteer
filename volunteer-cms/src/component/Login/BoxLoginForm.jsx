import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from '../../utils/axios';
import { useAuth } from '../AuthContext';

const BoxLoginForm = () => {
 const { login } = useAuth();
 const [showPassword, setShowPassword] = useState(false);
 const [formData, setFormData] = useState({
   email: '',
   password: '',
 });
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const navigate = useNavigate();

 const handleChange = (e) => {
   setFormData({
     ...formData,
     [e.target.name]: e.target.value,
   });
   if (error) setError('');
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   setError('');
   setIsLoading(true);

   try {
     const response = await api.post('/auth/login', formData);
     
     if (response.data.success) {
       localStorage.setItem('token', response.data.token);
       localStorage.setItem('user', JSON.stringify(response.data.user));
       
       login(response.data.user, response.data.token);
       
       const userRole = response.data.user.role.toLowerCase();
       if (userRole === 'superadmin' || userRole === 'admin') {
         navigate('/admin/dashboard');
       } else {
         navigate('/');
       }
     }
   } catch (error) {
     setError(error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
   } finally {
     setIsLoading(false);
   }
 };

 return (
   <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
     <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 flex flex-col md:flex-row relative">
       {/* Back Button */}
       <button
         onClick={() => navigate('/')}
         className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 flex items-center gap-1"
       >
         <ArrowLeft className="w-5 h-5" />
         <span>ย้อนกลับ</span>
       </button>

       {/* Left side - Image */}
       <div className="md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
         <img
           src="/login.svg"
           alt="ลงชื่อเข้าใช้"
           className="h-full max-h-[300px] md:max-h-[400px] w-auto object-contain"
         />
       </div>

       {/* Right side - Form */}
       <div className="md:w-1/2 flex flex-col justify-center md:pl-8">
         <h1 className="text-2xl font-bold text-center mb-6">ลงชื่อเข้าใช้</h1>
         
         {error && (
           <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
             <span className="block sm:inline">{error}</span>
           </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700">
               อีเมล
             </label>
             <input
               type="email"
               name="email"
               value={formData.email}
               onChange={handleChange}
               className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
               placeholder="ป้อนอีเมล"
               required
               disabled={isLoading}
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700">
               รหัสผ่าน
             </label>
             <div className="relative">
               <input
                 type={showPassword ? 'text' : 'password'}
                 name="password"
                 value={formData.password}
                 onChange={handleChange}
                 className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                 placeholder="ป้อนรหัสผ่าน"
                 required
                 disabled={isLoading}
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                 disabled={isLoading}
               >
                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
             </div>
             <div className="mt-1 text-right">
               <Link to="/forgot" className="text-sm text-emerald-500 hover:text-emerald-600">
                 ลืมรหัสผ่าน?
               </Link>
             </div>
           </div>

           <button
             type="submit"
             className={`w-full rounded-md bg-emerald-500 py-2 text-sm font-medium text-white transition duration-200
               ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600'}`}
             disabled={isLoading}
           >
             {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
           </button>

           <div className="mt-4 text-center text-sm">
             ยังไม่มีบัญชี?{' '}
             <Link to="/register" className="text-emerald-500 hover:text-emerald-600">
               สมัครสมาชิก
             </Link>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
};

export default BoxLoginForm;
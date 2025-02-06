import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/axios';
import SuccessRegister from '../../layout/RegisterModal/SuccessRegister';

const BoxRegisterForm = () => {
 const navigate = useNavigate();
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);
 const [formData, setFormData] = useState({
   username: '',
   email: '',
   password: '',
   confirmPassword: '',
   firstName: '',
   lastName: '',
   phoneNumber: '',
 });

 const [validations, setValidations] = useState({
   username: { isValid: false, message: '' },
   email: { isValid: false, message: '' },
   password: {
     length: false,
     hasUpperCase: false,
     hasLowerCase: false,
     hasSpecial: false,
   },
   confirmPassword: { isValid: false, message: '' },
   phoneNumber: { isValid: true, message: '' },
 });

 const validatePassword = (password) => {
   return {
     length: password.length >= 8,
     hasUpperCase: /[A-Z]/.test(password),
     hasLowerCase: /[a-z]/.test(password),
     hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
   };
 };

 const validateEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
 };

 const validateUsername = (username) => {
   return username.length >= 3;
 };

 const validatePhoneNumber = (phoneNumber) => {
   const phoneRegex = /^[0-9]{10}$/;
   return phoneRegex.test(phoneNumber);
 };

 const handleChange = async (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({ ...prev, [name]: value }));

   // Check for duplicate username/email
   if ((name === 'username' && value.length >= 3) || 
       (name === 'email' && validateEmail(value))) {
     try {
       const response = await api.post('/auth/check-existing', { [name]: value });
       if (response.data.exists) {
         setValidations(prev => ({
           ...prev,
           [name]: {
             isValid: false,
             message: `${name === 'username' ? 'ชื่อผู้ใช้' : 'อีเมล'}นี้ถูกใช้งานแล้ว`
           }
         }));
         return;
       }
     } catch (error) {
       console.error('Check existing error:', error);
     }
   }

   // Existing validations
   if (name === 'username') {
     setValidations(prev => ({
       ...prev,
       username: {
         isValid: validateUsername(value),
         message: value.length >= 3 ? '' : 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร',
       }
     }));
   }

   if (name === 'email') {
     setValidations(prev => ({
       ...prev,
       email: {
         isValid: validateEmail(value),
         message: validateEmail(value) ? '' : 'รูปแบบอีเมลไม่ถูกต้อง',
       }
     }));
   }

   if (name === 'password') {
     const passwordValidation = validatePassword(value);
     setValidations(prev => ({
       ...prev,
       password: passwordValidation
     }));
   }

   if (name === 'confirmPassword') {
     setValidations(prev => ({
       ...prev,
       confirmPassword: {
         isValid: value === formData.password,
         message: value === formData.password ? '' : 'รหัสผ่านไม่ตรงกัน',
       }
     }));
   }

   if (name === 'phoneNumber') {
     setValidations(prev => ({
       ...prev,
       phoneNumber: {
         isValid: validatePhoneNumber(value),
         message: validatePhoneNumber(value) ? '' : 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก',
       }
     }));
   }
 };

 const ValidationItem = ({ isValid, text }) => (
   <div className="flex items-center gap-2 text-sm">
     {isValid ? (
       <CheckCircle className="w-4 h-4 text-[#3BB77E]" />
     ) : (
       <XCircle className="w-4 h-4 text-red-500" />
     )}
     <span className={isValid ? 'text-[#3BB77E]' : 'text-red-500'}>
       {text}
     </span>
   </div>
 );

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const response = await api.post('/auth/register', {
       username: formData.username,
       email: formData.email,
       password: formData.password,
       phoneNumber: formData.phoneNumber
     });
     if (response.data.success) {
       setShowSuccess(true);
     }
   } catch (error) {
     const errorMessage = error.response?.data?.message;
     if (errorMessage?.includes('ชื่อผู้ใช้')) {
       setValidations(prev => ({
         ...prev,
         username: {
           isValid: false,
           message: errorMessage
         }
       }));
     } else if (errorMessage?.includes('อีเมล')) {
       setValidations(prev => ({
         ...prev,
         email: {
           isValid: false,
           message: errorMessage
         }
       }));
     }
   }
 };

 return (
   <>
     <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
       <div className="bg-white shadow-lg rounded-xl w-full max-w-4xl p-8 flex flex-col md:flex-row">
         <div className="md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
           <img
             src="/register.svg"
             alt="ลงทะเบียน"
             className="h-full max-h-[300px] md:max-h-[400px] w-auto object-contain"
           />
         </div>
         <div className="md:w-1/2 flex flex-col justify-center">
           <h1 className="text-2xl font-bold text-center mb-6">ลงทะเบียน</h1>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                 ชื่อผู้ใช้
               </label>
               <input
                 type="text"
                 name="username"
                 value={formData.username}
                 onChange={handleChange}
                 className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                 placeholder="ชื่อผู้ใช้"
                 required
               />
               {validations.username.message && (
                 <p className="text-sm text-red-500">{validations.username.message}</p>
               )}
             </div>
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                 อีเมล
               </label>
               <input
                 type="email"
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                 placeholder="อีเมล"
                 required
               />
               {validations.email.message && (
                 <p className="text-sm text-red-500">{validations.email.message}</p>
               )}
             </div>
             <div>
               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                 รหัสผ่าน
               </label>
               <div className="relative">
                 <input
                   type={showPassword ? 'text' : 'password'}
                   name="password"
                   value={formData.password}
                   onChange={handleChange}
                   className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                   placeholder="รหัสผ่าน"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                 >
                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                 </button>
               </div>
               <div className="mt-1 space-y-1">
                 <ValidationItem
                   isValid={validations.password.length}
                   text="ต้องมีความยาวอย่างน้อย 8 ตัว"
                 />
                 <ValidationItem
                   isValid={validations.password.hasUpperCase}
                   text="ต้องมีตัวพิมพ์ใหญ่"
                 />
                 <ValidationItem
                   isValid={validations.password.hasLowerCase}
                   text="ต้องมีตัวพิมพ์เล็ก"
                 />
                 <ValidationItem
                   isValid={validations.password.hasSpecial}
                   text="ต้องมีสัญลักษณ์พิเศษ"
                 />
               </div>
             </div>
             <div>
               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                 ยืนยันรหัสผ่าน
               </label>
               <div className="relative">
                 <input
                   type={showConfirmPassword ? 'text' : 'password'}
                   name="confirmPassword"
                   value={formData.confirmPassword}
                   onChange={handleChange}
                   className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                   placeholder="ยืนยันรหัสผ่าน"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                 >
                   {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                 </button>
               </div>
               {validations.confirmPassword.message && (
                 <p className="text-sm text-red-500">{validations.confirmPassword.message}</p>
               )}
             </div>
             <div>
               <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                 เบอร์โทรศัพท์
               </label>
               <input
                 type="text"
                 name="phoneNumber"
                 value={formData.phoneNumber}
                 onChange={handleChange}
                 className="mt-1 block w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3BB77E]"
                 placeholder="เบอร์โทรศัพท์"
                 required
               />
               {validations.phoneNumber.message && (
                 <p className="text-sm text-red-500">{validations.phoneNumber.message}</p>
               )}
             </div>

             <button
               type="submit"
               className="w-full rounded-md bg-[#3BB77E] py-2 text-sm font-medium text-white hover:bg-[#2ea86d] transition duration-200"
               disabled={!Object.values(validations).every(v => v.isValid !== false)}
             >
               ลงทะเบียน
             </button>
           </form>

           <div className="mt-4 text-center text-sm">
             มีบัญชีผู้ใช้อยู่แล้ว?{' '}
             <Link to="/login" className="text-[#3BB77E] hover:text-[#2ea86d]">
               เข้าสู่ระบบ
             </Link>
           </div>
         </div>
       </div>
     </div>
     <SuccessRegister 
       isOpen={showSuccess} 
       onClose={() => {
         setShowSuccess(false);
         navigate('/login');
       }} 
     />
   </>
 );
};

export default BoxRegisterForm;
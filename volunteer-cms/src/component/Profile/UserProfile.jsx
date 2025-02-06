import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
 UserCircle, Mail, Users, Clock, Activity,
 FileText, GraduationCap
} from 'lucide-react';
import ActivityLog from './Activitylog';
import Documents from './Documents';
import EmptyProfileState from './EmptyProfileState';
import api from '../../utils/axios';
import { fetchActivityDashboardStats, selectStats } from '../../store/activityDashboardSlice';

const UserProfile = () => {
 const dispatch = useDispatch();
 const stats = useSelector(selectStats);
 const [activeTab, setActiveTab] = useState('profile');
 const [hasData, setHasData] = useState(false);
 const [userData, setUserData] = useState({
   username: '',
   firstName: '',
   lastName: '',
   gender: '',
   email: '',
   phoneNumber: '',
   faculty_id: '',
   faculty_name: '',  
   major_id: '',
   major_name: '',    
   studentID: '',
   total_hours: 0
 });

 useEffect(() => {
   const checkUserData = async () => {
     try {
       const response = await api.get('/user/profile');
       const data = response.data.data;
       
       const hasUserData = data.username && data.email;
       const hasStudentData = data.firstName && data.lastName && data.studentID;
       
       setUserData({
         ...data,
         faculty_name: data.faculty_name || '',
         major_name: data.major_name || ''
       });
       setHasData(hasUserData && hasStudentData);
     } catch (error) {
       console.error('Error fetching user data:', error);
       setHasData(false);
     }
   };
   checkUserData();
   dispatch(fetchActivityDashboardStats());
 }, [dispatch]);

 const getThaiGender = (gender) => {
   const genderMap = {
     'male': 'ชาย',
     'female': 'หญิง',
     'other': 'อื่นๆ'
   };
   return genderMap[gender] || 'ไม่ระบุ';
 };

 const tabButton = (name, icon, label) => {
   const isActive = activeTab === name;
   return (
     <button
       onClick={() => setActiveTab(name)}
       className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative
       ${isActive
         ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
         : 'text-white/80 hover:text-white hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-white/50'
       }`}
     >
       {icon}
       {label}
     </button>
   );
 };

 const renderProfileContent = () => (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     {/* Personal Information */}
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div className="px-6 py-4 bg-[#3BB77E] text-white">
         <h2 className="text-lg font-semibold flex items-center gap-2">
           <Users className="w-5 h-5" />
           ข้อมูลส่วนตัว
         </h2>
       </div>
       <div className="p-6">
         <div className="space-y-4">
           <div className="flex items-center justify-between py-3 border-b border-gray-100">
             <div className="text-sm font-medium text-gray-500">ชื่อผู้ใช้</div>
             <div className="text-sm text-gray-900">{userData.username}</div>
           </div>
           <div className="flex items-center justify-between py-3 border-b border-gray-100">
             <div className="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</div>
             <div className="text-sm text-gray-900">{userData.firstName} {userData.lastName}</div>
           </div>
           <div className="flex items-center justify-between py-3 border-b border-gray-100">
             <div className="text-sm font-medium text-gray-500">เพศ</div>
             <div className="text-sm text-gray-900">{getThaiGender(userData.gender)}</div>
           </div>
           <div className="flex items-center justify-between py-3 border-b border-gray-100">
             <div className="text-sm font-medium text-gray-500">อีเมล</div>
             <div className="text-sm text-gray-900">{userData.email}</div>
           </div>
           <div className="flex items-center justify-between py-3">
             <div className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</div>
             <div className="text-sm text-gray-900">{userData.phoneNumber}</div>
           </div>
         </div>
       </div>
     </div>

     {/* Academic Information */}
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
       <div className="px-6 py-4 bg-[#3BB77E] text-white">
         <h2 className="text-lg font-semibold flex items-center gap-2">
           <GraduationCap className="w-5 h-5" />
           ข้อมูลการศึกษา
         </h2>
       </div>
       <div className="p-6">
         <div className="space-y-4">
           <div className="flex items-center justify-between py-3 border-b border-gray-100">
             <div className="text-sm font-medium text-gray-500">รหัสนักศึกษา</div>
             <div className="text-sm text-gray-900">{userData.studentID}</div>
           </div>
           <div className="flex items-center justify-between py-3 border-b border-gray-100">
             <div className="text-sm font-medium text-gray-500">คณะ</div>
             <div className="text-sm text-gray-900">{userData.faculty_name}</div>
           </div>
           <div className="flex items-center justify-between py-3 border-b border-gray-100">
             <div className="text-sm font-medium text-gray-500">สาขา</div>
             <div className="text-sm text-gray-900">{userData.major_name}</div>
           </div>
           <div className="flex items-center justify-between py-3">
             <div className="text-sm font-medium text-gray-500">จำนวนชั่วโมงรวม</div>
             <div className="text-sm text-gray-900 flex items-center gap-1">
               <Clock className="w-4 h-4 text-[#3BB77E]" />
               {stats.totalHours} ชั่วโมง
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );

 return (
   <div className="min-h-screen bg-gray-100 py-8">
     <div className="max-w-7xl mx-auto px-4">
       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
         {hasData ? (
           <>
             {/* Profile Header */}
             <div className="bg-[#3BB77E] rounded-t-xl">
               <div className="p-6">
                 <div className="flex flex-col md:flex-row md:items-start gap-6">
                   {/* Avatar and Basic Info */}
                   <div className="flex items-start gap-6">
                     {/* Avatar */}
                     <div className="flex-shrink-0">
                       <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center text-[#3BB77E] text-2xl md:text-3xl font-bold shadow-lg">
                         {userData.username?.[0]?.toUpperCase() || 'U'}
                       </div>
                     </div>
                     {/* Basic Info */}
                     <div className="flex-grow min-w-0">
                       <h1 className="text-xl md:text-2xl font-bold text-white truncate">
                         {userData.firstName} {userData.lastName}
                       </h1>
                       <div className="mt-1 flex flex-wrap items-center gap-4 text-white/90">
                         <div className="flex items-center gap-1.5">
                           <UserCircle className="w-4 h-4" />
                           <span className="text-sm">{userData.username}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                           <Mail className="w-4 h-4" />
                           <span className="text-sm truncate">{userData.email}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   {/* Hours Counter */}
                   <div className="md:ml-auto">
                     <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-lg">
                       <Clock className="w-5 h-5 text-[#3BB77E]" />
                       <div>
                         <div className="text-xl font-bold text-[#3BB77E] ml-4">{stats.totalHours}</div>
                         <div className="text-xs text-[#3BB77E]/90">ชั่วโมงรวม</div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               {/* Navigation Tabs */}
               <div className="px-6 mt-4">
                 <div className="flex flex-wrap gap-2 border-b border-white/20">
                   {tabButton('profile', <Users className="w-5 h-5" />, 'ข้อมูลส่วนตัว')}
                   {tabButton('activity', <Activity className="w-5 h-5" />, 'บันทึกกิจกรรม')}
                   {tabButton('certificate', <FileText className="w-5 h-5" />, 'แฟ้มเก็บเอกสาร')}
                 </div>
               </div>
             </div>
             {/* Tab Content */}
             <div className="p-6 bg-gray-50">
               {activeTab === 'profile' && renderProfileContent()}
               {activeTab === 'activity' && <ActivityLog />}
               {activeTab === 'certificate' && <Documents />}
             </div>
           </>
         ) : (
           <EmptyProfileState />
         )}
       </div>
     </div>
   </div>
 );
};

export default UserProfile;
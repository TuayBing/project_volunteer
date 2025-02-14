import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import api from '../../utils/axios';
import socket from '../../utils/socket';

const NotificationDropdown = React.forwardRef(function NotificationDropdown(props, ref) {
 const [notifications, setNotifications] = useState([]);
 const [isVisible, setIsVisible] = useState(false);
 const [unreadCount, setUnreadCount] = useState(0);
 const [isLoading, setIsLoading] = useState(false);
 const dropdownRef = useRef(null);

 useEffect(() => {
   fetchNotifications();
   setupSocketListeners();

   const handleClickOutside = (event) => {
     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
       setIsVisible(false);
     }
   };

   document.addEventListener("mousedown", handleClickOutside);
   return () => {
     cleanupSocketListeners();
     document.removeEventListener("mousedown", handleClickOutside);
   };
 }, []);

 const resetNotifications = () => {
   setNotifications([]);
   setUnreadCount(0);
   const userId = localStorage.getItem('userId');
   if (userId) {
     socket.emit('leave', `user_${userId}`);
   }
 };

 React.useImperativeHandle(ref, () => ({
   resetNotifications
 }));

 const setupSocketListeners = () => {
   const userId = localStorage.getItem('userId');
   if (userId) {
     socket.emit('join', `user_${userId}`);
   }

   socket.on('newNotification', (newNotifications) => {
     setNotifications(prev => [...newNotifications, ...prev]);
     setUnreadCount(prev => prev + newNotifications.length);
   });

   socket.on('notificationRead', (notificationId) => {
     setNotifications(prev =>
       prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
     );
     setUnreadCount(prev => Math.max(0, prev - 1));
   });

   socket.on('allNotificationsRead', () => {
     setNotifications(prev =>
       prev.map(n => ({ ...n, is_read: true }))
     );
     setUnreadCount(0);
   });

   socket.on('notificationDeleted', (notificationId) => {
     setNotifications(prev =>
       prev.filter(n => n.id !== notificationId)
     );
   });
 };

 const cleanupSocketListeners = () => {
   socket.off('newNotification');
   socket.off('notificationRead');
   socket.off('allNotificationsRead');
   socket.off('notificationDeleted');
 };

 const fetchNotifications = async () => {
  // เช็คก่อนว่ามี token ไหม
  const token = localStorage.getItem('token');
  if (!token) {
    setNotifications([]);
    setUnreadCount(0);
    return; // ไม่ทำ request ถ้าไม่มี token
  }

  try {
    setIsLoading(true);
    const response = await api.get('/notifications');
    if (response.data.success) {
      setNotifications(response.data.data);
      setUnreadCount(response.data.data.filter(n => !n.is_read).length);
    }
  } catch (error) {
    setNotifications([]);
    setUnreadCount(0);
  } finally {
    setIsLoading(false);
  }
};

 const handleRead = async (id) => {
   try {
     const response = await api.put(`/notifications/${id}/read`);
     if (response.data.success) {
       setNotifications(prev =>
         prev.map(n => n.id === id ? { ...n, is_read: true } : n)
       );
       setUnreadCount(prev => Math.max(0, prev - 1));
     }
   } catch (error) {
     console.error('Error marking notification as read:', error);
   }
 };

 const handleReadAll = async () => {
   try {
     const response = await api.put('/notifications/read-all');
     if (response.data.success) {
       setNotifications(prev =>
         prev.map(n => ({ ...n, is_read: true }))
       );
       setUnreadCount(0);
     }
   } catch (error) {
     console.error('Error marking all as read:', error);
   }
 };

 const handleDelete = async (id, e) => {
   e.stopPropagation();
   try {
     const response = await api.delete(`/notifications/${id}`);
     if (response.data.success) {
       setNotifications(prev => prev.filter(n => n.id !== id));
       const deletedNotification = notifications.find(n => n.id === id);
       if (deletedNotification && !deletedNotification.is_read) {
         setUnreadCount(prev => Math.max(0, prev - 1));
       }
     }
   } catch (error) {
     console.error('Error deleting notification:', error);
   }
 };

 const formatNotificationTime = (date) => {
   const now = new Date();
   const notificationDate = new Date(date);
   const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

   if (diffInMinutes < 1) return 'เมื่อสักครู่';
   if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
   
   const diffInHours = Math.floor(diffInMinutes / 60);
   if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
   
   return notificationDate.toLocaleDateString('th-TH');
 };

 return (
   <div className="relative" ref={dropdownRef}>
     <button
       onClick={() => setIsVisible(!isVisible)}
       className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
     >
       <Bell 
         size={24} 
         className={`${unreadCount > 0 ? 'text-[#3BB77E]' : 'text-gray-600'} transition-colors duration-200`} 
       />
       {unreadCount > 0 && (
         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
           {unreadCount}
         </span>
       )}
     </button>

     {isVisible && (
       <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-100">
         <div className="p-4">
           <div className="flex justify-between items-center mb-4 border-b pb-3">
             <h3 className="text-lg font-semibold text-gray-900">การแจ้งเตือน</h3>
             <div className="flex gap-2">
               {unreadCount > 0 && (
                 <button
                   onClick={handleReadAll}
                   className="text-sm text-[#3BB77E] hover:text-[#2ea36b] flex items-center transition-colors duration-200"
                 >
                   <Check size={16} className="mr-1" />
                   อ่านทั้งหมด
                 </button>
               )}
               <button
                 onClick={() => setIsVisible(false)}
                 className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
               >
                 <X size={16} />
               </button>
             </div>
           </div>

           <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
             {isLoading ? (
               <div className="flex justify-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BB77E]"></div>
               </div>
             ) : notifications.length > 0 ? (
               notifications.map((notification) => (
                 <div
                   key={notification.id}
                   className={`p-4 rounded-lg ${
                     notification.is_read ? 'bg-gray-50' : 'bg-blue-50'
                   } cursor-pointer hover:bg-gray-100 transition-all duration-200 relative group`}
                   onClick={() => handleRead(notification.id)}
                 >
                   <div className="flex justify-between items-start">
                     <div className="flex-1">
                       <p className="text-sm font-medium text-gray-900">
                         {notification.title}
                       </p>
                       <p className="text-sm text-gray-600 mt-1">
                         {notification.message}
                       </p>
                       <p className="text-xs text-gray-500 mt-2">
                         {formatNotificationTime(notification.created_at)}
                       </p>
                     </div>
                     <button
                       onClick={(e) => handleDelete(notification.id, e)}
                       className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 rounded-full"
                       title="ลบการแจ้งเตือน"
                     >
                       <Trash2 
                         size={16} 
                         className="text-gray-400 hover:text-red-500 transition-colors duration-200" 
                       />
                     </button>
                   </div>
                 </div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                 <Bell size={32} className="mb-2" />
                 <p>ไม่มีการแจ้งเตือน</p>
               </div>
             )}
           </div>
         </div>
       </div>
     )}
   </div>
 );
});

export default NotificationDropdown;
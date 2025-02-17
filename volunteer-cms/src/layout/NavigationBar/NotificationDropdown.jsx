import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import socket from '../../utils/socket';

const NotificationDropdown = React.forwardRef(function NotificationDropdown(props, ref) {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Socket and notification fetching logic remains the same...
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

  // All other functions remain the same...
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

  // Socket listeners setup and cleanup remain the same...
  const setupSocketListeners = () => {
    // ... existing socket setup code ...
  };

  const cleanupSocketListeners = () => {
    // ... existing cleanup code ...
  };

  // All other handler functions remain the same...
  const fetchNotifications = async () => {
    // ... existing fetch code ...
  };

  const handleRead = async (id) => {
    // ... existing read code ...
  };

  const handleReadAll = async () => {
    // ... existing read all code ...
  };

  const handleDelete = async (id, e) => {
    // ... existing delete code ...
  };

  const formatNotificationTime = (date) => {
    // ... existing time format code ...
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
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

      {/* Notification Content */}
      {isVisible && (
        <>
          {/* Overlay for mobile */}
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" />

          {/* Notification Container */}
          <div className={`
            bg-white rounded-lg shadow-xl z-50 border border-gray-100
            md:absolute md:right-0 md:mt-2 md:w-96
            fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-[95vw] max-w-md
            md:transform-none md:top-auto md:left-auto
          `}>
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

              <div className="space-y-2 max-h-[60vh] md:max-h-[400px] overflow-y-auto custom-scrollbar">
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
                          className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 rounded-full"
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
        </>
      )}
    </div>
  );
});

export default NotificationDropdown;
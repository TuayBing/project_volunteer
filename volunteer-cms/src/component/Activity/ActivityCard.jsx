import React, { useState } from 'react';
import { useSavedActivities } from '../../layout/NavigationBar/SavedActivitiesContext';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import ActivityStatusModal from '../../layout/ActivityModal/ActivityStatusModal';
import api from '../../utils/axios';

const ActivityCard = ({ activity, isAuthenticated }) => {
  const { saveActivity, savedActivities, removeSavedActivity } = useSavedActivities();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalType, setModalType] = useState('alreadyPrepared');

  const isPrepared = savedActivities.some(saved => saved.id === activity.id);

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  }; 

  const handlePrepare = async () => {
    if (!token) return;
  
    try {
      setIsSaving(true);
      setError(null);
  
      // เช็คว่าเตรียมบันทึกไว้แล้วหรือยัง ต้องเช็คก่อน API call
      if (isPrepared) {
        setModalType('alreadyPrepared');
        setShowStatusModal(true);
        return;
      }
  
      // เช็คกับ server ว่า user ทำกิจกรรมนี้ได้อีกไหม
      const response = await api.get(`/activities/check/${activity.id}`);
      const { attempts, max_attempts, canRegister } = response.data.data;
  
      // ถ้าทำครบแล้ว
      if (!canRegister) {
        setModalType('maxAttemptsReached');
        setShowStatusModal(true);
        return;
      }
  
      // ถ้ายังไม่เคยบันทึก และยังทำได้
      saveActivity({
        id: activity.id,
        name: activity.name,
        format: activity.format,
        hours: activity.hours,
        image_url: activity.image_url,
        description: activity.description,
        max_attempts,
        current_attempts: attempts,
        ActivityCategory: activity.ActivityCategory
      });
      
    } catch (err) {
      console.error('Error checking activity attempts:', err);
      setError('เกิดข้อผิดพลาดในการตรวจสอบสถานะกิจกรรม');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsave = async () => {
    if (!token || !isPrepared) return;
    try {
      setIsSaving(true);
      setError(null);
      removeSavedActivity(activity.id);
    } catch (err) {
      console.error('Error removing saved activity:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกการบันทึก');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <>
      <div
        className="group bg-white rounded-lg shadow-[0_2px_15px_rgb(0,0,0,0.08)] overflow-hidden hover:-translate-y-1 transition-all duration-300 w-full sm:w-[340px] md:w-[360px] lg:w-[380px] xl:w-[420px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ส่วนแสดงรูปภาพ */}
        <div className="relative overflow-hidden h-[120px] sm:h-[130px] md:h-[140px]">
          <img
            src={activity.image_url || "/api/placeholder/420/126"}
            alt={activity.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium ${
              activity.format === 'ออนไลน์' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {activity.format}
            </span>
          </div>
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
              {activity.ActivityCategory?.name || 'ไม่ระบุ'}
            </span>
          </div>
        </div>

        {/* ส่วนเนื้อหา */}
        <div className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-1 group-hover:text-[#3BB77E] transition-colors duration-200">
            {activity.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
            {truncateText(activity.description)}
          </p>

          {/* ข้อจำกัดจำนวนครั้ง */}
          <div className="text-xs text-gray-500 mb-2">
            {activity.max_attempts > 1 ? 
              `สามารถทำได้สูงสุด ${activity.max_attempts} ครั้ง` : 
              'สามารถทำได้เพียงครั้งเดียว'
            }
          </div>

          {error && (
            <div className="mb-2 sm:mb-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 text-red-600 text-xs sm:text-sm rounded-md">
              {error}
            </div>
          )}

          {/* ส่วนแสดงสถิติและปุ่มกด */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#3BB77E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{activity.hours}ชม.</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-600">{activity.interested_count || 0}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{activity.completed_count || 0}</span>
              </div>
            </div>

            {token ? (
              isPrepared ? (
                <button
                  onClick={handleUnsave}
                  disabled={isSaving}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-600"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                  {isSaving ? 'กำลังยกเลิก...' : 'ยกเลิกการบันทึก'}
                </button>
              ) : (
                <button
                  onClick={handlePrepare}
                  disabled={isSaving}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200 bg-[#3BB77E] hover:bg-[#3BB77E]/90 text-white"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              )
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* แสดง Modal */}
      <ActivityStatusModal 
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        activity={activity}
        type={modalType}
      />
    </>
  );
};

export default ActivityCard;
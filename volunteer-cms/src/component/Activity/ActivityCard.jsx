import React, { useState } from 'react';
import { useSavedActivities } from '../../layout/NavigationBar/SavedActivitiesContext';
import { useAuth } from '../AuthContext';
import api from '../../utils/axios';

const ActivityCard = ({ activity }) => {
  // Hooks
  const { saveActivity, savedActivities, removeSavedActivity } = useSavedActivities();
  const { token } = useAuth();
  
  // States
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // เช็คว่ากิจกรรมถูกบันทึกแล้วหรือยัง
  const isPrepared = savedActivities.some(saved => saved.id === activity.id);

  // ฟังก์ชันตัดข้อความ
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  };

  const handlePrepare = async () => {
    if (!token) return;
    
    if (!isPrepared) {
      try {
        setIsSaving(true);
        setError(null);
        
        // เรียกใช้ saveActivity จาก context โดยตรง
        saveActivity({
          id: activity.id,
          name: activity.name,
          format: activity.format,
          hours: activity.hours,
          image_url: activity.image_url,
          description: activity.description
        });
        
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการบันทึกกิจกรรม');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // จัดการการยกเลิกการบันทึก
  const handleUnsave = async () => {
    if (!token || !isPrepared) return;

    try {
      setIsSaving(true);
      setError(null);

      await api.delete(`/activities/${activity.id}/save`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      removeSavedActivity(activity.id);

    } catch (err) {
      console.error('Error removing saved activity:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกการบันทึก');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="group bg-white rounded-lg shadow-[0_2px_15px_rgb(0,0,0,0.08)] overflow-hidden hover:-translate-y-1 transition-all duration-300 w-[420px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ส่วนแสดงรูปภาพ */}
      <div style={{ height: '140px' }} className="relative overflow-hidden">
        <img
          src={activity.image_url || "/api/placeholder/420/126"}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-md text-sm font-medium ${
            activity.format === 'ออนไลน์'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-orange-100 text-orange-800'
          }`}>
            {activity.format}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            {activity.ActivityCategory?.name || 'ไม่ระบุ'}
          </span>
        </div>
      </div>

      {/* ส่วนเนื้อหา */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#3BB77E] transition-colors duration-200">
          {activity.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {truncateText(activity.description)}
        </p>

        {/* แสดง error ถ้ามี */}
        {error && (
          <div className="mb-3 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#3BB77E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">{activity.hours}ชม.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-600">{activity.interested_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">{activity.completed_count || 0}</span>
            </div>
          </div>

          {/* ปุ่มบันทึก/ยกเลิกการบันทึก */}
          {isPrepared ? (
            <button
              onClick={handleUnsave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              {isSaving ? 'กำลังยกเลิก...' : 'ยกเลิกการบันทึก'}
            </button>
          ) : (
            <button
              onClick={handlePrepare}
              disabled={isSaving || !token}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                !token
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isSaving 
                  ? 'bg-[#3BB77E]/70 text-white cursor-wait'
                  : 'bg-[#3BB77E] hover:bg-[#3BB77E]/90 text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              {!token ? 'กรุณาเข้าสู่ระบบ' : isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
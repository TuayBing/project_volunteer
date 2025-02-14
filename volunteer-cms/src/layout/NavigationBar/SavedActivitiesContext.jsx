import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchActivityDashboardStats } from '../../store/activityDashboardSlice';
import api from '../../utils/axios';

const SavedActivitiesContext = createContext();

export const SavedActivitiesProvider = ({ children }) => {
  const [savedActivities, setSavedActivities] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dispatch = useDispatch();

  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const loadSavedActivities = () => {
      const saved = localStorage.getItem('savedActivities');
      if (saved) {
        setSavedActivities(JSON.parse(saved));
      }
    };

    loadSavedActivities();

    // เพิ่ม event listener สำหรับการเปลี่ยนแปลง localStorage
    window.addEventListener('storage', loadSavedActivities);
    window.addEventListener('userLogout', () => {
      setSavedActivities([]);
      setIsDropdownVisible(false);
    });

    return () => {
      window.removeEventListener('storage', loadSavedActivities);
      window.removeEventListener('userLogout', () => {});
    };
  }, []);

  // บันทึกลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('savedActivities', JSON.stringify(savedActivities));
  }, [savedActivities]);

  const saveActivity = (activity) => {
    setSavedActivities(prev => {
      if (!prev.some(saved => saved.id === activity.id)) {
        return [...prev, {
          ...activity,
          preparedAt: new Date().toISOString()
        }];
      }
      return prev;
    });
  };

  const removeActivity = (activityId) => {
    setSavedActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  const saveAllActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('กรุณาเข้าสู่ระบบ');

      // 1. บันทึกกิจกรรม
      await api.post('/profile/activities/register', {
        activities: savedActivities.map(activity => ({
          user_id: Number(JSON.parse(localStorage.getItem('user')).id),
          activity_id: activity.id,
          name: activity.name,
          description: activity.description || '',
          hours: Number(activity.hours),
          image_url: activity.image_url || '',
          status: 'กำลังดำเนินการ'
        }))
      });

      // 2. ดึงข้อมูลและ update Redux store
      dispatch(fetchActivityDashboardStats());

      // 3. Clear saved activities
      setSavedActivities([]);
      localStorage.removeItem('savedActivities');

      return true;
    } catch (error) {
      throw error;
    }
  };

  const clearActivities = () => {
    setSavedActivities([]);
    localStorage.removeItem('savedActivities');
    setIsDropdownVisible(false);
  };

  const value = {
    savedActivities,
    saveActivity,
    removeActivity,
    saveAllActivities,
    clearActivities,
    isDropdownVisible,
    setIsDropdownVisible
  };

  return (
    <SavedActivitiesContext.Provider value={value}>
      {children}
    </SavedActivitiesContext.Provider>
  );
};

export const useSavedActivities = () => {
  const context = useContext(SavedActivitiesContext);
  if (!context) {
    throw new Error('useSavedActivities must be used within a SavedActivitiesProvider');
  }
  return context;
};

export default SavedActivitiesContext;
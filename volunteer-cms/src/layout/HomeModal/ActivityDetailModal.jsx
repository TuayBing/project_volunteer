import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Book, CheckCircle } from 'lucide-react';
import { clearCart } from '../../store/cartSlice';
import api from '../../utils/axios';
import { useAuth } from '../../component/AuthContext';

const ActivityDetailModal = ({ isOpen, onClose, activityNum, canSave }) => {
  const { token } = useAuth();
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchActivityData = async () => {
      if (isOpen && activityNum) {
        try {
          setLoading(true);
          setError(null);

          if (activityNum < 1 || activityNum > 4) {
            setError('ไม่พบแผนกิจกรรมที่เลือก');
            return;
          }

          const planId = `PLAN${String(activityNum).padStart(3, '0')}`;
          const response = await api.get(`/plan-activities/plan/${planId}`);

          if (response.data.success) {
            setActivities(response.data.data.length === 0 ? [] : response.data.data);
            if(response.data.data.length === 0) {
              setError('ขออภัย ยังไม่มีกิจกรรมในแผนนี้');
            }
          }
        } catch (error) {
          setError(error.response?.status === 404 
            ? 'ขออภัย ยังไม่มีกิจกรรมในแผนนี้'
            : 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchActivityData();
  }, [isOpen, activityNum]);

  const handleSave = async () => {
    try {
      if (!token) {
        setError('กรุณาเข้าสู่ระบบก่อนบันทึกกิจกรรม');
        return;
      }

      setSaved(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user'));
      const activitiesToSave = activities.map(activity => ({
        user_id: Number(user.id),
        activity_id: activity.activity_id,
        name: activity.name,
        description: activity.description || '',
        hours: Number(activity.hours),
        image_url: activity.image_url || '',
        category: activity.category || '',
        status: 'กำลังดำเนินการ'
      }));

      const response = await api.post('/profile/activities/register', {
        activities: activitiesToSave,
        userid: Number(user.id)
      });

      if (response.data.success) {
        dispatch(clearCart());
        setTimeout(() => {
          onClose();
          setSaved(false);
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'ไม่สามารถบันทึกกิจกรรมได้');
      setSaved(false);
    }
  };

  if (!isOpen || loading) return null;

  const totalHours = activities.reduce((sum, activity) => sum + activity.hours, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#FFFDF7] p-4 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b border-gray-200 pb-3 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Book className="h-5 w-5 text-green-600" />
                    รายการกิจกรรมในแผน
                  </h2>
                  {!error && (
                    <p className="mt-1 text-sm text-gray-600">
                      รวมทั้งหมด {totalHours} ชั่วโมง
                    </p>
                  )}
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {error ? (
              <div className="text-center text-gray-500 py-8">{error}</div>
            ) : (
              <>
                {/* Activities List */}
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.activity_id || activity.id} 
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {activity.image_url && (
                          <div className="flex-shrink-0">
                            <img 
                              src={activity.image_url} 
                              alt={activity.name}
                              className="w-24 h-24 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = "/api/placeholder/200/200";
                                e.target.alt = "Activity placeholder image";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-base font-semibold text-gray-800 truncate">
                              {activity.name}
                            </h3>
                            <span className="flex-shrink-0 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">
                              {activity.format}
                            </span>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-600 mt-1 mb-2">
                            <span className="flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {activity.hours} ชั่วโมง
                            </span>
                            {activity.category && (
                              <span className="flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {activity.category}
                              </span>
                            )}
                          </div>
                          {activity.description && (
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600">
                      กิจกรรมทั้งหมด {activities.length} กิจกรรม
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={onClose} 
                      className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      ปิด
                    </button>
                    {canSave && token && (
                      <button
                        onClick={handleSave}
                        disabled={saved}
                        className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
                          saved 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        } transition-colors`}
                      >
                        {saved ? (
                          <>
                            บันทึกแล้ว
                            <CheckCircle className="w-3.5 h-3.5 ml-1.5" />
                          </>
                        ) : (
                          'บันทึกกิจกรรม'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
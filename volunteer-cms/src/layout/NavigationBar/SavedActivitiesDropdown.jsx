import React, { useRef, useEffect } from 'react';
import { useSavedActivities } from './SavedActivitiesContext';
import { toast } from 'react-toastify';

const SavedActivitiesDropdown = () => {
  const {
    savedActivities,
    removeActivity,
    isDropdownVisible,
    setIsDropdownVisible,
    saveAllActivities
  } = useSavedActivities();
  
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    // ใช้ mouseLeave เฉพาะบนหน้าจอ desktop
    if (window.innerWidth >= 768) {
      timeoutRef.current = setTimeout(() => {
        setIsDropdownVisible(false);
      }, 200);
    }
  };

  const handleSaveAll = async () => {
    try {
      await saveAllActivities();
      setIsDropdownVisible(false);
      toast.success('บันทึกกิจกรรมสำเร็จ');
    } catch (error) {
      toast.error(error.message || 'ไม่สามารถบันทึกกิจกรรมได้');
    }
  };

  // ปิด dropdown เมื่อคลิกด้านนอก (สำหรับ mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    if (window.innerWidth < 768) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsDropdownVisible]);

  if (!isDropdownVisible) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" />
      
      <div
        ref={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          bg-white rounded-lg shadow-xl z-50 border border-gray-100
          md:absolute md:right-0 md:top-12 md:w-80
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-[90vw] max-w-md
          md:transform-none  md:left-auto
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3BB77E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              กิจกรรมที่เตรียมบันทึก {savedActivities.length > 0 && `(${savedActivities.length})`}
            </h3>
            {/* Close button for mobile */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsDropdownVisible(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] md:max-h-96 overflow-y-auto">
          {savedActivities.length > 0 ? (
            <>
              <div className="p-2">
                {savedActivities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={activity.image_url || "/api/placeholder/420/126"}
                          alt={activity.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate group-hover:text-[#3BB77E] transition-colors">
                          {activity.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            activity.format === 'ออนไลน์'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {activity.format}
                          </span>
                          <span className="text-gray-500">{activity.hours} ชม.</span>
                        </div>
                        {activity.preparedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            เตรียมเมื่อ: {new Date(activity.preparedAt).toLocaleDateString('th-TH')}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeActivity(activity.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    {index < savedActivities.length - 1 && (
                      <div className="mx-2 border-b border-gray-100"></div>
                    )}
                  </div>
                ))}
              </div>
              {/* ปุ่มบันทึกทั้งหมด */}
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={handleSaveAll}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3BB77E] hover:bg-[#3BB77E]/90 text-white rounded-full transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                  </svg>
                  บันทึกทั้งหมด
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </div>
              <p className="text-gray-500">ยังไม่มีกิจกรรมที่เตรียมบันทึก</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedActivitiesDropdown;
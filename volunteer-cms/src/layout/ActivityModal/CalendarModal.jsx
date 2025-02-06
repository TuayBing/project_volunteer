import React, { useState } from 'react';

const CalendarModal = ({ isOpen, onClose, activities }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // กรองกิจกรรมตามเดือนที่เลือก
  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.createdAt);
    return activityDate.getMonth() === selectedMonth && 
           activityDate.getFullYear() === selectedYear;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl relative overflow-hidden shadow-2xl">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3BB77E]/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3BB77E] to-[#2D8E62] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {months[selectedMonth]}
                </h2>
                <p className="text-sm text-white/80">
                  พ.ศ. {selectedYear + 543}
                </p>
              </div>
              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Activities List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  {/* Activity Image/Icon */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    {activity.image_url ? (
                      <img 
                        src={activity.image_url} 
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#3BB77E]/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#3BB77E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-800 group-hover:text-[#3BB77E] transition-colors">
                        {activity.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.format === 'ออนไลน์'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {activity.format}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {activity.description}
                    </p>

                    {/* Stats */}
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-5 h-5 text-[#3BB77E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">{activity.hours} ชั่วโมง</span>
                      </div>

                      {activity.interested_count > 0 && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-gray-600">{activity.interested_count} คนสนใจ</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">ไม่มีกิจกรรมในเดือนนี้</h3>
              <p className="text-gray-500">ลองเลือกดูกิจกรรมในเดือนอื่น ๆ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
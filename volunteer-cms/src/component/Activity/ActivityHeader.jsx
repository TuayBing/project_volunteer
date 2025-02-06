import React from 'react';

const ActivityHeader = ({ onSearch, searchTerm, setShowCalendar }) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 mb-12">
      <div className="flex justify-between items-center">
        {/* Left side - Styled Title */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3BB77E] to-[#2D8E62] bg-clip-text text-transparent">
            กิจกรรมจิตอาสา
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1 w-12 bg-[#3BB77E] rounded-full"></div>
            <span className="text-sm text-gray-600">ร่วมสร้างสังคมที่ดีไปด้วยกัน</span>
          </div>
        </div>

        {/* Right side - Search and Buttons */}
        <div className="flex items-center gap-4">
          {/* Calendar Button */}
          <button
            onClick={() => setShowCalendar(true)}
            className="w-10 h-10 flex items-center justify-center bg-[#3BB77E] text-white rounded-full shadow-lg shadow-[#3BB77E]/30 hover:bg-[#2D8E62] hover:shadow-[#3BB77E]/40 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* Auto Activity Button */}
          <button
            className="w-10 h-10 flex items-center justify-center bg-[#3BB77E] text-white rounded-full shadow-lg shadow-[#3BB77E]/30 hover:bg-[#2D8E62] hover:shadow-[#3BB77E]/40 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Search Input */}
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="ค้นหากิจกรรม..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-[#3BB77E]/30 focus:border-[#3BB77E] shadow-sm hover:shadow transition-all duration-200"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeader;
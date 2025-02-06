import React from 'react';
import { useSelector } from 'react-redux';
import { selectStats, selectLoading } from '../../store/activityDashboardSlice';

const DashboardCard = () => {
  const stats = useSelector(selectStats);
  const loading = useSelector(selectLoading);

  // คำนวณเปอร์เซ็นต์
  const calculatePercentage = (value) => {
    if (stats.totalActivities === 0) return 0;
    return ((value / stats.totalActivities) * 100).toFixed(0);
  };

  // คำนวณค่าต่างๆ
  const completedPercentage = calculatePercentage(stats.completedActivities);
  const inProgressPercentage = calculatePercentage(stats.inProgressActivities);
  const expiredPercentage = calculatePercentage(stats.expiredActivities);

  // คำนวณ stroke-dashoffset สำหรับ SVG circle
  const calculateOffset = (percentage) => {
    const circumference = 226.2; // 2 * π * r (r=36)
    return circumference * (1 - percentage / 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-auto p-6">
      <h3 className="text-lg font-semibold mb-6">Dashboard</h3>
      <div className="flex items-center justify-between gap-4">
        {/* กิจกรรมสำเร็จ */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="36"
              className="stroke-current text-gray-200"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="36"
              className="stroke-current text-green-500"
              strokeWidth="12"
              fill="none"
              strokeDasharray="226.2"
              strokeDashoffset={calculateOffset(completedPercentage)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold">{completedPercentage}%</span>
          </div>
          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500">
            ({stats.completedActivities}/{stats.totalActivities})
          </div>
        </div>

        {/* รอดำเนินการ */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="36"
              className="stroke-current text-gray-200"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="36"
              className="stroke-current text-blue-600"
              strokeWidth="12"
              fill="none"
              strokeDasharray="226.2"
              strokeDashoffset={calculateOffset(inProgressPercentage)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold">{inProgressPercentage}%</span>
          </div>
          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500">
            ({stats.inProgressActivities}/{stats.totalActivities})
          </div>
        </div>

        {/* ยกเลิก */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="36"
              className="stroke-current text-gray-200"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="36"
              className="stroke-current text-red-500"
              strokeWidth="12"
              fill="none"
              strokeDasharray="226.2"
              strokeDashoffset={calculateOffset(expiredPercentage)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold">{expiredPercentage}%</span>
          </div>
          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500">
            ({stats.expiredActivities}/{stats.totalActivities})
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>สำเร็จ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span>รอดำเนินการ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>ยกเลิก</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
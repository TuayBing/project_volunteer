import React from 'react';
import ActivityCharts from './ActivityCharts';
import StudentLoanStats from './StudentLoanStats';
import FacultyLoanStats from './FacultyLoanStats';
import ActivityCompletionStats from './ActivityCompletionStats';

const Dashboard = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600">ภาพรวมและสถิติกิจกรรมจิตอาสา</p>
      </div>

      {/* Activity Stats */}
      <div className="mb-8">
        <ActivityCharts />
      </div>

      {/* Charts Section - Responsive */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-2/5"> {/* Full width on mobile, 40% on desktop */}
          <div className="h-full"> {/* Ensure full height for the card */}
            <StudentLoanStats />
          </div>
        </div>
        <div className="w-full lg:w-3/5"> {/* Full width on mobile, 60% on desktop */}
          <div className="h-full"> {/* Ensure full height for the card */}
            <FacultyLoanStats />
          </div>
        </div>
      </div>

      {/* Activity Completion Stats */}
      <div className="mb-8">
        <ActivityCompletionStats />
      </div>
    </div>
  );
};

export default Dashboard;
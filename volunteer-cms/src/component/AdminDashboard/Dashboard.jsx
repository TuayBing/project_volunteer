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

     {/* Charts Section */}
     <div className="flex gap-6 mb-8">
       <div className="w-2/5"> {/* 40% */}
         <StudentLoanStats />
       </div>
       <div className="w-3/5"> {/* 60% */}
         <FacultyLoanStats />
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
import React from 'react';
import { User, Bell } from 'lucide-react';

function TopNav() {
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      {/* Left side - can be used for logo or other content */}
      <div className="flex items-center gap-2">
      </div>

      {/* Right side - Notifications and Admin */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">3</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="w-8 h-8 text-gray-400" />
          <span className="text-gray-600 font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
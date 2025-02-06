import React from 'react';
import { Search, User, LogOut, LayoutDashboard, Users, Settings, FileText, DollarSign } from 'lucide-react';
import TopNav from './TopNav';
import SideNav from './SideNav';

function AdminLayout({ children }) { 
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideNav />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-6">
          {children} 
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

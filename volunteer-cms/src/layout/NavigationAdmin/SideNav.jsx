import React, { useState, useEffect } from 'react';
import { Home, LayoutDashboard, Calendar, UserPlus, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../component/AuthContext';

const SideNav = () => {
  const [currentPath, setCurrentPath] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await logout();
    const userRole = user?.role;
    if (userRole === 'admin') {
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  const isActive = (path) => currentPath === path;

  const menuItems = [
    { path: '/', icon: Home, text: 'กลับหน้าหลัก' },
    { path: '/admin/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { path: '/admin/addactivity', icon: Calendar, text: 'เพิ่มกิจกรรม' },
    { path: '/admin/adduser', icon: UserPlus, text: 'เพิ่มผู้ใช้' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 flex justify-center items-center border-b border-gray-100">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-30 w-auto"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 pt-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-gray-600 hover:bg-emerald-50 hover:text-[#3BB77E] transition-colors relative
                    ${active ? 'bg-emerald-50 text-[#3BB77E] border-r-4 border-[#3BB77E]' : ''}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors rounded"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
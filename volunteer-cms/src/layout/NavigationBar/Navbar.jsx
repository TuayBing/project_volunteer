import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Folder, LogIn, Home, Users, Calendar,
  UserCircle, Menu, X, LogOut, ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useSavedActivities } from './SavedActivitiesContext';
import SavedActivitiesDropdown from './SavedActivitiesDropdown';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../component/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    savedActivities,
    isDropdownVisible,
    setIsDropdownVisible,
    clearActivities
  } = useSavedActivities();
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (!storedUser || !storedToken) {
        setUser(null);
        setIsAdmin(false);
        return;
      }
      
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAdmin(['admin', 'superadmin'].includes(userData.role));
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      clearActivities();
      notificationRef.current?.resetNotifications();
      setUser(null);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      setIsDropdownVisible(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const isActive = (path) => window.location.pathname === path;
  const ProfileDropdown = () => (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-2"
    >
      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          onClick={() => {
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        >
          <LayoutDashboard className="mr-2" size={18} />
          หน้าควบคุม
        </Link>
      )}

      <Link
        to="/profilesettings"
        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
        onClick={() => {
          setIsDropdownOpen(false);
          setIsMobileMenuOpen(false);
        }}
      >
        <UserCircle className="mr-2" size={18} />
        จัดการโปรไฟล์
      </Link>

      <button
        onClick={handleLogout}
        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
      >
        <LogOut className="mr-2" size={18} />
        ออกจากระบบ
      </button>
    </div>
  );
  if (isAdmin) {
    return (
      <nav className="w-full bg-white shadow-lg">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-[140px]">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-[120px] md:h-[150px] w-auto mt-4 drop-shadow"
              />
            </Link>
  
            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Main Menu - Hidden on Mobile */}
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/"
                  className={`flex items-center px-4 py-2 text-gray-600 hover:text-[#3BB77E] transition-colors ${
                    isActive("/") ? "text-[#3BB77E]" : ""
                  }`}
                >
                  <Home className="w-5 h-5 mr-2" />
                  <span>หน้าแรก</span>
                </Link>
                <Link
                  to="/activity"
                  className={`flex items-center px-4 py-2 text-gray-600 hover:text-[#3BB77E] transition-colors ${
                    isActive("/activity") ? "text-[#3BB77E]" : ""
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>กิจกรรม</span>
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-[#3BB77E] transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  <span>หน้าควบคุม</span>
                </Link>
              </div>
  
              {/* User Profile and Mobile Menu */}
              <div className="flex items-center space-x-2">
                <NotificationDropdown ref={notificationRef} />
                <div className="relative">
                  <button 
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 bg-white text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block">{user?.username}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isDropdownOpen && <ProfileDropdown />}
                </div>
                {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="px-3 py-2">
                  <NotificationDropdown ref={notificationRef} />
                </div>
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#3BB77E] hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5 mr-2 inline-block" />
                  หน้าแรก
                </Link>
                <Link
                  to="/activity"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#3BB77E] hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="w-5 h-5 mr-2 inline-block" />
                  กิจกรรม
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#3BB77E] hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5 mr-2 inline-block" />
                  หน้าควบคุม
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
return (
  <nav className="w-full bg-white shadow-lg">
    <div className="max-w-[1920px] mx-auto px-4 lg:px-[140px]">
      <div className="flex justify-between items-center h-24">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-[120px] md:h-[150px] w-auto mt-4 drop-shadow"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 lg:space-x-8 mx-auto">
          {[
            { path: "/", label: "หน้าแรก", icon: Home },
            { path: "/activity", label: "กิจกรรม", icon: Calendar },
            { path: "/profile", label: "โปรไฟล์", icon: UserCircle },
            { path: "/contact", label: "ติดต่อเรา", icon: Users }
          ].map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`text-gray-600 text-sm lg:text-base font-medium px-2 lg:px-3 py-2 rounded-md transition-colors flex items-center ${
                isActive(path) ? "border-b-2 border-[#3BB77E] text-[#3BB77E]" : "hover:text-[#3BB77E]"
              }`}
            >
              <Icon className="mr-1" size={20} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side Icons and Buttons */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <NotificationDropdown ref={notificationRef} />
          
          {/* Saved Activities Folder */}
          <div className="relative">
            <button 
              onMouseEnter={() => setIsDropdownVisible(true)}
              className="p-2 rounded-full hover:bg-gray-100 shadow-sm relative"
            >
              <Folder size={24} className="text-gray-600 hover:text-[#3BB77E]" />
              {savedActivities.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {savedActivities.length}
                </span>
              )}
            </button>
            <SavedActivitiesDropdown />
          </div>
          
          {/* User Profile or Login Button */}
          {user ? (
            <div className="relative">
              <button 
                onClick={toggleUserDropdown}
                className="flex items-center space-x-2 bg-white text-gray-600 px-4 lg:px-6 py-1.5 lg:py-2 text-sm lg:text-base rounded-full hover:bg-gray-100 transition-colors shadow-md"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
                <ChevronDown size={16} />
              </button>
              {isDropdownOpen && <ProfileDropdown />}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#3BB77E] text-white px-4 lg:px-6 py-1.5 lg:py-2 text-sm lg:text-base rounded-full hover:bg-[#33a96e] transition-colors flex items-center shadow-sm"
            >
              <LogIn className="mr-1" size={20} />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none shadow-sm"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <Menu size={24} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-lg">
          <div className="px-3 py-2">
            <NotificationDropdown ref={notificationRef} />
          </div>
          
          {[
            { path: "/", label: "หน้าแรก", icon: Home },
            { path: "/activity", label: "กิจกรรม", icon: Calendar },
            { path: "/profile", label: "โปรไฟล์", icon: UserCircle },
            { path: "/contact", label: "ติดต่อเรา", icon: Users }
          ].map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(path) ? "text-[#3BB77E]" : "text-gray-600 hover:text-[#3BB77E]"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="mr-2" size={20} />
              {label}
            </Link>
          ))}

          {/* Mobile Saved Activities */}
          {savedActivities.length > 0 && (
            <div className="px-3 py-2">
              <button
                onClick={() => {
                  setIsDropdownVisible(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center text-gray-600 hover:text-[#3BB77E]"
              >
                <Folder className="mr-2" size={20} />
                กิจกรรมที่บันทึก ({savedActivities.length})
              </button>
            </div>
          )}

          {/* Mobile User Profile */}
          {user && (
            <div className="px-3 py-2 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">{user.username}</span>
                  <span className="block text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="mr-2" size={20} />
                    หน้าควบคุม
                  </Link>
                )}
                <Link
                  to="/profilesettings"
                  className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircle className="mr-2" size={20} />
                  จัดการโปรไฟล์
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 shadow-sm w-full"
                >
                  <LogOut className="mr-2" size={20} />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>
);
};

export default Navbar;
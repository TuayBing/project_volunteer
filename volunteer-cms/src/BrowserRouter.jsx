import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './component/Login/ProtectedRoute';
import Home from './component/Home/Home';
import Contact from './component/Contact/Contact';
import Activity from './component/Activity/Activity';
import Profile from './component/Profile/Profile';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import Forgot from './component/Forgot/Forgot';
import Setting from './component/SettingProfile/Setting';
import AdminDashboard from './component/AdminDashboard/AdminDashboard';
import AdminUser from './component/AdminUsers/AdminUser';
import AdminActivity from './component/AdminActivity/AdminActivity';

function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/profilesettings" element={<Setting />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/adduser"
        element={
          <ProtectedRoute>
            <AdminUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/addactivity"
        element={
          <ProtectedRoute>
            <AdminActivity />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
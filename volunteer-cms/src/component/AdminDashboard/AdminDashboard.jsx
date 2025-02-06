import React from 'react'
import AdminLayout from '../../layout/NavigationAdmin/AdminLayout'
import Dashboard from './Dashboard'


function AdminDashboard() {
  return (
    <div>
       <AdminLayout>
         <Dashboard />
       </AdminLayout>
    </div>
  )
}

export default AdminDashboard
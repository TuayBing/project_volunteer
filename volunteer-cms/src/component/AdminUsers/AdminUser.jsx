import React from 'react'
import AdminLayout from '../../layout/NavigationAdmin/AdminLayout'
import UserAddForm from './UserAddForm'
import UserOverview from './UserOverview'



function AdminUser() {
  return (
    <div>
       <AdminLayout>
          <UserOverview />
          <UserAddForm />
       </AdminLayout>
    </div>
  )
}

export default AdminUser
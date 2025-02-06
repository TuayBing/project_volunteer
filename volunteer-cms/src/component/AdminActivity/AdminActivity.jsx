import React from 'react'
import AdminLayout from '../../layout/NavigationAdmin/AdminLayout'
import ActivityOverview from './ActivityOverview';
import CategoryForm from './CategoryForm';
import AddActivityForm from './AddActivityForm';
import PlanActivityForm from './PlanActivityForm';

function AdminActivity() {
  return (
    <div>
       <AdminLayout>
          <ActivityOverview />
          <CategoryForm />
          <AddActivityForm />
          <PlanActivityForm />
       </AdminLayout>
    </div>
  )
}

export default AdminActivity
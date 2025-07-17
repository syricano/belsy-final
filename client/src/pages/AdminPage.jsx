import React from 'react'
import { AdminDashboard } from '@/components'
import OverviewCards from '@/components/admin/OverviewCards'
const AdminPage = () => {
  return (
    <div className="min-h-screen main-section py-16 px-4">
        <OverviewCards />
        <AdminDashboard />       

    </div>
  )
}

export default AdminPage
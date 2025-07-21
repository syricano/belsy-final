import React from 'react'
import { AdminDashboard } from '@/components'
import OverviewCards from '@/components/Admin/OverviewCards'
const AdminPage = () => {
  return (
    <div className="min-h-screen main-section py-16 px-4 flex flex-col items-center">
        <OverviewCards />
        <AdminDashboard />       

    </div>
  )
}

export default AdminPage
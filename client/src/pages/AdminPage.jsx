import React from 'react'
import { AdminDashboard } from '@/components'
import OverviewCards from '@/components/Admin/OverviewCards'
const AdminPage = () => {
  return (
    <div className="min-h-screen px-1 main-section flex flex-col items-center">        
      <AdminDashboard /> 
      <OverviewCards />
    </div>
  )
}

export default AdminPage
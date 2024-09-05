import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className=' max-w-screen'>
      <LeftSidebar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

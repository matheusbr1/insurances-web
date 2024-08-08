import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className='min-h-screen min-w-[100%] flex items-center justify-center' >
      <Outlet />
    </div>
  )
}
import { Header } from '@/components/header'
import { APP_NAME } from '@/constants'
import { api } from '@/lib/axios'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export function AppLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = sessionStorage.getItem(`@${APP_NAME}:access-token`)
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    } else {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className='flex min-h-screen flex-col antialised' >
      <Header />

      <div className='flex flex-1 flex-col gap-4 p-8 pt-6' >
        <Outlet />
      </div>
    </div>
  )
}
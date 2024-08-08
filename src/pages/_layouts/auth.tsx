import { Lock } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className='min-h-screen grid-cols-2 grid antialised' >
      <div className='h-full border-r border-foreground/5 bg-muted p-10 text-muted-foreground flex flex-col justify-between' >
        <div className='flex items-center gap-3 text-lg font-medium text-foreground' >
          <Lock className='h-5 w-5' />
          <span className='font-semibold' >harper.seguros</span>
        </div>
        <footer className='text-sm' >
          Painel do parceiro &copy; harper.seguros
        </footer>
      </div>
      <div className='relative flex flex-col items-center justify-center' >
        <Outlet />
      </div>
    </div>
  )
}
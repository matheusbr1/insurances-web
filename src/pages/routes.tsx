import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from './_layouts/auth'
import { Dashboard } from './app/dashboard'
import { SignIn } from './auth/sign-in'
import { Error } from './error'
import { NotFound } from './404'
import { AppLayout } from './_layouts/app'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Dashboard /> },
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
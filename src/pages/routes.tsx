import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from './_layouts/auth'
import { Dashboard } from './app/dashboard'
import { SignIn } from './auth/sign-in'
import { Error } from './error'
import { NotFound } from './404'
import { AppLayout } from './_layouts/app'
import { Users } from './app/users/users'
import { Customers } from './app/customers/customers'
import { Customer } from './app/customers/customer'
import { Producers } from './app/producers/producers'
import { Producer } from './app/producers/producer'

export const router = createBrowserRouter([
  {
    path: '/app',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'customers', element: <Customers /> },
      { path: 'customers/new', element: <Customer /> },
      { path: 'producers', element: <Producers /> },
      { path: 'producers/new', element: <Producer /> },
    ]
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '', element: <SignIn /> },
    ]
  },
  {
    path: '*',
    element: <NotFound />,
  },
], {
  basename: '/insurances-web'
})
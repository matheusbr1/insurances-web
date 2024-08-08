import './global.css'

import { RouterProvider } from 'react-router-dom'
import { router } from './pages/routes'
import { ThemeProvider } from './components/theme/theme-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey='insurances-theme' defaultTheme='dark' >
        <Toaster richColors />
        <Helmet titleTemplate='%s | harper.insurances' />
        <QueryClientProvider client={queryClient} >
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App

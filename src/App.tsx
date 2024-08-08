import './global.css'

import { RouterProvider } from 'react-router-dom'
import { router } from './pages/routes'
import { ThemeProvider } from './components/theme/theme-provider'

function App() {
  return (
    <ThemeProvider storageKey='insurances-theme' defaultTheme='dark' >
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App

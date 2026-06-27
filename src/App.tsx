import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/app/routes'
import { AuthProvider } from '@/context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoadingState } from '@/components/ui/LoadingState'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useAuth } from '@/context/AuthContext'

const SilentResidentBootPage = lazy(() => import('@/pages/auth/SilentResidentBootPage'))
const DriverPhonePage = lazy(() => import('@/pages/auth/DriverPhonePage'))
const DriverOtpPage = lazy(() => import('@/pages/auth/DriverOtpPage'))
const ProfilePage = lazy(() => import('@/pages/onboarding/ProfilePage'))
const ResidentialPage = lazy(() => import('@/pages/onboarding/ResidentialPage'))
const ClientHomePage = lazy(() => import('@/pages/client/HomePage'))
const ClientTrackPage = lazy(() => import('@/pages/client/TrackPage'))
const ClientAccountPage = lazy(() => import('@/pages/client/AccountPage'))
const PickupDetailsPage = lazy(() => import('@/pages/client/PickupDetailsPage'))
const CollectorDashboardPage = lazy(() => import('@/pages/collector/DashboardPage'))
const CollectorHistoryPage = lazy(() => import('@/pages/collector/HistoryPage'))
const CollectorAccountPage = lazy(() => import('@/pages/collector/AccountPage'))

function RoleGate({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem('borlaboard_role')
  if (role === 'driver') return <Navigate to="/collector/dashboard" replace />
  return <>{children}</>
}

function ResidentGate({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem('borlaboard_role')
  const isComplete = localStorage.getItem('borlaboard_onboarding_complete') === 'true'
  
  if (role === 'driver') return <Navigate to="/collector/dashboard" replace />
  if (!isComplete) return <Navigate to="/" replace />
  
  return <>{children}</>
}

function DriverGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth()
  
  if (isInitializing) return <LoadingState />
  if (!isAuthenticated) return <Navigate to="/auth/phone" replace />
  
  return <>{children}</>
}

function withPageWrapper(element: React.ReactNode) {
  return (
    <PageWrapper>
      <Suspense fallback={<LoadingState />}>{element}</Suspense>
    </PageWrapper>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={withPageWrapper(<SilentResidentBootPage />)} />
      <Route path="/auth/phone" element={withPageWrapper(<DriverPhonePage />)} />
      <Route path="/auth/otp" element={withPageWrapper(<DriverOtpPage />)} />

      <Route
        path="/onboarding/profile"
        element={withPageWrapper(
          <RoleGate>
            <ProfilePage />
          </RoleGate>,
        )}
      />
      <Route
        path="/onboarding/residential"
        element={withPageWrapper(
          <RoleGate>
            <ResidentialPage />
          </RoleGate>,
        )}
      />

      <Route
        path="/client/home"
        element={withPageWrapper(
          <ResidentGate>
            <ClientHomePage />
          </ResidentGate>,
        )}
      />
      <Route
        path="/client/pickup-details"
        element={withPageWrapper(
          <RoleGate>
            <PickupDetailsPage />
          </RoleGate>,
        )}
      />
      <Route
        path="/client/track"
        element={withPageWrapper(
          <ResidentGate>
            <ClientTrackPage />
          </ResidentGate>,
        )}
      />
      <Route
        path="/client/account"
        element={withPageWrapper(
          <ResidentGate>
            <ClientAccountPage />
          </ResidentGate>,
        )}
      />

      <Route
        path="/collector/dashboard"
        element={withPageWrapper(
          <DriverGate>
            <CollectorDashboardPage />
          </DriverGate>,
        )}
      />
      <Route
        path="/collector/history"
        element={withPageWrapper(
          <DriverGate>
            <CollectorHistoryPage />
          </DriverGate>,
        )}
      />
      <Route
        path="/collector/account"
        element={withPageWrapper(
          <DriverGate>
            <CollectorAccountPage />
          </DriverGate>,
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

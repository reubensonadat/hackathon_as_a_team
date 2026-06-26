import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrCreateDeviceId } from '@/lib/deviceId'
import { LoadingState } from '@/components/ui/LoadingState'

export default function SilentResidentBootPage() {
  const navigate = useNavigate()

  useEffect(() => {
    getOrCreateDeviceId()
    const onboardingDone = localStorage.getItem('borlaboard_onboarding_complete') === 'true'
    navigate(onboardingDone ? '/client/home' : '/onboarding/profile', { replace: true })
  }, [navigate])

  return <LoadingState message="Setting up your device…" />
}

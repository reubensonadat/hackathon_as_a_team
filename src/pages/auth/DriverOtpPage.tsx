import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NavIcons } from '@/components/icons'
import { hapticTap } from '@/lib/utils'

export default function DriverOtpPage() {
  const navigate = useNavigate()
  const phone = sessionStorage.getItem('borlaboard_driver_phone') ?? ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    if (otp.length !== 4) {
      setError('Enter the 4-digit code')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 800))
      hapticTap()
      localStorage.setItem('borlaboard_role', 'driver')
      navigate('/collector/dashboard', { replace: true })
    } catch {
      setError('Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
          Verify OTP
        </p>
        <h1 className="mt-1 text-3xl font-black">Enter code</h1>
        <p className="mt-2 text-sm font-medium text-[var(--color-foreground-muted)]">
          Sent to {phone || 'your phone'}
        </p>
      </div>

      <Card className="space-y-4">
        <Input
          label="4-digit OTP"
          inputMode="numeric"
          maxLength={4}
          placeholder="0000"
          value={otp}
          leftIcon={NavIcons.outline.otp}
          error={error ?? undefined}
          className="text-center tracking-[0.5em]"
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))
            setError(null)
          }}
        />
        <Button fullWidth loading={loading} onClick={handleVerify}>
          Verify & continue
        </Button>
      </Card>
    </AppShell>
  )
}

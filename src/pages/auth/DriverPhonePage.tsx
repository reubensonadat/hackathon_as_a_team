import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { IconBox } from '@/components/ui/IconBox'
import { BorlaBoardMarkIcon, PickupTruckIcon } from '@/components/icons'
import { NavIcons } from '@/components/icons'
import { hapticTap } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

export default function DriverPhonePage() {
  const navigate = useNavigate()
  const { signInWithPhone } = useAuth()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 9) {
      setError('Enter a valid Ghana phone number')
      return
    }

    let formatted = cleaned
    if (formatted.startsWith('0')) {
      formatted = '+233' + formatted.substring(1)
    } else if (!formatted.startsWith('233') && !formatted.startsWith('+233')) {
      formatted = '+233' + formatted
    } else if (formatted.startsWith('233')) {
      formatted = '+' + formatted
    }

    hapticTap()
    setLoading(true)
    setError(null)

    const { error: signInError } = await signInWithPhone(formatted)

    if (signInError) {
      setError(signInError.message || 'Failed to send OTP')
      setLoading(false)
      return
    }

    sessionStorage.setItem('borlaboard_driver_phone', formatted)
    setLoading(false)
    navigate('/auth/otp')
  }

  return (
    <AppShell>
      <div className="mb-8 flex items-start gap-4">
        <IconBox icon={PickupTruckIcon} variant="accent" size="lg" />
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
            Collector login
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-3xl font-black">
            <BorlaBoardMarkIcon className="h-7 w-7 text-[var(--color-accent)]" />
            BorlaBoard
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--color-foreground-muted)]">
            Enter your phone number to receive a 4-digit OTP.
          </p>
        </div>
      </div>

      <Card className="space-y-4">
        <Input
          label="Phone number"
          type="tel"
          placeholder="024XXXXXXX"
          value={phone}
          leftIcon={NavIcons.outline.phone}
          error={error ?? undefined}
          onChange={(e) => {
            setPhone(e.target.value)
            setError(null)
          }}
        />
        <Button fullWidth loading={loading} disabled={loading} onClick={handleContinue}>
          Send OTP
        </Button>
      </Card>

      <p className="mt-6 text-center text-xs font-medium text-[var(--color-foreground-muted)]">
        Resident?{' '}
        <Link to="/" className="font-black text-[var(--color-accent)]">
          Continue as resident
        </Link>
      </p>
    </AppShell>
  )
}

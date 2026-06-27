import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NavIcons } from '@/components/icons'
import { hapticTap } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function DriverOtpPage() {
  const navigate = useNavigate()
  const { verifyPhoneOtp } = useAuth()
  const phone = sessionStorage.getItem('borlaboard_driver_phone') ?? ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    if (otp.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { error: verifyError, user } = await verifyPhoneOtp(phone, otp)
      
      if (verifyError || !user) {
        throw new Error(verifyError?.message || 'Verification failed')
      }
      
      if (supabase) {
        // Upsert driver profile
        const { data: existingDriver } = await supabase
          .from('drivers')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        if (!existingDriver) {
          await supabase.from('drivers').insert({
            id: user.id,
            phone: phone,
          })
          
          await supabase.from('driver_wallets').insert({
            driver_id: user.id,
            balance: 0,
          })
        }
      }

      hapticTap()
      localStorage.setItem('borlaboard_role', 'driver')
      navigate('/collector/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Verification failed. Try again.')
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
          label="6-digit OTP"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={otp}
          leftIcon={NavIcons.outline.otp}
          error={error ?? undefined}
          className="text-center tracking-[0.5em]"
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
            setError(null)
          }}
        />
        <Button fullWidth loading={loading} disabled={loading} onClick={handleVerify}>
          Verify & continue
        </Button>
      </Card>
    </AppShell>
  )
}

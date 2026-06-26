import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { hapticTap } from '@/lib/utils'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleContinue() {
    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }
    hapticTap()
    localStorage.setItem('borlaboard_profile_name', fullName.trim())
    localStorage.setItem('borlaboard_profile_phone', phone.trim())
    navigate('/onboarding/residential')
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
          Step 1 of 2
        </p>
        <h1 className="mt-1 text-3xl font-black">Your profile</h1>
        <p className="mt-2 text-sm font-medium text-[var(--color-foreground-muted)]">
          Tell us who you are so collectors can reach you.
        </p>
      </div>

      <Card className="space-y-4">
        <Input
          label="Full name"
          value={fullName}
          leftIcon={UserIcon}
          error={error ?? undefined}
          onChange={(e) => {
            setFullName(e.target.value)
            setError(null)
          }}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="024XXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button fullWidth onClick={handleContinue}>
          Continue
        </Button>
      </Card>
    </AppShell>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { hapticTap } from '@/lib/utils'

export default function ResidentialPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [area, setArea] = useState('Amamoma')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFinish() {
    if (!address.trim()) {
      setError('Residential address is required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      localStorage.setItem('borlaboard_residential_address', address.trim())
      localStorage.setItem('borlaboard_residential_area', area)
      localStorage.setItem('borlaboard_onboarding_complete', 'true')
      hapticTap()
      navigate('/client/home', { replace: true })
    } catch {
      setError('Could not save address. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-foreground-muted)]">
          Step 2 of 2
        </p>
        <h1 className="mt-1 text-3xl font-black">Where you live</h1>
        <p className="mt-2 text-sm font-medium text-[var(--color-foreground-muted)]">
          Cape Coast / Amamoma — used for pickup location.
        </p>
      </div>

      <Card className="space-y-4">
        <Input
          label="Street / landmark"
          placeholder="e.g. Near Amamoma junction"
          value={address}
          leftIcon={MapPinIcon}
          error={error ?? undefined}
          hint="Geocode via react-geocode — wired in next pass"
          onChange={(e) => {
            setAddress(e.target.value)
            setError(null)
          }}
        />
        <div>
          <label
            htmlFor="area"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-muted)]"
          >
            Area
          </label>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3.5 text-[16px] font-semibold outline-none focus:border-[var(--color-accent)]"
          >
            <option value="Amamoma">Amamoma</option>
            <option value="Cape Coast">Cape Coast</option>
            <option value="Kwaprow">Kwaprow</option>
          </select>
        </div>
        <Button fullWidth loading={loading} onClick={handleFinish}>
          Finish onboarding
        </Button>
      </Card>
    </AppShell>
  )
}

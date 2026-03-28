'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Signature } from '@/components/Signature'
import { MarketingOptOut } from '@/components/MarketingOptOut'
import { RegistrationData } from '@/types/registration'

const POLICIES = [
  "Smoking and vaping within the hotel, including balconies, is strictly prohibited. Pets are not permitted. Failure to comply may result in a minimum penalty of $1,000.",
  "Check-in is 3:00 PM, check-out is 11:00 AM. Late check-out available upon request and may incur additional charges.",
  "The Royce has a strict \"No Party Policy\". Maximum occupancy is two (2) adults per room. Please be mindful of noise levels.",
  "Valet Parking: The Royce is not liable for any loss or damage to vehicles or contents.",
  "Children must always be supervised and never left unattended in rooms.",
  "Possession of drugs or paraphernalia will be reported to police and may result in eviction.",
  "Authorised expenses including damage or excess cleaning fees will be charged to the card provided.",
]

export default function SignPage() {
  const params = useParams()
  const router = useRouter()
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [marketingOptOut, setMarketingOptOut] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function fetchRegistration() {
      try {
        const res = await fetch(`/api/registrations/${params.id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Registration not found')
          } else {
            setError('Failed to load registration')
          }
          return
        }
        const data = await res.json()
        if (data.status === 'signed') {
          setSubmitted(true)
        }
        setRegistration(data)
      } catch {
        setError('Failed to load registration')
      } finally {
        setLoading(false)
      }
    }
    fetchRegistration()
  }, [params.id])

  const handleSignatureChange = useCallback((dataUrl: string | null) => {
    setSignature(dataUrl)
  }, [])

  const handleSubmit = async () => {
    if (!signature) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/registrations/${params.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, marketingOptOut }),
      })
      
      if (!res.ok) throw new Error('Failed to submit')
      
      setSubmitted(true)
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/admin')}
            className="text-accent hover:underline"
          >
            Return to Admin
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="font-serif text-3xl mb-2">Thank You</h1>
          <p className="text-muted">Your registration has been completed.</p>
          <p className="text-muted mt-2">Welcome to The Royce.</p>
        </div>
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-AU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden fixed inset-0 p-4 lg:p-6">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 688 308" className="h-8 lg:h-10 text-foreground" fill="currentColor">
              <path d="M39.06 228.8v-25.27h28.1c9.67 0 14.95 5.4 14.95 12.71 0 7.3-5.28 12.56-14.95 12.56h-28.1zm47.01 29.36c-6.75-7.37-16.96-9.01-22.92-9.29l5.4-.05c24.17 0 36.84-12.13 36.84-32.58 0-20.45-14.66-32.88-37.32-32.88H15.79v107.39h23.27v-41.93h15.11l30.36 41.93h27.2l-25.66-32.59zM209.63 292.94c-32.78 0-58.92-23.08-58.92-56.25 0-33.31 26.14-56.25 58.92-56.25s58.93 22.94 58.93 56.25c0 33.17-26.14 56.25-58.93 56.25m0-92.34c-21.6 0-35.65 14.9-35.65 36.09 0 21.04 14.05 36.09 35.65 36.09 21.61 0 35.66-15.05 35.66-36.09 0-21.19-14.05-36.09-35.66-36.09M365.26 290.75h-23.27v-43.54l-43.51-63.85h26.89s18.56 28.38 20.53 31.18c7.87 11.21 7.73 29.89 7.73 29.89s.72-19.2 7.63-29.45c1.73-2.56 21.07-31.62 21.07-31.62h26.74l-43.81 63.56v43.83zM497.16 292.94c-33.99 0-58.17-23.38-58.17-56.4 0-33.9 25.68-56.1 58.17-56.1 21.91 0 41.7 10.08 50.76 28.79l-19.03 12.13c-4.23-12.13-16.17-20.76-32.03-20.76-20.55 0-34.6 14.32-34.6 36.09 0 21.19 13.45 36.09 34.3 36.09 15.41 0 28.86-8.04 32.93-21.19l19.19 12.13c-9.97 18.85-28.71 29.22-51.52 29.22M593.25 183.36v107.39h77.95v-20.17h-54.69v-23.66h50.31v-19.87h-50.31v-23.52h54.39v-20.17z"/>
            </svg>
            <span className="font-serif text-lg lg:text-xl">Registration Card</span>
          </div>
          <div className="text-sm text-muted">{today}</div>
        </div>

        {/* Main content - two columns */}
        <div className="flex-1 grid grid-cols-2 gap-4 lg:gap-6 min-h-0">
          {/* Left column - Guest & Reservation details */}
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Guest Details */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 flex-shrink-0">
              <h2 className="font-serif text-sm font-semibold text-accent mb-2 uppercase tracking-wide">Guest Details</h2>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted">Name:</span> {registration?.guestName || '—'}</p>
                <p><span className="text-muted">Phone:</span> {registration?.contactNumber || '—'}</p>
                <p><span className="text-muted">Email:</span> {registration?.email || '—'}</p>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 flex-shrink-0">
              <h2 className="font-serif text-sm font-semibold text-accent mb-2 uppercase tracking-wide">Reservation</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p><span className="text-muted">Res #:</span> {registration?.reservationNumber || '—'}</p>
                <p><span className="text-muted">Room:</span> {registration?.roomNumber || '—'}</p>
                <p><span className="text-muted">Arrival:</span> {registration?.arrivalDate || '—'}</p>
                <p><span className="text-muted">Departure:</span> {registration?.departureDate || '—'}</p>
                <p><span className="text-muted">Nights:</span> {registration?.nights || '—'}</p>
                <p><span className="text-muted">Type:</span> {registration?.roomType || '—'}</p>
                <p className="col-span-2"><span className="text-muted">Guests:</span> {registration?.adults || 0} Adult{(registration?.adults || 0) !== 1 ? 's' : ''}{registration?.children ? `, ${registration.children} Child${registration.children !== 1 ? 'ren' : ''}` : ''}</p>
              </div>
            </div>
          </div>

          {/* Right column - Policies & Signature */}
          <div className="flex flex-col gap-3 overflow-hidden">
            {/* Policies */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 flex-shrink-0 overflow-hidden">
              <h2 className="font-serif text-sm font-semibold text-accent mb-2 uppercase tracking-wide">Policies & Acknowledgment</h2>
              <ol className="text-[10px] lg:text-xs text-muted space-y-1 list-decimal list-inside">
                {POLICIES.map((policy, i) => (
                  <li key={i} className="leading-tight">{policy}</li>
                ))}
              </ol>
            </div>

            {/* Marketing Opt-out */}
            <div className="flex-shrink-0">
              <MarketingOptOut checked={marketingOptOut} onChange={setMarketingOptOut} />
            </div>

            {/* Signature */}
            <div className="flex-1 min-h-[120px] flex flex-col">
              <h2 className="font-serif text-sm font-semibold text-accent mb-2 uppercase tracking-wide">Signature</h2>
              <div className="flex-1 min-h-0">
                <Signature onChange={handleSignatureChange} className="h-full" />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!signature || submitting}
              className="w-full py-3 bg-accent text-white font-semibold rounded-lg 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:opacity-90 transition-opacity flex-shrink-0"
            >
              {submitting ? 'Submitting...' : 'Complete Registration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { RegistrationData } from '@/types/registration'

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch('/api/registrations')
      const data = await res.json()
      setRegistrations(data)
    } catch {
      console.error('Failed to fetch registrations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please upload a PDF file' })
      return
    }

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      // Save the registration
      await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.data),
      })

      setMessage({ type: 'success', text: `Registration created for ${data.data.guestName || 'Guest'}` })
      fetchRegistrations()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/sign/${id}`
    navigator.clipboard.writeText(url)
    setMessage({ type: 'success', text: 'Link copied to clipboard' })
  }

  const deleteRegistration = async (id: string) => {
    if (!confirm('Delete this registration?')) return
    
    try {
      await fetch(`/api/registrations/${id}`, { method: 'DELETE' })
      fetchRegistrations()
      setMessage({ type: 'success', text: 'Registration deleted' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' })
    }
  }

  const pending = registrations.filter(r => r.status === 'pending')
  const signed = registrations.filter(r => r.status === 'signed')

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <svg viewBox="0 0 688 308" className="h-10 text-foreground" fill="currentColor">
            <path d="M39.06 228.8v-25.27h28.1c9.67 0 14.95 5.4 14.95 12.71 0 7.3-5.28 12.56-14.95 12.56h-28.1zm47.01 29.36c-6.75-7.37-16.96-9.01-22.92-9.29l5.4-.05c24.17 0 36.84-12.13 36.84-32.58 0-20.45-14.66-32.88-37.32-32.88H15.79v107.39h23.27v-41.93h15.11l30.36 41.93h27.2l-25.66-32.59zM209.63 292.94c-32.78 0-58.92-23.08-58.92-56.25 0-33.31 26.14-56.25 58.92-56.25s58.93 22.94 58.93 56.25c0 33.17-26.14 56.25-58.93 56.25m0-92.34c-21.6 0-35.65 14.9-35.65 36.09 0 21.04 14.05 36.09 35.65 36.09 21.61 0 35.66-15.05 35.66-36.09 0-21.19-14.05-36.09-35.66-36.09M365.26 290.75h-23.27v-43.54l-43.51-63.85h26.89s18.56 28.38 20.53 31.18c7.87 11.21 7.73 29.89 7.73 29.89s.72-19.2 7.63-29.45c1.73-2.56 21.07-31.62 21.07-31.62h26.74l-43.81 63.56v43.83zM497.16 292.94c-33.99 0-58.17-23.38-58.17-56.4 0-33.9 25.68-56.1 58.17-56.1 21.91 0 41.7 10.08 50.76 28.79l-19.03 12.13c-4.23-12.13-16.17-20.76-32.03-20.76-20.55 0-34.6 14.32-34.6 36.09 0 21.19 13.45 36.09 34.3 36.09 15.41 0 28.86-8.04 32.93-21.19l19.19 12.13c-9.97 18.85-28.71 29.22-51.52 29.22M593.25 183.36v107.39h77.95v-20.17h-54.69v-23.66h50.31v-19.87h-50.31v-23.52h54.39v-20.17z"/>
          </svg>
          <h1 className="font-serif text-2xl">Registration Management</h1>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
            {message.text}
          </div>
        )}

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors
            ${dragActive ? 'border-accent bg-accent/10' : 'border-neutral-300 dark:border-neutral-600'}
            ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-accent'}`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <svg className="w-12 h-12 mx-auto text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg mb-2">{uploading ? 'Uploading...' : 'Drop PDF here, or click to upload'}</p>
            <p className="text-sm text-muted">Upload a pre-filled registration card PDF</p>
          </label>
        </div>

        {/* Pending Registrations */}
        <div className="mb-8">
          <h2 className="font-serif text-lg text-accent mb-4">Pending Registrations ({pending.length})</h2>
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : pending.length === 0 ? (
            <p className="text-muted">No pending registrations</p>
          ) : (
            <div className="space-y-2">
              {pending.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                  <div>
                    <p className="font-medium">{reg.guestName || 'Unknown Guest'}</p>
                    <p className="text-sm text-muted">Room {reg.roomNumber} · Res #{reg.reservationNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyLink(reg.id)}
                      className="px-3 py-1.5 text-sm bg-accent text-white rounded hover:opacity-90"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => deleteRegistration(reg.id)}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signed Registrations */}
        <div>
          <h2 className="font-serif text-lg text-accent mb-4">Signed Today ({signed.length})</h2>
          {signed.length === 0 ? (
            <p className="text-muted">No signed registrations yet</p>
          ) : (
            <div className="space-y-2">
              {signed.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4">
                  <div>
                    <p className="font-medium">{reg.guestName || 'Unknown Guest'}</p>
                    <p className="text-sm text-muted">Room {reg.roomNumber} · Signed</p>
                  </div>
                  <span className="text-green-500 text-sm">✓ Completed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

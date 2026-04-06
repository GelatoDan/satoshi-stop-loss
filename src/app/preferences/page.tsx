'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PreferencesContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid unsubscribe link.')
      return
    }

    const unsubscribe = async () => {
      try {
        const res = await fetch(`/api/unsubscribe?token=${token}`)
        const data = await res.json()
        if (res.ok) {
          setStatus('done')
        } else {
          setStatus('error')
          setMessage(data.error || 'Could not unsubscribe. The link may be invalid.')
        }
      } catch {
        setStatus('error')
        setMessage('Network error. Please try again.')
      }
    }

    unsubscribe()
  }, [token])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-bitcoin text-4xl mb-6">₿</div>

        {status === 'loading' && (
          <>
            <h1 className="text-2xl font-bold mb-3">Unsubscribing...</h1>
            <p className="text-white/40 text-sm">Just a moment.</p>
          </>
        )}

        {status === 'done' && (
          <>
            <h1 className="text-2xl font-bold mb-3">You&#39;ve been unsubscribed</h1>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              You won&#39;t receive any more alerts from Satoshi Stop Loss.
              You can re-subscribe any time from the homepage.
            </p>
            <a
              href="/"
              className="inline-block border border-white/10 hover:border-bitcoin/40 text-white/60 hover:text-white px-6 py-3 rounded-lg transition-colors text-sm"
            >
              ← Back to homepage
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-3 text-red-400">Something went wrong</h1>
            <p className="text-white/50 text-sm mb-6">{message}</p>
            <a
              href="/"
              className="inline-block border border-white/10 text-white/40 px-6 py-3 rounded-lg text-sm"
            >
              ← Homepage
            </a>
          </>
        )}
      </div>
    </main>
  )
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading...</div>
      </main>
    }>
      <PreferencesContent />
    </Suspense>
  )
}

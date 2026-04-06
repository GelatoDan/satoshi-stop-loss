'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid confirmation link. Please check your email and try again.')
      return
    }

    const confirm = async () => {
      try {
        const res = await fetch(`/api/confirm?token=${token}`)
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
        } else {
          setStatus('error')
          setMessage(data.error || 'Confirmation failed. The link may have expired.')
        }
      } catch {
        setStatus('error')
        setMessage('Network error. Please try again.')
      }
    }

    confirm()
  }, [token])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-bitcoin text-4xl mb-6">₿</div>

        {status === 'loading' && (
          <>
            <h1 className="text-2xl font-bold mb-3">Confirming your alert...</h1>
            <p className="text-white/40 text-sm">Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-3 text-green-400">You&#39;re on the watchlist</h1>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Your alert is active. We&#39;re watching all Patoshi pattern wallets 24/7.
              If Satoshi moves, you&#39;ll be among the first to know.
            </p>
            <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-left mb-8">
              <div className="text-xs text-white/30 uppercase tracking-wider mb-3">What happens next</div>
              <ul className="space-y-2 text-sm text-white/50">
                <li>· We monitor every Bitcoin block for Patoshi wallet activity</li>
                <li>· If any address moves, you get an email within minutes</li>
                <li>· You can adjust your preferences or unsubscribe any time</li>
              </ul>
            </div>
            <a
              href="/"
              className="inline-block bg-bitcoin hover:bg-bitcoin-dark text-black font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              ← Back to dashboard
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-3 text-red-400">Something went wrong</h1>
            <p className="text-white/50 text-sm mb-6">{message}</p>
            <a
              href="/"
              className="inline-block border border-white/10 hover:border-bitcoin/40 text-white/60 hover:text-white px-6 py-3 rounded-lg transition-colors text-sm"
            >
              ← Try again
            </a>
          </>
        )}
      </div>
    </main>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading...</div>
      </main>
    }>
      <ConfirmContent />
    </Suspense>
  )
}

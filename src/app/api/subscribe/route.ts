import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, threshold } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailLower)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Convert threshold string to satoshis
    const thresholdSats = threshold === 'any' ? 0 : parseInt(threshold, 10)

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('subscribers')
      .select('id, confirmed')
      .eq('email', emailLower)
      .single()

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 409 }
        )
      }
      // Not confirmed yet — resend confirmation
      const { data: sub } = await supabaseAdmin
        .from('subscribers')
        .select('confirmation_token')
        .eq('email', emailLower)
        .single()

      if (sub?.confirmation_token) {
        await sendConfirmationEmail(emailLower, sub.confirmation_token)
      }
      return NextResponse.json({ message: 'Confirmation email resent.' })
    }

    // Insert new subscriber
    const { data: newSub, error: insertError } = await supabaseAdmin
      .from('subscribers')
      .insert({ email: emailLower, threshold_sats: thresholdSats })
      .select('confirmation_token')
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
    }

    // Send confirmation email
    await sendConfirmationEmail(emailLower, newSub.confirmation_token)

    return NextResponse.json({ message: 'Check your email to confirm your subscription.' })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Unexpected error. Please try again.' }, { status: 500 })
  }
}

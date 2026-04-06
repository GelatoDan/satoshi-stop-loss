import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing confirmation token.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq('confirmation_token', token)
      .eq('confirmed', false)
      .select('id')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid or already-used confirmation link.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Email confirmed. Your alert is now active.' })
  } catch (err) {
    console.error('Confirm error:', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

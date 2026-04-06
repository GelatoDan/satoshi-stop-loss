import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing unsubscribe token.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .delete()
      .eq('unsubscribe_token', token)
      .select('id')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe link. You may already be unsubscribed.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Unsubscribed successfully.' })
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}

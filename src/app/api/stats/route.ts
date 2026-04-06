import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    // Fetch all stats in one query
    const { data: statsRows } = await supabase
      .from('stats')
      .select('key, value')

    const statsMap: Record<string, string> = {}
    for (const row of statsRows || []) {
      statsMap[row.key] = row.value
    }

    // Fetch confirmed subscriber count
    const { count: subscriberCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('confirmed', true)

    return NextResponse.json({
      totalBtc: Number(statsMap.total_btc_estimate || 1100000).toLocaleString(),
      addressCount: statsMap.address_count || '0',
      lastMovement: statsMap.last_movement || 'Never confirmed',
      lastTxid: statsMap.last_txid || null,
      subscriberCount: subscriberCount || 0,
    })
  } catch (err) {
    console.error('Stats error:', err)
    // Return safe defaults on error
    return NextResponse.json({
      totalBtc: '1,100,000',
      addressCount: '22,000+',
      lastMovement: 'Never confirmed',
      lastTxid: null,
      subscriberCount: 0,
    })
  }
}

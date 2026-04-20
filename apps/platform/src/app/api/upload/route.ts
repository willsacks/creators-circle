import { NextResponse } from 'next/server'

// File uploads require cloud storage (e.g. Supabase Storage) — not yet implemented.
export async function POST() {
  return NextResponse.json({ error: 'File uploads not yet configured' }, { status: 501 })
}

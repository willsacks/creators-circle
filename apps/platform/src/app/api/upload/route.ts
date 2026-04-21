export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime',
]

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  if (file.size > 52428800) {
    return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const filename = `${session.user.id}/${Date.now()}.${ext}`
  const bytes = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('media')
    .upload(filename, bytes, { contentType: file.type, upsert: false })

  if (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filename)

  return NextResponse.json({ url: publicUrl })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  let processedBuffer = buffer
  try {
    const sharp = (await import('sharp')).default
    processedBuffer = await sharp(buffer)
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()
  } catch {
    // sharp not available — use original
  }

  const ext = processedBuffer === buffer ? file.name.split('.').pop() : 'webp'
  const filename = `${uuidv4()}.${ext}`
  const dir = join(process.cwd(), 'public', 'uploads', session.user.id)

  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), processedBuffer)

  return NextResponse.json({ url: `/uploads/${session.user.id}/${filename}` })
}

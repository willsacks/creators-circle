'use client'

import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Film } from 'lucide-react'
import { toast } from 'sonner'

interface MediaUploadProps {
  value?: string
  onChange: (url: string) => void
  accept?: 'image' | 'video' | 'both'
  label?: string
}

export function MediaUpload({ value, onChange, accept = 'image', label }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptAttr =
    accept === 'image' ? 'image/jpeg,image/png,image/webp,image/avif,image/gif'
    : accept === 'video' ? 'video/mp4,video/webm,video/quicktime'
    : 'image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime'

  const isVideo = value && (value.includes('.mp4') || value.includes('.webm') || value.includes('.mov'))

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onChange(data.url)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          {isVideo ? (
            <video src={value} className="w-full max-h-48 object-cover" controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Upload preview" className="w-full max-h-48 object-cover" />
          )}
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-cc-gold/50 hover:bg-cc-gold/5 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-cc-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2 text-muted-foreground">
                {accept !== 'video' && <ImageIcon size={20} />}
                {accept !== 'image' && <Film size={20} />}
                {accept === 'image' && <ImageIcon size={20} />}
              </div>
              <p className="text-sm font-medium">Drop file or click to upload</p>
              <p className="text-xs text-muted-foreground">
                {accept === 'image' ? 'JPG, PNG, WebP, GIF up to 50MB'
                  : accept === 'video' ? 'MP4, WebM, MOV up to 50MB'
                  : 'Images and videos up to 50MB'}
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}

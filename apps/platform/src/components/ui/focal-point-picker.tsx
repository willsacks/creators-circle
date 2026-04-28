'use client'

import { useRef } from 'react'

interface FocalPointPickerProps {
  imageUrl: string
  focalX: number
  focalY: number
  onChange: (x: number, y: number) => void
}

export function FocalPointPicker({ imageUrl, focalX, focalY, onChange }: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  function handleClick(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)))
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)))
    onChange(x, y)
  }

  return (
    <div className="mt-2">
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative cursor-crosshair rounded-lg overflow-hidden select-none"
        style={{ height: '140px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: `${focalX}% ${focalY}%` }}
        />
        {/* crosshair lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ left: `${focalX}%` }}>
          <div className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: 0 }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ top: `${focalY}%` }}>
          <div className="absolute left-0 right-0 h-px bg-white/40" style={{ top: 0 }} />
        </div>
        {/* focal dot */}
        <div
          className="absolute pointer-events-none"
          style={{ left: `${focalX}%`, top: `${focalY}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-5 h-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] bg-white/20" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">Click image to set focal point</p>
        <button
          type="button"
          onClick={() => onChange(50, 50)}
          className="text-xs text-cc-gold hover:underline"
        >
          Reset to center
        </button>
      </div>
    </div>
  )
}

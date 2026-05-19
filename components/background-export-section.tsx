'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { CardStyle } from './workout-card'

interface BackgroundExportSectionProps {
  style: CardStyle
  onStyleChange: (style: Partial<CardStyle>) => void
  selectedFormat: string
  onFormatChange: (format: string) => void
  onExport: () => void
}

const gradientPresets = [
  { from: '#10b981', to: '#06b6d4', label: 'Sport' },
  { from: '#f59e0b', to: '#ef4444', label: 'Fire' },
  { from: '#6366f1', to: '#ec4899', label: 'Dusk' },
  { from: '#0ea5e9', to: '#3b82f6', label: 'Ocean' },
  { from: '#14b8a6', to: '#10b981', label: 'Forest' },
  { from: '#f97316', to: '#facc15', label: 'Sunset' },
]

const solidColors = [
  '#0d0d0f',
  '#111318',
  '#1a1a2e',
  '#16213e',
  '#ffffff',
  '#f8fafc',
]

const exportFormats = [
  { id: 'story', label: 'Story', sub: '9:16', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="7" y="2" width="10" height="20" rx="2" />
    </svg>
  )},
  { id: 'square', label: 'Square', sub: '1:1', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )},
  { id: 'portrait', label: 'Portrait', sub: '4:5', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="5" y="2" width="14" height="20" rx="2" />
    </svg>
  )},
]

export function BackgroundExportSection({
  style,
  onStyleChange,
  selectedFormat,
  onFormatChange,
  onExport,
}: BackgroundExportSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bgMode, setBgMode] = useState<'gradient' | 'solid' | 'image'>('gradient')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onStyleChange({ bgImage: url, useGradient: false })
    setBgMode('image')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Background */}
      <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-4">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Background</h3>

        {/* Mode tabs */}
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          {(['gradient', 'solid', 'image'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setBgMode(mode)
                if (mode === 'gradient') {
                  onStyleChange({ bgImage: null, useGradient: true })
                } else if (mode === 'solid') {
                  onStyleChange({ bgImage: null, useGradient: false })
                }
              }}
              className={cn(
                'flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all',
                bgMode === mode
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Gradient presets */}
        {bgMode === 'gradient' && (
          <div className="grid grid-cols-6 gap-2">
            {gradientPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() =>
                  onStyleChange({
                    bgGradientFrom: preset.from,
                    bgGradientTo: preset.to,
                    useGradient: true,
                    bgImage: null,
                  })
                }
                className={cn(
                  'w-full aspect-square rounded-xl border-2 transition-all',
                  style.bgGradientFrom === preset.from && style.bgGradientTo === preset.to
                    ? 'border-primary scale-110'
                    : 'border-transparent hover:scale-105'
                )}
                style={{ background: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
                aria-label={preset.label}
                title={preset.label}
              />
            ))}
          </div>
        )}

        {/* Solid colors */}
        {bgMode === 'solid' && (
          <div className="grid grid-cols-6 gap-2">
            {solidColors.map((color) => (
              <button
                key={color}
                onClick={() =>
                  onStyleChange({ bgColor: color, useGradient: false, bgImage: null })
                }
                className={cn(
                  'w-full aspect-square rounded-xl border-2 transition-all',
                  style.bgColor === color && !style.useGradient && !style.bgImage
                    ? 'border-primary scale-110'
                    : 'border-border hover:scale-105'
                )}
                style={{ backgroundColor: color }}
                aria-label={color}
                title={color}
              />
            ))}
            {/* Custom color input */}
            <label className="w-full aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-muted-foreground">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <input
                type="color"
                className="sr-only"
                onChange={(e) =>
                  onStyleChange({ bgColor: e.target.value, useGradient: false, bgImage: null })
                }
              />
            </label>
          </div>
        )}

        {/* Image upload */}
        {bgMode === 'image' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'w-full py-8 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 transition-all',
                style.bgImage
                  ? 'border-primary/60 bg-primary/5'
                  : 'border-border hover:border-primary/40 hover:bg-secondary'
              )}
            >
              {style.bgImage ? (
                <>
                  <div
                    className="w-12 h-12 rounded-xl bg-cover bg-center border border-border"
                    style={{ backgroundImage: `url(${style.bgImage})` }}
                  />
                  <span className="text-xs text-primary font-medium">Tap to change</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-muted-foreground">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm text-muted-foreground font-medium">Upload photo</span>
                  <span className="text-xs text-muted-foreground/60">PNG, JPG up to 10MB</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Export */}
      <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-4">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Export Format</h3>

        {/* Format selector */}
        <div className="flex gap-3">
          {exportFormats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => onFormatChange(fmt.id)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all text-xs font-semibold',
                selectedFormat === fmt.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              <span className={selectedFormat === fmt.id ? 'text-primary' : 'text-muted-foreground'}>
                {fmt.icon}
              </span>
              <span>{fmt.label}</span>
              <span className={cn('text-[10px]', selectedFormat === fmt.id ? 'text-primary/70' : 'text-muted-foreground/60')}>
                {fmt.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Export button */}
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export PNG
        </button>
      </div>
    </div>
  )
}

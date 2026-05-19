'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { WorkoutCard, layouts, type WorkoutData, type CardStyle, type CardLayout, type CardTemplate } from './workout-card'
import { cn } from '@/lib/utils'

interface FullscreenPreviewProps {
  isOpen: boolean
  onClose: () => void
  data: WorkoutData
  style: CardStyle
  onStyleChange: (style: Partial<CardStyle>) => void
  aspectRatio: '9:16' | '1:1' | '4:5'
}

const templates: { id: CardTemplate; label: string }[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'white', label: 'Light' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'story', label: 'Story' },
]

export function FullscreenPreview({ isOpen, onClose, data, style, onStyleChange, aspectRatio }: FullscreenPreviewProps) {
  const [mode, setMode] = useState<'layouts' | 'templates'>('layouts')
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: layouts.findIndex(l => l.id === style.layout) })
  const [templateEmblaRef, templateEmblaApi] = useEmblaCarousel({ loop: true, startIndex: templates.findIndex(t => t.id === style.template) })
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Sync carousel with current layout/template
  useEffect(() => {
    if (mode === 'layouts' && emblaApi) {
      const idx = layouts.findIndex(l => l.id === style.layout)
      if (idx !== -1) emblaApi.scrollTo(idx, true)
    } else if (mode === 'templates' && templateEmblaApi) {
      const idx = templates.findIndex(t => t.id === style.template)
      if (idx !== -1) templateEmblaApi.scrollTo(idx, true)
    }
  }, [mode, emblaApi, templateEmblaApi, style.layout, style.template])

  const onSelect = useCallback(() => {
    if (mode === 'layouts' && emblaApi) {
      const idx = emblaApi.selectedScrollSnap()
      setSelectedIndex(idx)
      onStyleChange({ layout: layouts[idx].id })
    } else if (mode === 'templates' && templateEmblaApi) {
      const idx = templateEmblaApi.selectedScrollSnap()
      setSelectedIndex(idx)
      const tpl = templates[idx]
      onStyleChange({ 
        template: tpl.id,
        useGradient: tpl.id === 'gradient',
        bgGradientFrom: tpl.id === 'gradient' ? '#10b981' : '#0d0d0f',
        bgGradientTo: tpl.id === 'gradient' ? '#06b6d4' : '#0d0d0f',
      })
    }
  }, [emblaApi, templateEmblaApi, mode, onStyleChange])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect)
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    return () => {
      if (emblaApi) emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (templateEmblaApi) {
      templateEmblaApi.on('select', onSelect)
    }
    return () => {
      if (templateEmblaApi) templateEmblaApi.off('select', onSelect)
    }
  }, [templateEmblaApi, onSelect])

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Reset selected index when mode changes
  useEffect(() => {
    if (mode === 'layouts') {
      setSelectedIndex(layouts.findIndex(l => l.id === style.layout))
    } else {
      setSelectedIndex(templates.findIndex(t => t.id === style.template))
    }
  }, [mode, style.layout, style.template])

  if (!isOpen) return null

  const items = mode === 'layouts' ? layouts : templates

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
          <button
            onClick={() => setMode('layouts')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              mode === 'layouts' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Layouts
          </button>
          <button
            onClick={() => setMode('templates')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              mode === 'templates' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Styles
          </button>
        </div>

        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      {/* Carousel */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-4">
        {mode === 'layouts' ? (
          <div ref={emblaRef} className="w-full max-w-sm overflow-hidden">
            <div className="flex">
              {layouts.map((layout) => (
                <div key={layout.id} className="flex-[0_0_100%] min-w-0 px-2">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[280px]">
                      <WorkoutCard
                        data={data}
                        style={{ ...style, layout: layout.id }}
                        aspectRatio={aspectRatio}
                        scale="full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div ref={templateEmblaRef} className="w-full max-w-sm overflow-hidden">
            <div className="flex">
              {templates.map((tpl) => (
                <div key={tpl.id} className="flex-[0_0_100%] min-w-0 px-2">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[280px]">
                      <WorkoutCard
                        data={data}
                        style={{
                          ...style,
                          template: tpl.id,
                          useGradient: tpl.id === 'gradient',
                          bgGradientFrom: tpl.id === 'gradient' ? '#10b981' : '#0d0d0f',
                          bgGradientTo: tpl.id === 'gradient' ? '#06b6d4' : '#0d0d0f',
                        }}
                        aspectRatio={aspectRatio}
                        scale="full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dots indicator */}
        <div className="flex items-center gap-2 mt-6">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (mode === 'layouts' && emblaApi) emblaApi.scrollTo(idx)
                else if (mode === 'templates' && templateEmblaApi) templateEmblaApi.scrollTo(idx)
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                idx === selectedIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Go to ${mode === 'layouts' ? 'layout' : 'template'} ${idx + 1}`}
            />
          ))}
        </div>

        {/* Label */}
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-foreground">
            {mode === 'layouts' ? layouts[selectedIndex]?.label : templates[selectedIndex]?.label}
          </p>
          {mode === 'layouts' && (
            <p className="text-sm text-muted-foreground mt-1">
              {layouts[selectedIndex]?.description}
            </p>
          )}
        </div>
      </div>

      {/* Swipe hint */}
      <div className="pb-8 pt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14M12 5l-7 7 7 7" />
          </svg>
          <span className="text-xs font-medium">Swipe to browse</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

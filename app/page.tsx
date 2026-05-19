'use client'

import { useState, useCallback } from 'react'
import { WorkoutCard } from '@/components/workout-card'
import { EditorSection } from '@/components/editor-section'
import { BackgroundExportSection } from '@/components/background-export-section'
import { BottomNav } from '@/components/bottom-nav'
import { HistorySection } from '@/components/history-section'
import { FullscreenPreview } from '@/components/fullscreen-preview'
import type { WorkoutData, CardStyle, CardLayout } from '@/components/workout-card'
import type { NavTab } from '@/components/bottom-nav'
import { cn } from '@/lib/utils'

const defaultData: WorkoutData = {
  title: 'Morning Run',
  distance: '10.2',
  duration: '52:14',
  pace: '5:07/km',
  calories: '742',
  date: 'Sep 12',
  activityType: 'Run',
}

const defaultStyle: CardStyle = {
  template: 'dark',
  layout: 'classic',
  bgColor: '#0d0d0f',
  bgGradientFrom: '#10b981',
  bgGradientTo: '#06b6d4',
  useGradient: false,
  bgImage: null,
}

const formatToAspect: Record<string, '9:16' | '1:1' | '4:5'> = {
  story: '9:16',
  square: '1:1',
  portrait: '4:5',
}

export default function Home() {
  const [data, setData] = useState<WorkoutData>(defaultData)
  const [style, setStyle] = useState<CardStyle>(defaultStyle)
  const [activeTab, setActiveTab] = useState<NavTab>('create')
  const [selectedFormat, setSelectedFormat] = useState('portrait')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDataChange = useCallback((partial: Partial<WorkoutData>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }, [])

  const handleStyleChange = useCallback((partial: Partial<CardStyle>) => {
    setStyle((prev) => ({ ...prev, ...partial }))
  }, [])

  const handleExport = useCallback(() => {
    window.alert('Export ready! In production, this would use html2canvas to generate a PNG.')
  }, [])

  return (
    <main className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-sm mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary-foreground">
                <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0M7.5 19l2-6.5 2.5 2 2-3.5 3 4" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">Pace</span>
          </div>
          <button className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </button>
        </div>
      </header>

      <div className="max-w-sm mx-auto px-4 pt-5">
        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <div className="flex flex-col gap-6">
            {/* Mini Card Preview */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Preview</h2>
                <div className="flex items-center gap-1">
                  {(['portrait', 'square', 'story'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide capitalize transition-all',
                        selectedFormat === fmt
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tappable mini preview */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="w-full relative group"
              >
                <div className="w-full max-w-[180px] mx-auto transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
                  <WorkoutCard
                    data={data}
                    style={style}
                    aspectRatio={formatToAspect[selectedFormat]}
                    scale="mini"
                  />
                </div>
                
                {/* Expand hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-3xl">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    <span className="text-xs font-semibold text-white">Tap to expand</span>
                  </div>
                </div>
              </button>

              {/* Quick action button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-xs font-semibold"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                Browse Layouts & Styles
              </button>
            </section>

            {/* Editor */}
            <EditorSection
              data={data}
              style={style}
              onDataChange={handleDataChange}
              onStyleChange={handleStyleChange}
            />

            {/* Background & Export */}
            <BackgroundExportSection
              style={style}
              onStyleChange={handleStyleChange}
              selectedFormat={selectedFormat}
              onFormatChange={setSelectedFormat}
              onExport={handleExport}
            />
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Browse All</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore layouts and styles for your card.
              </p>
            </div>

            {/* Quick open fullscreen */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              Open Fullscreen Browser
            </button>

            {/* Grid preview of layouts */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Layouts</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['classic', 'hero-center', 'minimal', 'photo-focus', 'corner-badge', 'bottom-strip', 'split-diagonal', 'floating-stats'] as const).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => {
                      handleStyleChange({ layout })
                      setActiveTab('create')
                    }}
                    className={cn(
                      'flex flex-col gap-2 p-2 rounded-2xl border transition-all hover:border-primary/50 active:scale-[0.98]',
                      style.layout === layout ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    )}
                  >
                    <div className="w-full">
                      <WorkoutCard
                        data={data}
                        style={{ ...style, layout }}
                        aspectRatio="4:5"
                        scale="mini"
                      />
                    </div>
                    <p className={cn('text-[10px] font-semibold capitalize leading-tight', style.layout === layout ? 'text-primary' : 'text-foreground')}>
                      {layout.replace(/-/g, ' ')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid preview of styles */}
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Styles</h3>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { template: 'dark' as const, label: 'Dark', gradient: false },
                  { template: 'white' as const, label: 'Light', gradient: false },
                  { template: 'gradient' as const, label: 'Gradient', gradient: true },
                  { template: 'story' as const, label: 'Story', gradient: false },
                ]).map((tpl) => (
                  <button
                    key={tpl.template}
                    onClick={() => {
                      handleStyleChange({
                        template: tpl.template,
                        useGradient: tpl.gradient,
                        bgGradientFrom: tpl.gradient ? '#10b981' : '#0d0d0f',
                        bgGradientTo: tpl.gradient ? '#06b6d4' : '#0d0d0f',
                      })
                      setActiveTab('create')
                    }}
                    className={cn(
                      'flex flex-col gap-2 p-2 rounded-2xl border transition-all hover:border-primary/50 active:scale-[0.98]',
                      style.template === tpl.template ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    )}
                  >
                    <div className="w-full">
                      <WorkoutCard
                        data={data}
                        style={{
                          ...style,
                          template: tpl.template,
                          useGradient: tpl.gradient,
                          bgGradientFrom: tpl.gradient ? '#10b981' : '#0d0d0f',
                          bgGradientTo: tpl.gradient ? '#06b6d4' : '#0d0d0f',
                        }}
                        aspectRatio="4:5"
                        scale="mini"
                      />
                    </div>
                    <p className={cn('text-xs font-semibold', style.template === tpl.template ? 'text-primary' : 'text-foreground')}>
                      {tpl.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <HistorySection
            onSelect={(item) => {
              handleDataChange(item)
              setActiveTab('create')
            }}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Fullscreen Preview Modal */}
      <FullscreenPreview
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        data={data}
        style={style}
        onStyleChange={handleStyleChange}
        aspectRatio={formatToAspect[selectedFormat]}
      />
    </main>
  )
}

import { useEffect, useDeferredValue, useMemo, useRef, useState, type ComponentProps } from 'react'
import { Grid2x2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { layoutCatalog, templateCatalog } from '../data/templates'
import { exportElementAsImage } from '../lib/exportImage'
import { sanitizeFileName } from '../lib/formatters'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { WorkoutCardPreview } from '../components/card/WorkoutCardPreview'
import { BackgroundExportSection } from '../components/mobile/BackgroundExportSection'
import { BottomNav } from '../components/mobile/BottomNav'
import { EditorSection } from '../components/mobile/EditorSection'
import { FullscreenPreview } from '../components/mobile/FullscreenPreview'
import { HistorySection } from '../components/mobile/HistorySection'
import type { ExportSize, NavTab } from '../types/workout'

export function EditorPage() {
  const draft = useWorkoutStore((state) => state.draft)
  const setExportSize = useWorkoutStore((state) => state.setExportSize)
  const setNotice = useWorkoutStore((state) => state.setNotice)
  const previewRef = useRef<HTMLDivElement>(null)
  const previewDraft = useDeferredValue(draft)
  const [isExporting, setIsExporting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = useMemo<NavTab>(() => {
    const value = searchParams.get('tab')
    return value === 'templates' || value === 'history' ? value : 'create'
  }, [searchParams])
  const stylePreviewLayout = 'hero-center' as const
  const backgroundSectionKey =
    draft.background.type === 'image'
      ? `image:${draft.background.imageId ?? draft.background.value}`
      : `${draft.background.type}:${draft.background.value}`

  const handleExport = async () => {
    if (!previewRef.current || isExporting) {
      return
    }

    setIsExporting(true)

    try {
      await exportElementAsImage(previewRef.current, {
        fileName: sanitizeFileName(draft.workout.title),
        format: draft.imageFormat,
        scale: 3,
      })
      setNotice(`Exported ${draft.imageFormat.toUpperCase()} card.`)
    } catch {
      setNotice('Export failed. Try a simpler background or another format.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main
      className="min-h-screen bg-slate-950"
      style={{ paddingBottom: 'calc(var(--safe-area-bottom) + 112px)' }}
    >
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div
          className="mx-auto flex max-w-sm items-center justify-between px-4 py-3"
          style={{ paddingTop: 'calc(var(--safe-area-top) + 8px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
              <span className="text-sm font-black">P</span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">Pace</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] text-slate-400 transition hover:text-white"
            aria-label="Open fullscreen browser"
          >
            <Grid2x2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-sm px-4 pt-5">
        {activeTab === 'create' && (
          <div className="flex flex-col gap-6">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Preview</h2>
                <div className="flex items-center gap-1">
                  {(['portrait', 'square', 'story'] as const).map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => setExportSize(format)}
                      className={
                        draft.exportSize === format
                          ? 'rounded-lg bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold capitalize tracking-wide text-emerald-300'
                          : 'px-2.5 py-1 text-[10px] font-semibold capitalize tracking-wide text-slate-500 transition hover:text-white'
                      }
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => setIsFullscreen(true)} className="relative w-full group">
                <div className="mx-auto w-full max-w-[180px] transition-transform duration-200 group-hover:scale-[1.02] group-active:scale-[0.98]">
                  <div ref={previewRef}>
                    <WorkoutCardPreview
                      workout={previewDraft.workout}
                      templateId={previewDraft.templateId}
                      layoutId={previewDraft.layoutId}
                      background={previewDraft.background}
                      exportSize={previewDraft.exportSize}
                      compact
                    />
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-xl bg-black/60 px-3 py-2 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-white">Tap to expand</span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-xs font-semibold text-slate-400 transition hover:border-emerald-400/40 hover:text-white"
              >
                Browse Layouts & Styles
              </button>
            </section>

            <EditorSection />

            <BackgroundExportSection
              key={backgroundSectionKey}
              selectedFormat={draft.exportSize}
              onFormatChange={(format: ExportSize) => setExportSize(format)}
              onExport={handleExport}
              onOpenFullscreen={() => setIsFullscreen(true)}
            />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="mb-1 text-lg font-bold text-white">Browse All</h2>
              <p className="text-sm leading-relaxed text-slate-400">
                Explore layouts and styles for your card.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="w-full rounded-2xl bg-emerald-400 py-4 text-center font-semibold text-slate-950 transition hover:opacity-90 active:scale-[0.98]"
            >
              Open Fullscreen Browser
            </button>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Templates</h3>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {layoutCatalog.length} layouts
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {layoutCatalog.map((layout) => (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => {
                      useWorkoutStore.getState().setLayout(layout.id as typeof draft.layoutId)
                      setSearchParams({ tab: 'create' })
                    }}
                    className={
                      draft.layoutId === layout.id
                        ? 'flex flex-col gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-400/10 p-2 transition-all'
                        : 'flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 transition-all hover:border-emerald-400/40'
                    }
                  >
                    <ScaledPreviewCard
                      workout={draft.workout}
                      templateId={draft.templateId}
                      layoutId={layout.id}
                      background={draft.background}
                      exportSize="portrait"
                    />
                    <div className="px-1 text-left">
                      <p className={draft.layoutId === layout.id ? 'text-[10px] font-semibold text-emerald-300' : 'text-[10px] font-semibold text-white'}>
                        {layout.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Styles</h3>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {templateCatalog.length} themes
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {templateCatalog.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      useWorkoutStore.getState().setTemplate(template.id as typeof draft.templateId)
                      setSearchParams({ tab: 'create' })
                    }}
                    className={
                      draft.templateId === template.id
                        ? 'flex flex-col gap-2 rounded-2xl border border-emerald-400/35 bg-emerald-400/10 p-2 transition-all'
                        : 'flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 transition-all hover:border-emerald-400/40'
                    }
                  >
                    <ScaledPreviewCard
                      workout={draft.workout}
                      templateId={template.id}
                      layoutId={stylePreviewLayout}
                      background={template.defaultBackground}
                      exportSize="square"
                    />
                    <div className="space-y-1 px-1 text-left">
                      <p className={draft.templateId === template.id ? 'text-xs font-semibold text-emerald-300' : 'text-xs font-semibold text-white'}>
                        {template.label}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        {template.eyebrow}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'history' && <HistorySection onSelect={() => setSearchParams({ tab: 'create' })} />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={(tab) => setSearchParams({ tab })} />

      <FullscreenPreview
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        exportSize={draft.exportSize}
      />
    </main>
  )
}

function ScaledPreviewCard({
  workout,
  templateId,
  layoutId,
  background,
  exportSize,
}: {
  workout: ComponentProps<typeof WorkoutCardPreview>['workout']
  templateId: ComponentProps<typeof WorkoutCardPreview>['templateId']
  layoutId: ComponentProps<typeof WorkoutCardPreview>['layoutId']
  background: ComponentProps<typeof WorkoutCardPreview>['background']
  exportSize: ComponentProps<typeof WorkoutCardPreview>['exportSize']
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const baseWidth = exportSize === 'square' ? 220 : 240
  const scale = frameWidth > 0 ? frameWidth / baseWidth : 1

  useEffect(() => {
    const node = frameRef.current
    if (!node) {
      return
    }

    const updateWidth = () => {
      setFrameWidth(node.clientWidth)
    }

    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={frameRef}
      className={exportSize === 'square'
        ? 'relative aspect-square overflow-hidden rounded-[18px] border border-white/8 bg-slate-950/35'
        : 'relative aspect-[4/5] overflow-hidden rounded-[18px] border border-white/8 bg-slate-950/35'}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${baseWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <WorkoutCardPreview
          workout={workout}
          templateId={templateId}
          layoutId={layoutId}
          background={background}
          exportSize={exportSize}
        />
      </div>
    </div>
  )
}

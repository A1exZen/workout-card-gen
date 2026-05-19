import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { layoutCatalog, templateCatalog } from '../../data/templates'
import { useWorkoutStore } from '../../store/useWorkoutStore'
import type { ExportSize } from '../../types/workout'
import { WorkoutCardPreview } from '../card/WorkoutCardPreview'

type FullscreenPreviewProps = {
  isOpen: boolean
  onClose: () => void
  exportSize: ExportSize
}

export function FullscreenPreview({ isOpen, onClose, exportSize }: FullscreenPreviewProps) {
  const draft = useWorkoutStore((state) => state.draft)
  const setLayout = useWorkoutStore((state) => state.setLayout)
  const setTemplate = useWorkoutStore((state) => state.setTemplate)
  const [mode, setMode] = useState<'layouts' | 'templates'>('layouts')
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const selectedIndex = useMemo(() => {
    if (mode === 'layouts') {
      return layoutCatalog.findIndex((layout) => layout.id === draft.layoutId)
    }

    return templateCatalog.findIndex((template) => template.id === draft.templateId)
  }, [draft.layoutId, draft.templateId, mode])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !scrollerRef.current) {
      return
    }

    const active = scrollerRef.current.children[selectedIndex] as HTMLElement | undefined
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [isOpen, mode, selectedIndex])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950">
      <header
        className="flex items-center justify-between border-b border-white/10 px-4 py-3"
        style={{ paddingTop: 'calc(var(--safe-area-top) + 12px)' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center gap-1 rounded-xl bg-white/[0.04] p-1">
          <button
            type="button"
            onClick={() => setMode('layouts')}
            className={
              mode === 'layouts'
                ? 'rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950'
                : 'px-3 py-1.5 text-xs font-semibold text-slate-400'
            }
          >
            Layouts
          </button>
          <button
            type="button"
            onClick={() => setMode('templates')}
            className={
              mode === 'templates'
                ? 'rounded-lg bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950'
                : 'px-3 py-1.5 text-xs font-semibold text-slate-400'
            }
          >
            Styles
          </button>
        </div>

        <div className="w-16" />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
        <div
          ref={scrollerRef}
          className="flex w-full max-w-sm snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
        >
          {mode === 'layouts' &&
            layoutCatalog.map((layout) => (
              <div key={layout.id} className="min-w-0 flex-[0_0_100%] snap-center px-2">
                <button type="button" onClick={() => setLayout(layout.id)} className="w-full">
                  <WorkoutCardPreview
                    workout={draft.workout}
                    templateId={draft.templateId}
                    layoutId={layout.id}
                    background={draft.background}
                    exportSize={exportSize}
                  />
                </button>
              </div>
            ))}
          {mode === 'templates' &&
            templateCatalog.map((template) => (
              <div key={template.id} className="min-w-0 flex-[0_0_100%] snap-center px-2">
                <button type="button" onClick={() => setTemplate(template.id)} className="w-full">
                  <WorkoutCardPreview
                    workout={draft.workout}
                    templateId={template.id}
                    layoutId={draft.layoutId}
                    background={template.defaultBackground}
                    exportSize={exportSize}
                  />
                </button>
              </div>
            ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          {mode === 'layouts' &&
            layoutCatalog.map((layout, index) => (
              <button
                key={layout.id}
                type="button"
                onClick={() => {
                  const target = scrollerRef.current?.children[index] as HTMLElement | undefined
                  target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                  setLayout(layout.id)
                }}
                className={
                  index === selectedIndex
                    ? 'h-2 w-6 rounded-full bg-emerald-400 transition-all'
                    : 'h-2 w-2 rounded-full bg-slate-600 transition-all'
                }
                aria-label={`Go to ${layout.label}`}
              />
            ))}
          {mode === 'templates' &&
            templateCatalog.map((template, index) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  const target = scrollerRef.current?.children[index] as HTMLElement | undefined
                  target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                  setTemplate(template.id)
                }}
                className={
                  index === selectedIndex
                    ? 'h-2 w-6 rounded-full bg-emerald-400 transition-all'
                    : 'h-2 w-2 rounded-full bg-slate-600 transition-all'
                }
                aria-label={`Go to ${template.label}`}
              />
            ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-white">
            {mode === 'layouts'
              ? layoutCatalog[selectedIndex]?.label
              : templateCatalog[selectedIndex]?.label}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {mode === 'layouts'
              ? layoutCatalog[selectedIndex]?.description
              : templateCatalog[selectedIndex]?.description}
          </p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Tap preview to apply
          </p>
        </div>
      </div>

      <div
        className="flex flex-col items-center gap-2 pt-4"
        style={{ paddingBottom: 'calc(var(--safe-area-bottom) + 24px)' }}
      >
        <div className="flex items-center gap-2 text-slate-400">
          <ChevronLeft className="h-4 w-4" />
          <span className="text-xs font-medium">Swipe to browse</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

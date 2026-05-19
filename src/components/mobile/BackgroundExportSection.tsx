import { ImageUp, Maximize2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { gradientBackgrounds, solidBackgrounds } from '../../data/templates'
import { MAX_UPLOAD_SIZE_BYTES } from '../../lib/formatters'
import { saveImageFile } from '../../lib/imageStore'
import { useWorkoutStore } from '../../store/useWorkoutStore'
import type { ExportSize } from '../../types/workout'

type BackgroundExportSectionProps = {
  selectedFormat: ExportSize
  onFormatChange: (format: ExportSize) => void
  onExport: () => void
  onOpenFullscreen: () => void
}

const exportFormats: Array<{ id: ExportSize; label: string; sub: string }> = [
  { id: 'story', label: 'Story', sub: '9:16' },
  { id: 'square', label: 'Square', sub: '1:1' },
  { id: 'portrait', label: 'Portrait', sub: '4:5' },
]

export function BackgroundExportSection({
  selectedFormat,
  onFormatChange,
  onExport,
  onOpenFullscreen,
}: BackgroundExportSectionProps) {
  const background = useWorkoutStore((state) => state.draft.background)
  const imageFormat = useWorkoutStore((state) => state.draft.imageFormat)
  const setBackground = useWorkoutStore((state) => state.setBackground)
  const setImageFormat = useWorkoutStore((state) => state.setImageFormat)
  const setNotice = useWorkoutStore((state) => state.setNotice)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [bgMode, setBgMode] = useState<'gradient' | 'solid' | 'image'>(
    background.type === 'gradient' ? 'gradient' : background.type === 'image' ? 'image' : 'solid',
  )
  const bgImage = background.type === 'image' ? background.value : null

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setNotice('Upload a PNG, JPG, or another image file.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setNotice('Image should be under 10MB.')
      event.target.value = ''
      return
    }

    setIsUploading(true)

    try {
      const { imageId, previewUrl } = await saveImageFile(file)
      setBackground({ type: 'image', value: previewUrl, imageId })
      setBgMode('image')
      setNotice('Photo background applied.')
    } catch {
      setNotice('Could not save this image. Try a smaller file.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const gradientPresets = useMemo(() => gradientBackgrounds.slice(0, 6), [])

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Background</h3>

        <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1">
          {(['gradient', 'solid', 'image'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setBgMode(mode)}
              className={
                bgMode === mode
                  ? 'flex-1 rounded-lg bg-white/[0.08] py-1.5 text-xs font-semibold capitalize text-white shadow-sm'
                  : 'flex-1 py-1.5 text-xs font-semibold capitalize text-slate-400 transition hover:text-white'
              }
            >
              {mode}
            </button>
          ))}
        </div>

        {bgMode === 'gradient' && (
          <div className="grid grid-cols-6 gap-2">
            {gradientPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setBackground(preset)}
                className={
                  background.value === preset.value
                    ? 'aspect-square rounded-xl border-2 border-emerald-400 transition-all'
                    : 'aspect-square rounded-xl border-2 border-transparent transition-all hover:scale-105'
                }
                style={{ backgroundImage: preset.value }}
                aria-label={preset.value}
              />
            ))}
          </div>
        )}

        {bgMode === 'solid' && (
          <div className="grid grid-cols-6 gap-2">
            {solidBackgrounds.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setBackground(color)}
                className={
                  background.value === color.value && background.type === 'color'
                    ? 'aspect-square rounded-xl border-2 border-emerald-400 transition-all'
                    : 'aspect-square rounded-xl border-2 border-white/10 transition-all hover:scale-105'
                }
                style={{ backgroundColor: color.value }}
                aria-label={color.value}
              />
            ))}
          </div>
        )}

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
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-white/10 py-8 transition-all hover:border-emerald-400/40 hover:bg-white/[0.03] disabled:cursor-wait disabled:opacity-70"
            >
              {bgImage ? (
                <>
                  <div
                    className="h-12 w-12 rounded-xl border border-white/10 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgImage})` }}
                  />
                  <span className="text-xs font-medium text-emerald-300">{isUploading ? 'Saving...' : 'Tap to change'}</span>
                </>
              ) : (
                <>
                  <ImageUp className="h-6 w-6 text-slate-400" />
                  <span className="text-sm font-medium text-slate-400">{isUploading ? 'Saving photo...' : 'Upload photo'}</span>
                  <span className="text-xs text-slate-500">PNG, JPG up to 10MB</span>
                </>
              )}
            </button>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Export Format</h3>

        <div className="flex gap-3">
          {exportFormats.map((format) => (
            <button
              key={format.id}
              type="button"
              onClick={() => onFormatChange(format.id)}
              className={
                selectedFormat === format.id
                  ? 'flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-emerald-400/35 bg-emerald-400/10 py-3 text-xs font-semibold text-emerald-300'
                  : 'flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-xs font-semibold text-slate-400 transition hover:border-emerald-400/40 hover:text-white'
              }
            >
              <span>{format.label}</span>
              <span className="text-[10px] opacity-75">{format.sub}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(['png', 'jpg'] as const).map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => setImageFormat(format)}
              className={
                imageFormat === format
                  ? 'flex-1 rounded-xl border border-emerald-400/35 bg-emerald-400/10 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-300'
                  : 'flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition hover:text-white'
              }
            >
              {format}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onExport}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-400 py-4 text-sm font-bold tracking-wide text-slate-950 transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Export {imageFormat.toUpperCase()}
        </button>

        <button
          type="button"
          onClick={onOpenFullscreen}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/40 hover:text-white"
        >
          <Maximize2 className="h-4 w-4" />
          Browse Layouts & Styles
        </button>
      </section>
    </div>
  )
}

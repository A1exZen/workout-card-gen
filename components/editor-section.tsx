'use client'

import { cn } from '@/lib/utils'
import type { ActivityType, WorkoutData, CardTemplate, CardStyle, CardLayout } from './workout-card'
import { layouts } from './workout-card'

interface EditorSectionProps {
  data: WorkoutData
  style: CardStyle
  onDataChange: (data: Partial<WorkoutData>) => void
  onStyleChange: (style: Partial<CardStyle>) => void
}

const activities: ActivityType[] = ['Run', 'Ride', 'Walk']

const activityIcons: Record<ActivityType, JSX.Element> = {
  Run: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
      <path d="m7.5 19 2-6.5 2.5 2 2-3.5 3 4" />
      <path d="m4 15 3-1 1.5-3.5" />
    </svg>
  ),
  Ride: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="5" cy="17" r="3" />
      <circle cx="19" cy="17" r="3" />
      <path d="M12 5a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
      <path d="M5 17l4-8h4l4 8" />
      <path d="M9 9h4" />
    </svg>
  ),
  Walk: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="4" r="1" />
      <path d="m6.5 6.5 5 1 .5 5 3 3" />
      <path d="m7 15 2 5" />
      <path d="m14 14-2 6" />
    </svg>
  ),
}

const templates: { id: CardTemplate; label: string; preview: string }[] = [
  { id: 'dark', label: 'Dark', preview: 'bg-[#0d0d0f]' },
  { id: 'white', label: 'Light', preview: 'bg-white' },
  { id: 'gradient', label: 'Gradient', preview: 'bg-gradient-to-br from-emerald-500 to-cyan-600' },
  { id: 'story', label: 'Story', preview: 'bg-[#0d0d0f]' },
]

const templateGradients: Record<CardTemplate, { from: string; to: string }> = {
  dark: { from: '#0d0d0f', to: '#0d0d0f' },
  white: { from: '#ffffff', to: '#f8fafc' },
  gradient: { from: '#10b981', to: '#06b6d4' },
  story: { from: '#0d0d0f', to: '#111318' },
}

const layoutIcons: Record<CardLayout, JSX.Element> = {
  classic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12" />
    </svg>
  ),
  'hero-center': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 14h10" />
    </svg>
  ),
  'photo-focus': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15l5-5 4 4 5-5 4 4" />
      <rect x="4" y="16" width="16" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
    </svg>
  ),
  'corner-badge': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="4" y="14" width="10" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
    </svg>
  ),
  'bottom-strip': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="4" y="15" width="16" height="5" rx="1" fill="currentColor" fillOpacity="0.2" />
      <path d="M7 17.5h2M11 17.5h2M15 17.5h2" strokeWidth="1" />
    </svg>
  ),
  'split-diagonal': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 14l18-6" />
      <circle cx="7" cy="8" r="1.5" fill="currentColor" fillOpacity="0.3" />
    </svg>
  ),
  'floating-stats': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="5" y="5" width="6" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />
      <rect x="8" y="10" width="8" height="5" rx="1" fill="currentColor" fillOpacity="0.3" />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" fillOpacity="0.3" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" fillOpacity="0.3" />
      <circle cx="17" cy="17" r="1.5" fill="currentColor" fillOpacity="0.3" />
    </svg>
  ),
}

export function EditorSection({ data, style, onDataChange, onStyleChange }: EditorSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Activity Type */}
      <EditorCard title="Activity">
        <div className="flex gap-2">
          {activities.map((act) => (
            <button
              key={act}
              onClick={() => onDataChange({ activityType: act })}
              className={cn(
                'flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all duration-200 text-xs font-semibold tracking-wide',
                data.activityType === act
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              <span className={cn(data.activityType === act ? 'text-primary' : 'text-muted-foreground')}>
                {activityIcons[act]}
              </span>
              {act}
            </button>
          ))}
        </div>
      </EditorCard>

      {/* Workout Inputs */}
      <EditorCard title="Workout Details">
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Title" value={data.title} onChange={(v) => onDataChange({ title: v })} placeholder="Morning Run" colSpan />
          <InputField label="Distance" value={data.distance} onChange={(v) => onDataChange({ distance: v })} placeholder="10.2 km" />
          <InputField label="Duration" value={data.duration} onChange={(v) => onDataChange({ duration: v })} placeholder="52:14" />
          <InputField label="Avg Pace" value={data.pace} onChange={(v) => onDataChange({ pace: v })} placeholder="5:07/km" />
          <InputField label="Calories" value={data.calories} onChange={(v) => onDataChange({ calories: v })} placeholder="742" />
          <InputField label="Date" value={data.date} onChange={(v) => onDataChange({ date: v })} placeholder="Sep 12" />
        </div>
      </EditorCard>

      {/* Layout Selector */}
      <EditorCard title="Layout">
        <div className="grid grid-cols-4 gap-2">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onStyleChange({ layout: layout.id })}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200',
                style.layout === layout.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
              title={layout.description}
            >
              {layoutIcons[layout.id]}
              <span className="text-[9px] font-semibold tracking-wide leading-tight text-center">{layout.label}</span>
            </button>
          ))}
        </div>
      </EditorCard>

      {/* Template Selector */}
      <EditorCard title="Style">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                const grad = templateGradients[tpl.id]
                onStyleChange({
                  template: tpl.id,
                  bgGradientFrom: grad.from,
                  bgGradientTo: grad.to,
                  useGradient: tpl.id === 'gradient',
                })
              }}
              className="flex-shrink-0 flex flex-col gap-2 items-center"
              aria-label={tpl.label}
            >
              <div
                className={cn(
                  'w-14 h-20 rounded-2xl border-2 transition-all duration-200 shadow-md',
                  tpl.preview,
                  style.template === tpl.id
                    ? 'border-primary scale-105 shadow-primary/30'
                    : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                {tpl.id === 'story' && (
                  <div className="w-full h-full rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/30 to-cyan-500/20" />
                  </div>
                )}
              </div>
              <span className={cn('text-xs font-medium', style.template === tpl.id ? 'text-primary' : 'text-muted-foreground')}>
                {tpl.label}
              </span>
            </button>
          ))}
        </div>
      </EditorCard>
    </div>
  )
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  colSpan,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  colSpan?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', colSpan && 'col-span-2')}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-input border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
      />
    </div>
  )
}

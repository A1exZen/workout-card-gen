import { useEffect, useRef, type HTMLAttributes, type RefObject } from 'react'
import {
  Bike,
  LayoutGrid,
  Minus,
  PersonStanding,
  RectangleHorizontal,
  Rows3,
  Sparkles,
  SquareStack,
  Trophy,
} from 'lucide-react'
import { activityOptions, layoutCatalog, templateCatalog } from '../../data/templates'
import {
  clampNumber,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
  sanitizeTextInput,
} from '../../lib/formatters'
import { useWorkoutStore } from '../../store/useWorkoutStore'
import type { LayoutId } from '../../types/workout'

const layoutIcons: Record<LayoutId, typeof LayoutGrid> = {
  classic: LayoutGrid,
  'hero-center': Trophy,
  minimal: Minus,
  'photo-focus': SquareStack,
  'corner-badge': RectangleHorizontal,
  'bottom-strip': Rows3,
  'split-diagonal': Sparkles,
  'floating-stats': LayoutGrid,
}

const templateSwatches: Record<string, string> = {
  'dark-minimal': 'bg-[#0d0d0f]',
  'apple-fitness': 'bg-white',
  'gradient-sport': 'bg-gradient-to-br from-emerald-500 to-cyan-600',
  'story-mode': 'bg-[#0d0d0f]',
}

export function EditorSection() {
  const workout = useWorkoutStore((state) => state.draft.workout)
  const templateId = useWorkoutStore((state) => state.draft.templateId)
  const layoutId = useWorkoutStore((state) => state.draft.layoutId)
  const updateWorkout = useWorkoutStore((state) => state.updateWorkout)
  const setTemplate = useWorkoutStore((state) => state.setTemplate)
  const setLayout = useWorkoutStore((state) => state.setLayout)
  const distanceInputRef = useRef<HTMLInputElement>(null)
  const caloriesInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (distanceInputRef.current && document.activeElement !== distanceInputRef.current) {
      distanceInputRef.current.value = String(workout.distance)
    }
  }, [workout.distance])

  useEffect(() => {
    if (caloriesInputRef.current && document.activeElement !== caloriesInputRef.current) {
      caloriesInputRef.current.value = workout.calories ? String(workout.calories) : ''
    }
  }, [workout.calories])

  const handleDistanceChange = (value: string) => {
    const sanitized = sanitizeDecimalInput(value, { maxIntegerDigits: 3, maxFractionDigits: 1 })

    if (distanceInputRef.current && distanceInputRef.current.value !== sanitized) {
      distanceInputRef.current.value = sanitized
    }

    updateWorkout({
      distance: sanitized ? clampNumber(Number(sanitized), 0, 999.9) : 0,
    })
  }

  const handleCaloriesChange = (value: string) => {
    const sanitized = sanitizeIntegerInput(value, 5)

    if (caloriesInputRef.current && caloriesInputRef.current.value !== sanitized) {
      caloriesInputRef.current.value = sanitized
    }

    updateWorkout({
      calories: sanitized ? clampNumber(Number(sanitized), 0, 99999) : undefined,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <EditorCard title="Activity">
        <div className="flex gap-2">
          {activityOptions.map((activity) => {
            const isActive = workout.activityType === activity.id
            const Icon = activity.id === 'run' ? PersonStanding : activity.id === 'ride' ? Bike : PersonStanding

            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => updateWorkout({ activityType: activity.id })}
                className={
                  isActive
                    ? 'flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-emerald-400/35 bg-emerald-400/10 py-3 text-xs font-semibold tracking-wide text-emerald-300'
                    : 'flex flex-1 flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-xs font-semibold tracking-wide text-slate-400 transition hover:border-emerald-400/40 hover:text-white'
                }
              >
                <Icon className="h-4 w-4" />
                {activity.label}
              </button>
            )
          })}
        </div>
      </EditorCard>

      <EditorCard title="Workout Details">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Title"
            value={workout.title}
            onChange={(value) => updateWorkout({ title: sanitizeTextInput(value, 32) })}
            placeholder="Morning Run"
            hint={`${workout.title.length}/32`}
            full
          />
          <InputField
            label="Distance"
            defaultValue={String(workout.distance)}
            onChange={handleDistanceChange}
            placeholder="10.2"
            hint="Up to 999.9 km"
            inputMode="decimal"
            inputRef={distanceInputRef}
          />
          <InputField
            label="Duration"
            value={workout.duration}
            onChange={(value) => updateWorkout({ duration: sanitizeTextInput(value, 10) })}
            placeholder="52:14"
            hint="Short format works best"
          />
          <InputField
            label="Avg Pace"
            value={workout.pace}
            onChange={(value) => updateWorkout({ pace: sanitizeTextInput(value, 12) })}
            placeholder="5:07/km"
            hint="Keep it compact"
          />
          <InputField
            label="Calories"
            defaultValue={workout.calories ? String(workout.calories) : ''}
            onChange={handleCaloriesChange}
            placeholder="742"
            hint="Optional"
            inputMode="numeric"
            inputRef={caloriesInputRef}
          />
          <InputField
            label="Date"
            value={workout.date}
            onChange={(value) => updateWorkout({ date: sanitizeTextInput(value, 20) })}
            placeholder="Sep 12"
            hint={`${workout.date.length}/20`}
          />
        </div>
      </EditorCard>

      <EditorCard title="Layout">
        <div className="grid grid-cols-4 gap-2">
          {layoutCatalog.map((layout) => {
            const Icon = layoutIcons[layout.id]
            const isActive = layoutId === layout.id

            return (
              <button
                key={layout.id}
                type="button"
                onClick={() => setLayout(layout.id)}
                className={
                  isActive
                    ? 'flex flex-col items-center gap-1.5 rounded-xl border border-emerald-400/35 bg-emerald-400/10 p-2.5 text-emerald-300'
                    : 'flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-400 transition hover:border-emerald-400/40 hover:text-white'
                }
                title={layout.description}
              >
                <Icon className="h-5 w-5" />
                <span className="text-center text-[9px] font-semibold leading-tight tracking-wide">{layout.label}</span>
              </button>
            )
          })}
        </div>
      </EditorCard>

      <EditorCard title="Style">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {templateCatalog.map((template) => {
            const isActive = templateId === template.id

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setTemplate(template.id)}
                className="flex flex-shrink-0 flex-col items-center gap-2"
                aria-label={template.label}
              >
                <div
                  className={[
                    'h-20 w-14 rounded-2xl border-2 shadow-md transition-all duration-200',
                    templateSwatches[template.id],
                    isActive ? 'scale-105 border-emerald-400 shadow-emerald-400/25' : 'border-transparent opacity-70',
                  ].join(' ')}
                >
                  {template.id === 'story-mode' && (
                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/30 to-cyan-500/20" />
                    </div>
                  )}
                </div>
                <span className={isActive ? 'text-xs font-medium text-emerald-300' : 'text-xs font-medium text-slate-400'}>
                  {template.label}
                </span>
              </button>
            )
          })}
        </div>
      </EditorCard>
    </div>
  )
}

function EditorCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</h3>
      {children}
    </section>
  )
}

function InputField({
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  hint,
  full,
  inputMode,
  inputRef,
}: {
  label: string
  value?: string
  defaultValue?: string
  onChange: (value: string) => void
  placeholder: string
  hint?: string
  full?: boolean
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  inputRef?: RefObject<HTMLInputElement | null>
}) {
  const inputProps = value !== undefined ? { value } : { defaultValue }

  return (
    <div className={full ? 'col-span-2 flex flex-col gap-1.5' : 'flex flex-col gap-1.5'}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-slate-400">{label}</label>
        {hint ? <span className="text-[10px] font-medium text-slate-500">{hint}</span> : null}
      </div>
      <input
        type="text"
        ref={inputRef}
        {...inputProps}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
      />
    </div>
  )
}

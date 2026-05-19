import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../../store/useWorkoutStore'
import { formatDistance } from '../../lib/formatters'

export function HistorySection({ onSelect }: { onSelect?: () => void }) {
  const navigate = useNavigate()
  const savedCards = useWorkoutStore((state) => state.savedCards)
  const loadSavedCard = useWorkoutStore((state) => state.loadSavedCard)

  const items = useMemo(() => savedCards.slice(0, 6), [savedCards])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Recent Workouts</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            {savedCards.length} saved card{savedCards.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="text-xs font-semibold text-emerald-300"
        >
          See all
        </button>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                loadSavedCard(item)
                onSelect?.()
              }}
              className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:border-emerald-400/40 active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-xl shadow-md">
                <span aria-hidden="true">
                  {item.workout.activityType === 'run'
                    ? '🏃'
                    : item.workout.activityType === 'ride'
                      ? '🚴'
                      : '🚶'}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold leading-tight text-white">{item.workout.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.workout.activityType} · {item.workout.date}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-white">{formatDistance(item.workout.distance)} km</p>
                    <p className="text-xs text-slate-400">{item.workout.duration}</p>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <Chip label={item.workout.pace} />
                  <Chip label={item.workout.calories ? `${item.workout.calories} kcal` : 'Optional'} />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center">
          <p className="text-sm text-slate-400">Save a card and it will appear here.</p>
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white transition hover:border-white/20"
          >
            Open editor
          </button>
        </div>
      )}

      <p className="pt-2 text-center text-xs text-slate-500">Tap any workout to load it into the editor</p>
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-400">
      {label}
    </span>
  )
}

'use client'

import { cn } from '@/lib/utils'
import type { WorkoutData, ActivityType } from './workout-card'

const historyItems: (WorkoutData & { id: string; templateColor: string })[] = [
  {
    id: '1',
    title: 'Morning Run',
    distance: '10.2',
    duration: '52:14',
    pace: '5:07/km',
    calories: '742',
    date: 'Sep 12',
    activityType: 'Run' as ActivityType,
    templateColor: 'from-emerald-500 to-cyan-600',
  },
  {
    id: '2',
    title: 'Evening Ride',
    distance: '32.7',
    duration: '1:14:30',
    pace: '2:17/km',
    calories: '1,024',
    date: 'Sep 10',
    activityType: 'Ride' as ActivityType,
    templateColor: 'from-amber-500 to-orange-600',
  },
  {
    id: '3',
    title: 'Park Walk',
    distance: '5.4',
    duration: '1:02:00',
    pace: '11:29/km',
    calories: '340',
    date: 'Sep 8',
    activityType: 'Walk' as ActivityType,
    templateColor: 'from-blue-500 to-indigo-600',
  },
]

const activityEmoji: Record<ActivityType, string> = {
  Run: '🏃',
  Ride: '🚴',
  Walk: '🚶',
}

interface HistorySectionProps {
  onSelect: (item: WorkoutData) => void
}

export function HistorySection({ onSelect }: HistorySectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Recent Workouts</h2>
        <button className="text-xs text-primary font-semibold">See all</button>
      </div>
      <div className="flex flex-col gap-3">
        {historyItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all active:scale-[0.98] text-left"
          >
            {/* Mini gradient icon */}
            <div
              className={cn(
                'flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl shadow-md',
                item.templateColor
              )}
            >
              <span role="img" aria-label={item.activityType}>
                {activityEmoji[item.activityType]}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-foreground leading-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.activityType} &middot; {item.date}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-foreground">{item.distance} km</p>
                  <p className="text-xs text-muted-foreground">{item.duration}</p>
                </div>
              </div>

              {/* Stats strip */}
              <div className="flex items-center gap-3 mt-2">
                <Chip label={item.pace} />
                <Chip label={`${item.calories} kcal`} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty-state hint */}
      <p className="text-center text-xs text-muted-foreground/60 pt-2">
        Tap any workout to load it into the editor
      </p>
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium">
      {label}
    </span>
  )
}

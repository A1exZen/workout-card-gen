import { activityMeta, displayText, formatDistance, getBackgroundStyle } from '../../lib/formatters'
import type {
  BackgroundOption,
  ExportSize,
  LayoutId,
  TemplateId,
  WorkoutData,
} from '../../types/workout'

type WorkoutCardPreviewProps = {
  workout: WorkoutData
  templateId: TemplateId
  background: BackgroundOption
  exportSize: ExportSize
  layoutId?: LayoutId
  compact?: boolean
  gallery?: boolean
}

type VisualConfig = {
  surface: string
  text: string
  sub: string
  stat: string
  label: string
  divider: string
  badge: string
  badgeText: string
}

const templateConfig: Record<TemplateId, VisualConfig> = {
  'dark-minimal': {
    surface: 'bg-[#0d0d0f]',
    text: 'text-white',
    sub: 'text-white/60',
    stat: 'text-white',
    label: 'text-white/50',
    divider: 'bg-white/10',
    badge: 'bg-white/10',
    badgeText: 'text-white/80',
  },
  'apple-fitness': {
    surface: 'bg-white',
    text: 'text-gray-900',
    sub: 'text-gray-500',
    stat: 'text-gray-900',
    label: 'text-gray-400',
    divider: 'bg-gray-100',
    badge: 'bg-gray-100',
    badgeText: 'text-gray-600',
  },
  'gradient-sport': {
    surface: 'bg-transparent',
    text: 'text-white',
    sub: 'text-white/70',
    stat: 'text-white',
    label: 'text-white/60',
    divider: 'bg-white/20',
    badge: 'bg-white/20',
    badgeText: 'text-white/90',
  },
  'story-mode': {
    surface: 'bg-[#0d0d0f]',
    text: 'text-white',
    sub: 'text-white/60',
    stat: 'text-white',
    label: 'text-white/50',
    divider: 'bg-white/10',
    badge: 'bg-white/10',
    badgeText: 'text-white/80',
  },
}

const activityIcons = {
  run: '🏃',
  ride: '🚴',
  walk: '🚶',
} as const

const aspectRatioClasses: Record<ExportSize, string> = {
  story: 'aspect-[9/16]',
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function WorkoutCardPreview({
  workout,
  templateId,
  background,
  exportSize,
  layoutId = 'classic',
  compact = false,
  gallery = false,
}: WorkoutCardPreviewProps) {
  const cfg = templateConfig[templateId]
  const isGradient = templateId === 'gradient-sport'
  const isStory = templateId === 'story-mode'
  const ratioClass = aspectRatioClasses[exportSize]
  const isThumbnail = compact && gallery
  const displayWorkout: WorkoutData = {
    ...workout,
    title: displayText(workout.title, 'Untitled Session'),
    duration: displayText(workout.duration, '00:00'),
    pace: displayText(workout.pace, '—'),
    date: displayText(workout.date, 'Today'),
  }
  const previewWorkout = isThumbnail
    ? {
        ...displayWorkout,
        title: shortenText(displayWorkout.title, 18),
        duration: shortenText(displayWorkout.duration, 5),
        pace: shortenMetric(displayWorkout.pace, 5),
        date: shortenDate(displayWorkout.date),
        calories: displayWorkout.calories
          ? Number(String(displayWorkout.calories).slice(0, 3))
          : undefined,
      }
    : displayWorkout
  const inlineBg =
    background.type === 'gradient'
      ? { backgroundImage: background.value }
      : getBackgroundStyle(background)
  const effectiveCfg = cfg

  return (
    <article
      className={cx(
        'relative w-full overflow-hidden select-none rounded-3xl shadow-2xl',
        ratioClass,
        !isGradient && cfg.surface,
      )}
      style={inlineBg}
    >
      {isGradient && <div className="absolute inset-0" style={inlineBg} />}

      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {!compact && templateId === 'dark-minimal' && (
        <>
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
        </>
      )}

      {isStory && !compact && (
        <>
          <div className="absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-emerald-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 to-transparent" />
        </>
      )}

      <div className={cx('relative z-10 flex h-full flex-col', isThumbnail ? 'p-2.5' : compact ? 'p-3' : 'p-6')}>
        {layoutId === 'classic' && <ClassicLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
        {layoutId === 'hero-center' && <HeroCenterLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
        {layoutId === 'minimal' && <MinimalLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
        {layoutId === 'photo-focus' && <PhotoFocusLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
        {layoutId === 'corner-badge' && <CornerBadgeLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
        {layoutId === 'bottom-strip' && <BottomStripLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
        {layoutId === 'split-diagonal' && <SplitDiagonalLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
        {layoutId === 'floating-stats' && <FloatingStatsLayout workout={previewWorkout} cfg={effectiveCfg} compact={compact} thumbnail={isThumbnail} />}
      </div>
    </article>
  )
}

function shortenText(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value
}

function shortenMetric(value: string, maxLength: number) {
  const normalized = value.replace(/\s*\/\s*km$/i, '').replace(/\s+/g, '')
  return shortenText(normalized, maxLength)
}

function shortenDate(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Today'
  }

  const [head] = trimmed.split(',')
  return shortenText(head.toUpperCase(), 8)
}

function TitleBlock({
  value,
  className,
  compact,
}: {
  value: string
  className: string
  compact: boolean
}) {
  return (
    <div
      className={cx('min-w-0 overflow-hidden break-words', compact ? 'line-clamp-2' : '', className)}
      style={
        compact
          ? {
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }
          : undefined
      }
    >
      {value}
    </div>
  )
}

function ClassicLayout({
  workout,
  cfg,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="min-w-0 pr-3">
          <div className={cx('mb-1 font-semibold uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
            {activityMeta[workout.activityType].label}
          </div>
          <TitleBlock
            value={workout.title}
            compact={compact || thumbnail}
            className={cx('font-bold leading-tight tracking-tight', cfg.text, thumbnail ? 'text-[13px]' : compact ? 'text-sm' : 'text-2xl')}
          />
        </div>
        <div className={cx('flex items-center justify-center rounded-2xl', cfg.badge, compact ? 'h-6 w-6 text-xs' : 'h-10 w-10 text-lg')}>
          <span role="img" aria-label={activityMeta[workout.activityType].label}>{activityIcons[workout.activityType]}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-start justify-center">
        <div className={cx('font-black leading-none tracking-tighter', cfg.stat, compact ? 'text-3xl' : 'text-7xl')}>
          {formatDistance(workout.distance)}
        </div>
        <div className={cx('mt-1 font-medium tracking-wide', cfg.sub, compact ? 'text-[10px]' : 'text-sm')}>kilometers</div>
        <div className={cx('my-3 h-px w-full', cfg.divider, compact && 'my-2')} />
        <div className={cx('grid w-full', compact ? 'grid-cols-3 gap-2' : 'grid-cols-3 gap-4')}>
          <StatItem value={workout.duration} label="Time" cfg={cfg} compact={compact} thumbnail={thumbnail} />
          <StatItem value={workout.pace} label="Avg Pace" cfg={cfg} compact={compact} thumbnail={thumbnail} />
          <StatItem value={workout.calories ? String(workout.calories) : '—'} label="kcal" cfg={cfg} compact={compact} thumbnail={thumbnail} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={cx('min-w-0 truncate pr-2 font-medium uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {workout.date}
        </div>
        <div className={cx('flex items-center gap-1 rounded-full px-2 py-1 font-semibold tracking-wide', cfg.badge, cfg.badgeText, compact ? 'text-[8px]' : 'text-xs')}>
          <span className={cx('inline-block rounded-full bg-emerald-400', compact ? 'h-1 w-1' : 'h-1.5 w-1.5')} />
          PACE
        </div>
      </div>
    </>
  )
}

function HeroCenterLayout({
  workout,
  cfg,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className={cx('min-w-0 truncate pr-2 font-semibold uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {activityMeta[workout.activityType].label}
        </div>
        <div className={cx('min-w-0 truncate text-right font-medium uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {workout.date}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <TitleBlock
          value={workout.title}
          compact={compact || thumbnail}
          className={cx('mb-2 max-w-full text-center font-bold leading-tight tracking-tight', cfg.text, thumbnail ? 'text-[13px]' : compact ? 'text-sm' : 'text-xl')}
        />
        <div className={cx('font-black leading-none tracking-tighter', cfg.stat, compact ? 'text-4xl' : 'text-8xl')}>
          {formatDistance(workout.distance)}
        </div>
        <div className={cx('mt-1 font-medium tracking-wide', cfg.sub, compact ? 'text-[10px]' : 'text-sm')}>km</div>
      </div>

      <div className={cx('grid w-full grid-cols-3', compact ? 'gap-2' : 'gap-4')}>
        <StatItemCenter value={workout.duration} label="Time" cfg={cfg} compact={compact} thumbnail={thumbnail} />
        <StatItemCenter value={workout.pace} label="Pace" cfg={cfg} compact={compact} thumbnail={thumbnail} />
        <StatItemCenter value={workout.calories ? String(workout.calories) : '—'} label="kcal" cfg={cfg} compact={compact} thumbnail={thumbnail} />
      </div>
    </>
  )
}

function MinimalLayout({
  workout,
  cfg,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className={cx('flex w-fit items-center gap-1 rounded-full', cfg.badge, thumbnail ? 'px-1.5 py-1' : 'px-2 py-1')}>
        <span className={cx('inline-block rounded-full bg-emerald-400', compact ? 'h-1 w-1' : 'h-1.5 w-1.5')} />
        <span className={cx('font-semibold uppercase tracking-wide', cfg.badgeText, compact ? 'text-[8px]' : 'text-xs')}>
          {activityMeta[workout.activityType].label}
        </span>
      </div>

      <div className="flex flex-col">
        <div className={cx('font-black leading-none tracking-tighter', cfg.stat, thumbnail ? 'text-[52px]' : compact ? 'text-5xl' : 'text-9xl')}>
          {formatDistance(workout.distance)}
        </div>
        <div className={cx('mt-1 font-semibold uppercase tracking-wide', cfg.sub, compact ? 'text-xs' : 'text-lg')}>km</div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className={cx('max-w-full truncate font-bold', cfg.text, compact ? 'text-sm' : 'text-xl')}>{workout.duration}</div>
          <div className={cx('max-w-full truncate font-medium', cfg.sub, compact ? 'text-[10px]' : 'text-sm')}>{workout.pace}</div>
        </div>
        <div className={cx('max-w-[45%] truncate text-right font-medium uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>{workout.date}</div>
      </div>
    </div>
  )
}

function PhotoFocusLayout({
  workout,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  if (thumbnail) {
    return (
      <div className="flex flex-1 flex-col justify-between">
        <div className="absolute left-3 top-3">
          <div className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 backdrop-blur-md">
            <span className="text-[10px]">{activityIcons[workout.activityType]}</span>
            <span className="text-[7px] font-semibold uppercase tracking-wide text-white">
              {activityMeta[workout.activityType].label}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/40 p-3 backdrop-blur-md">
          <div className="mb-2">
            <div className="text-[44px] font-black leading-none tracking-tighter text-white">
              {formatDistance(workout.distance)}
            </div>
            <div className="text-[9px] font-medium tracking-wide text-white/70">kilometers</div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-[10px] font-bold text-white">{workout.duration}</span>
            <span className="text-[9px] font-medium text-white/60">{workout.pace}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-end">
      <div className="absolute left-4 top-4">
        <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-md">
          <span className="text-sm">{activityIcons[workout.activityType]}</span>
          <span className={cx('font-semibold uppercase tracking-wide text-white', compact ? 'text-[8px]' : 'text-xs')}>
            {activityMeta[workout.activityType].label}
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-black/40 p-4 backdrop-blur-md">
        <div className="mb-3 flex items-end justify-between">
          <div className="min-w-0 pr-3">
            <div className={cx('font-black leading-none tracking-tighter text-white', compact ? 'text-3xl' : 'text-5xl')}>
              {formatDistance(workout.distance)}
            </div>
            <div className={cx('font-medium tracking-wide text-white/70', compact ? 'text-[10px]' : 'text-sm')}>kilometers</div>
          </div>
          <div className="min-w-0 text-right">
            <div className={cx('truncate font-bold text-white', compact ? 'text-lg' : 'text-2xl')}>{workout.duration}</div>
            <div className={cx('truncate font-medium text-white/60', compact ? 'text-[10px]' : 'text-xs')}>{workout.pace}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={cx('min-w-0 truncate pr-2 font-medium uppercase tracking-widest text-white/50', compact ? 'text-[8px]' : 'text-xs')}>{workout.date}</span>
          <span className={cx('truncate font-semibold text-white/70', compact ? 'text-[10px]' : 'text-xs')}>
            {workout.calories ? `${workout.calories} kcal` : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}

function CornerBadgeLayout({
  workout,
  cfg,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="flex justify-end">
        <div className={cx('rounded-2xl px-3 py-2', cfg.badge)}>
          <span className={cx('font-semibold uppercase tracking-widest', cfg.badgeText, compact ? 'text-[8px]' : 'text-xs')}>
            {activityMeta[workout.activityType].shortLabel}
          </span>
        </div>
      </div>
      <div>
        <div className={cx('mb-2 font-medium uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {workout.date}
        </div>
        <div className={cx('font-black leading-none tracking-tighter', cfg.stat, compact ? 'text-4xl' : 'text-7xl')}>
          {formatDistance(workout.distance)}
        </div>
        <TitleBlock
          value={workout.title}
          compact={compact || thumbnail}
          className={cx('mt-1 font-medium', cfg.sub, compact ? 'text-[10px]' : 'text-sm')}
        />
      </div>
    </div>
  )
}

function BottomStripLayout({
  workout,
  cfg,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  if (thumbnail) {
    return (
      <div className="flex flex-1 flex-col justify-between">
        <div className={cx('font-semibold uppercase tracking-widest', cfg.label, 'text-[8px]')}>
          {activityMeta[workout.activityType].label}
        </div>
        <div className={cx('rounded-[22px] p-3', cfg.badge)}>
          <TitleBlock
            value={workout.title}
            compact
            className={cx('mb-2 text-[12px] font-bold tracking-tight', cfg.text)}
          />
          <div className="mb-2 flex items-end gap-2">
            <div className={cx('text-[52px] font-black leading-none tracking-tighter', cfg.stat)}>
              {formatDistance(workout.distance)}
            </div>
            <div className={cx('pb-1 text-[9px] font-medium', cfg.sub)}>km</div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <StatItem value={workout.duration} label="Time" cfg={cfg} compact={compact} thumbnail hideLabel />
            <StatItem value={workout.pace} label="Pace" cfg={cfg} compact={compact} thumbnail hideLabel />
            <StatItem value={workout.calories ? String(workout.calories) : '—'} label="kcal" cfg={cfg} compact={compact} thumbnail hideLabel />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <div className={cx('font-semibold uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {activityMeta[workout.activityType].label}
        </div>
      </div>
      <div className={cx('rounded-3xl p-4', cfg.badge)}>
        <TitleBlock
          value={workout.title}
          compact={compact}
          className={cx('mb-2 font-bold tracking-tight', cfg.text, compact ? 'text-base' : 'text-2xl')}
        />
        <div className="mb-3 flex items-end gap-3">
          <div className={cx('font-black leading-none tracking-tighter', cfg.stat, compact ? 'text-4xl' : 'text-6xl')}>
            {formatDistance(workout.distance)}
          </div>
          <div className={cx('font-medium', cfg.sub, compact ? 'text-[10px]' : 'text-sm')}>km</div>
        </div>
        <div className={cx('grid grid-cols-3', compact ? 'gap-2' : 'gap-3')}>
          <StatItem value={workout.duration} label="Time" cfg={cfg} compact={compact} thumbnail={thumbnail} />
          <StatItem value={workout.pace} label="Pace" cfg={cfg} compact={compact} thumbnail={thumbnail} />
          <StatItem value={workout.calories ? String(workout.calories) : '—'} label="kcal" cfg={cfg} compact={compact} thumbnail={thumbnail} />
        </div>
      </div>
    </div>
  )
}

function SplitDiagonalLayout({
  workout,
  cfg,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  if (thumbnail) {
    return (
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[24px]">
        <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_0%,transparent_48%,rgba(255,255,255,0.08)_48%,rgba(255,255,255,0.08)_56%,transparent_56%,transparent_100%)]" />
        <div className="relative flex items-center justify-between gap-2">
          <div className={cx('min-w-0 truncate font-semibold uppercase tracking-widest', cfg.label, 'text-[8px]')}>
            {activityMeta[workout.activityType].label}
          </div>
          <div className={cx('min-w-0 truncate text-right font-medium uppercase tracking-widest', cfg.label, 'text-[8px]')}>
            {workout.date}
          </div>
        </div>
        <div className="relative flex flex-1 flex-col justify-center">
          <div className={cx('text-[52px] font-black leading-none tracking-tighter', cfg.stat)}>
            {formatDistance(workout.distance)}
          </div>
          <div className={cx('mt-1 text-[9px] font-medium', cfg.sub)}>kilometers</div>
        </div>
        <div className="relative space-y-2">
          <TitleBlock value={workout.title} compact className={cx('text-[12px] font-bold tracking-tight', cfg.text)} />
          <div className={cx('w-fit max-w-full rounded-2xl px-2.5 py-1.5', cfg.badge)}>
            <div className={cx('truncate text-[10px] font-bold', cfg.text)}>{workout.duration}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[24px]">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,transparent_0%,transparent_46%,rgba(255,255,255,0.08)_46%,rgba(255,255,255,0.08)_54%,transparent_54%,transparent_100%)]" />
      <div className="relative flex items-center justify-between">
        <div className={cx('min-w-0 truncate pr-2 font-semibold uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {activityMeta[workout.activityType].label}
        </div>
        <div className={cx('min-w-0 truncate text-right font-medium uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {workout.date}
        </div>
      </div>
      <div className="relative flex flex-1 items-end justify-between">
        <div>
          <div className={cx('font-black leading-none tracking-tighter', cfg.stat, compact ? 'text-4xl' : 'text-7xl')}>
            {formatDistance(workout.distance)}
          </div>
          <div className={cx('mt-1 font-medium', cfg.sub, compact ? 'text-[10px]' : 'text-sm')}>kilometers</div>
        </div>
        <div className={cx('max-w-[46%] rounded-2xl px-3 py-2 text-right', cfg.badge)}>
          <div className={cx('truncate font-bold', cfg.text, compact ? 'text-xs' : 'text-sm')}>{workout.duration}</div>
          <div className={cx('truncate font-medium', cfg.sub, compact ? 'text-[9px]' : 'text-xs')}>{workout.pace}</div>
        </div>
      </div>
      <div className="relative pt-3">
        <TitleBlock
          value={workout.title}
          compact={compact}
          className={cx('font-bold tracking-tight', cfg.text, compact ? 'text-sm' : 'text-xl')}
        />
      </div>
    </div>
  )
}

function FloatingStatsLayout({
  workout,
  cfg,
  compact,
  thumbnail,
}: {
  workout: WorkoutData
  cfg: VisualConfig
  compact: boolean
  thumbnail: boolean
}) {
  if (thumbnail) {
    return (
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <div className={cx('rounded-full px-2.5 py-1', cfg.badge)}>
            <span className={cx('font-semibold uppercase tracking-widest', cfg.badgeText, 'text-[8px]')}>
              {activityMeta[workout.activityType].label}
            </span>
          </div>
          <div className={cx('min-w-0 truncate text-right font-medium uppercase tracking-widest', cfg.label, 'text-[8px]')}>
            {workout.date}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className={cx('rounded-[28px] px-4 py-3 text-center shadow-xl', cfg.badge)}>
            <div className={cx('text-[52px] font-black leading-none tracking-tighter', cfg.stat)}>
              {formatDistance(workout.distance)}
            </div>
            <div className={cx('mt-1 text-[9px] font-medium', cfg.sub)}>km</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <StatItemCenter value={workout.duration} label="Time" cfg={cfg} compact={compact} thumbnail hideLabel />
          <StatItemCenter value={workout.pace} label="Pace" cfg={cfg} compact={compact} thumbnail hideLabel />
          <StatItemCenter value={workout.calories ? String(workout.calories) : '—'} label="kcal" cfg={cfg} compact={compact} thumbnail hideLabel />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="flex justify-between">
        <div className={cx('rounded-full px-3 py-1.5', cfg.badge)}>
          <span className={cx('font-semibold uppercase tracking-widest', cfg.badgeText, compact ? 'text-[8px]' : 'text-xs')}>
            {activityMeta[workout.activityType].label}
          </span>
        </div>
        <div className={cx('font-medium uppercase tracking-widest', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>
          {workout.date}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className={cx('rounded-3xl px-5 py-4 text-center shadow-xl', cfg.badge)}>
          <div className={cx('font-black leading-none tracking-tighter', cfg.stat, compact ? 'text-4xl' : 'text-7xl')}>
            {formatDistance(workout.distance)}
          </div>
          <div className={cx('mt-1 font-medium', cfg.sub, compact ? 'text-[10px]' : 'text-sm')}>km</div>
        </div>
      </div>
      <div className={cx('grid grid-cols-3', compact ? 'gap-2' : 'gap-3')}>
        <StatItemCenter value={workout.duration} label="Time" cfg={cfg} compact={compact} thumbnail={thumbnail} />
        <StatItemCenter value={workout.pace} label="Pace" cfg={cfg} compact={compact} thumbnail={thumbnail} />
        <StatItemCenter value={workout.calories ? String(workout.calories) : '—'} label="kcal" cfg={cfg} compact={compact} thumbnail={thumbnail} />
      </div>
    </div>
  )
}

function StatItem({
  value,
  label,
  cfg,
  compact,
  thumbnail = false,
  hideLabel = false,
}: {
  value: string
  label: string
  cfg: VisualConfig
  compact: boolean
  thumbnail?: boolean
  hideLabel?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className={cx('truncate font-bold', cfg.text, thumbnail ? 'text-[9px]' : compact ? 'text-[10px]' : 'text-sm')}>{value}</div>
      {!hideLabel ? (
        <div className={cx('truncate mt-0.5 font-medium', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>{label}</div>
      ) : null}
    </div>
  )
}

function StatItemCenter({
  value,
  label,
  cfg,
  compact,
  thumbnail = false,
  hideLabel = false,
}: {
  value: string
  label: string
  cfg: VisualConfig
  compact: boolean
  thumbnail?: boolean
  hideLabel?: boolean
}) {
  return (
    <div className="min-w-0 text-center">
      <div className={cx('truncate font-bold', cfg.text, thumbnail ? 'text-[9px]' : compact ? 'text-[10px]' : 'text-sm')}>{value}</div>
      {!hideLabel ? (
        <div className={cx('truncate mt-0.5 font-medium', cfg.label, compact ? 'text-[8px]' : 'text-xs')}>{label}</div>
      ) : null}
    </div>
  )
}

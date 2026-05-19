'use client'

import { cn } from '@/lib/utils'

export type ActivityType = 'Run' | 'Ride' | 'Walk'
export type CardTemplate = 'dark' | 'white' | 'gradient' | 'story'
export type CardLayout = 
  | 'classic' 
  | 'hero-center' 
  | 'minimal' 
  | 'photo-focus' 
  | 'corner-badge' 
  | 'bottom-strip' 
  | 'split-diagonal' 
  | 'floating-stats'

export interface WorkoutData {
  title: string
  distance: string
  duration: string
  pace: string
  calories: string
  date: string
  activityType: ActivityType
}

export interface CardStyle {
  template: CardTemplate
  layout: CardLayout
  bgColor: string
  bgGradientFrom: string
  bgGradientTo: string
  useGradient: boolean
  bgImage: string | null
}

interface WorkoutCardProps {
  data: WorkoutData
  style: CardStyle
  aspectRatio?: '9:16' | '1:1' | '4:5'
  className?: string
  scale?: 'mini' | 'full'
}

const activityIcons: Record<ActivityType, string> = {
  Run: '🏃',
  Ride: '🚴',
  Walk: '🚶',
}

const templateConfig: Record<
  CardTemplate,
  { bg: string; text: string; sub: string; stat: string; label: string; divider: string; badge: string; badgeText: string }
> = {
  dark: {
    bg: 'bg-[#0d0d0f]',
    text: 'text-white',
    sub: 'text-white/60',
    stat: 'text-white',
    label: 'text-white/50',
    divider: 'bg-white/10',
    badge: 'bg-white/10',
    badgeText: 'text-white/80',
  },
  white: {
    bg: 'bg-white',
    text: 'text-gray-900',
    sub: 'text-gray-500',
    stat: 'text-gray-900',
    label: 'text-gray-400',
    divider: 'bg-gray-100',
    badge: 'bg-gray-100',
    badgeText: 'text-gray-600',
  },
  gradient: {
    bg: 'bg-transparent',
    text: 'text-white',
    sub: 'text-white/70',
    stat: 'text-white',
    label: 'text-white/60',
    divider: 'bg-white/20',
    badge: 'bg-white/20',
    badgeText: 'text-white/90',
  },
  story: {
    bg: 'bg-[#0d0d0f]',
    text: 'text-white',
    sub: 'text-white/60',
    stat: 'text-white',
    label: 'text-white/50',
    divider: 'bg-white/10',
    badge: 'bg-white/10',
    badgeText: 'text-white/80',
  },
}

const aspectRatioClasses: Record<string, string> = {
  '9:16': 'aspect-[9/16]',
  '1:1': 'aspect-square',
  '4:5': 'aspect-[4/5]',
}

export const layouts: { id: CardLayout; label: string; description: string; icon: string }[] = [
  { id: 'classic', label: 'Classic', description: 'Traditional layout with header and stats grid', icon: 'grid' },
  { id: 'hero-center', label: 'Hero', description: 'Big centered distance with surrounding stats', icon: 'center' },
  { id: 'minimal', label: 'Minimal', description: 'Just the essentials, clean and simple', icon: 'minus' },
  { id: 'photo-focus', label: 'Photo', description: 'Image takes center stage, stats overlay', icon: 'image' },
  { id: 'corner-badge', label: 'Badge', description: 'Small badge in corner, full image background', icon: 'corner' },
  { id: 'bottom-strip', label: 'Strip', description: 'Stats in bottom strip, clean top area', icon: 'strip' },
  { id: 'split-diagonal', label: 'Diagonal', description: 'Diagonal split with stats and accent', icon: 'diagonal' },
  { id: 'floating-stats', label: 'Float', description: 'Floating stat cards over background', icon: 'float' },
]

export function WorkoutCard({ data, style, aspectRatio = '4:5', className, scale = 'full' }: WorkoutCardProps) {
  const cfg = templateConfig[style.template]
  const isStory = style.template === 'story'
  const isGradient = style.template === 'gradient'
  const hasImage = !!style.bgImage

  const inlineBg =
    style.bgImage
      ? { backgroundImage: `url(${style.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : isGradient || style.useGradient
      ? { background: `linear-gradient(135deg, ${style.bgGradientFrom}, ${style.bgGradientTo})` }
      : !['dark', 'white', 'story'].includes(style.template)
      ? { backgroundColor: style.bgColor }
      : undefined

  const isMini = scale === 'mini'

  // Force white text when image is present
  const effectiveCfg = hasImage ? { ...cfg, text: 'text-white', sub: 'text-white/70', stat: 'text-white', label: 'text-white/60', badge: 'bg-black/30 backdrop-blur-md', badgeText: 'text-white/90', divider: 'bg-white/20' } : cfg

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-3xl shadow-2xl select-none',
        aspectRatioClasses[aspectRatio],
        !hasImage && cfg.bg,
        className
      )}
      style={inlineBg}
    >
      {/* Background overlay for image */}
      {hasImage && style.layout !== 'photo-focus' && style.layout !== 'corner-badge' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      )}
      
      {/* Special overlay for photo-focused layouts */}
      {hasImage && (style.layout === 'photo-focus' || style.layout === 'corner-badge') && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
      )}

      {/* Gradient template bg */}
      {isGradient && !hasImage && (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${style.bgGradientFrom}, ${style.bgGradientTo})` }}
        />
      )}

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Glow accents for dark/story */}
      {!hasImage && style.template === 'dark' && (
        <>
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl" />
        </>
      )}
      {!hasImage && isStory && (
        <>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 to-transparent" />
        </>
      )}

      {/* Layout-specific content */}
      <div className={cn('relative z-10 flex flex-col h-full', isMini ? 'p-3' : 'p-6')}>
        {style.layout === 'classic' && <ClassicLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
        {style.layout === 'hero-center' && <HeroCenterLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
        {style.layout === 'minimal' && <MinimalLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
        {style.layout === 'photo-focus' && <PhotoFocusLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
        {style.layout === 'corner-badge' && <CornerBadgeLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
        {style.layout === 'bottom-strip' && <BottomStripLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
        {style.layout === 'split-diagonal' && <SplitDiagonalLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
        {style.layout === 'floating-stats' && <FloatingStatsLayout data={data} cfg={effectiveCfg} isMini={isMini} />}
      </div>
    </div>
  )
}

type LayoutConfig = (typeof templateConfig)[CardTemplate]

function ClassicLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <div className={cn('font-semibold tracking-widest uppercase mb-1', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>
            {data.activityType}
          </div>
          <h2 className={cn('font-bold leading-tight tracking-tight text-balance', cfg.text, isMini ? 'text-sm' : 'text-2xl')}>
            {data.title}
          </h2>
        </div>
        <div className={cn('flex items-center justify-center rounded-2xl', cfg.badge, isMini ? 'w-6 h-6 text-xs' : 'w-10 h-10 text-lg')}>
          <span role="img" aria-label={data.activityType}>{activityIcons[data.activityType]}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-start">
        <div className={cn('font-black tracking-tighter leading-none', cfg.stat, isMini ? 'text-3xl' : 'text-7xl')}>
          {data.distance}
        </div>
        <div className={cn('font-medium mt-1 tracking-wide', cfg.sub, isMini ? 'text-[10px]' : 'text-sm')}>kilometers</div>
        <div className={cn('w-full h-px my-3', cfg.divider, isMini && 'my-2')} />
        <div className={cn('grid w-full', isMini ? 'grid-cols-3 gap-2' : 'grid-cols-3 gap-4')}>
          <StatItem value={data.duration} label="Time" cfg={cfg} isMini={isMini} />
          <StatItem value={data.pace} label="Avg Pace" cfg={cfg} isMini={isMini} />
          <StatItem value={data.calories} label="kcal" cfg={cfg} isMini={isMini} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className={cn('font-medium tracking-widest uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{data.date}</div>
        <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full font-semibold tracking-wide', cfg.badge, cfg.badgeText, isMini ? 'text-[8px]' : 'text-xs')}>
          <span className={cn('rounded-full bg-emerald-400 inline-block', isMini ? 'w-1 h-1' : 'w-1.5 h-1.5')} />
          PACE
        </div>
      </div>
    </>
  )
}

function HeroCenterLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className={cn('font-semibold tracking-widest uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{data.activityType}</div>
        <div className={cn('font-medium tracking-widest uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{data.date}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className={cn('font-bold leading-tight tracking-tight text-balance mb-2', cfg.text, isMini ? 'text-sm' : 'text-xl')}>{data.title}</h2>
        <div className={cn('font-black tracking-tighter leading-none', cfg.stat, isMini ? 'text-4xl' : 'text-8xl')}>{data.distance}</div>
        <div className={cn('font-medium mt-1 tracking-wide', cfg.sub, isMini ? 'text-[10px]' : 'text-sm')}>km</div>
      </div>

      <div className={cn('grid grid-cols-3 w-full', isMini ? 'gap-2' : 'gap-4')}>
        <StatItemCenter value={data.duration} label="Time" cfg={cfg} isMini={isMini} />
        <StatItemCenter value={data.pace} label="Pace" cfg={cfg} isMini={isMini} />
        <StatItemCenter value={data.calories} label="kcal" cfg={cfg} isMini={isMini} />
      </div>
    </>
  )
}

function MinimalLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className={cn('flex items-center gap-1', cfg.badge, 'w-fit px-2 py-1 rounded-full')}>
        <span className={cn('rounded-full bg-emerald-400 inline-block', isMini ? 'w-1 h-1' : 'w-1.5 h-1.5')} />
        <span className={cn('font-semibold tracking-wide uppercase', cfg.badgeText, isMini ? 'text-[8px]' : 'text-xs')}>{data.activityType}</span>
      </div>

      <div className="flex flex-col">
        <div className={cn('font-black tracking-tighter leading-none', cfg.stat, isMini ? 'text-5xl' : 'text-9xl')}>{data.distance}</div>
        <div className={cn('font-semibold mt-1 tracking-wide uppercase', cfg.sub, isMini ? 'text-xs' : 'text-lg')}>km</div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className={cn('font-bold', cfg.text, isMini ? 'text-sm' : 'text-xl')}>{data.duration}</div>
          <div className={cn('font-medium', cfg.sub, isMini ? 'text-[10px]' : 'text-sm')}>{data.pace}</div>
        </div>
        <div className={cn('font-medium tracking-widest uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{data.date}</div>
      </div>
    </div>
  )
}

// NEW: Photo-focused layout - image takes center stage, minimal overlay at bottom
function PhotoFocusLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className="flex-1 flex flex-col justify-end">
      {/* Top: small activity badge */}
      <div className="absolute top-4 left-4">
        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md', 'bg-black/30')}>
          <span className="text-sm">{activityIcons[data.activityType]}</span>
          <span className={cn('font-semibold tracking-wide uppercase text-white', isMini ? 'text-[8px]' : 'text-xs')}>{data.activityType}</span>
        </div>
      </div>

      {/* Bottom: stats overlay */}
      <div className={cn('rounded-2xl p-4 backdrop-blur-md', 'bg-black/40')}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className={cn('font-black tracking-tighter leading-none text-white', isMini ? 'text-3xl' : 'text-5xl')}>{data.distance}</div>
            <div className={cn('font-medium text-white/70 tracking-wide', isMini ? 'text-[10px]' : 'text-sm')}>kilometers</div>
          </div>
          <div className="text-right">
            <div className={cn('font-bold text-white', isMini ? 'text-lg' : 'text-2xl')}>{data.duration}</div>
            <div className={cn('font-medium text-white/60', isMini ? 'text-[10px]' : 'text-xs')}>{data.pace}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn('font-medium text-white/50 tracking-widest uppercase', isMini ? 'text-[8px]' : 'text-xs')}>{data.date}</span>
          <span className={cn('font-semibold text-white/70', isMini ? 'text-[10px]' : 'text-xs')}>{data.calories} kcal</span>
        </div>
      </div>
    </div>
  )
}

// NEW: Corner badge - tiny badge in corner, image is main focus
function CornerBadgeLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Empty space for image to show */}
      <div />
      
      {/* Bottom left: compact badge with all info */}
      <div className={cn('self-start rounded-2xl p-3 backdrop-blur-md max-w-[70%]', 'bg-black/50')}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{activityIcons[data.activityType]}</span>
          <span className={cn('font-bold text-white truncate', isMini ? 'text-sm' : 'text-base')}>{data.title}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={cn('font-black text-white tracking-tight', isMini ? 'text-2xl' : 'text-4xl')}>{data.distance}</span>
          <span className={cn('font-medium text-white/60', isMini ? 'text-xs' : 'text-sm')}>km</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className={cn('text-white/80 font-medium', isMini ? 'text-[10px]' : 'text-xs')}>{data.duration}</span>
          <span className={cn('text-white/60', isMini ? 'text-[10px]' : 'text-xs')}>{data.pace}</span>
        </div>
      </div>

      {/* Date in corner */}
      <div className="absolute top-4 right-4">
        <span className={cn('font-medium text-white/60 tracking-widest uppercase', isMini ? 'text-[8px]' : 'text-xs')}>{data.date}</span>
      </div>
    </div>
  )
}

// NEW: Bottom strip - clean top area, stats in bottom strip
function BottomStripLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Top area with title */}
      <div className="flex-1 flex flex-col justify-center">
        <div className={cn('font-semibold tracking-widest uppercase mb-2', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>
          {data.activityType} • {data.date}
        </div>
        <h2 className={cn('font-bold leading-tight tracking-tight', cfg.text, isMini ? 'text-xl' : 'text-4xl')}>{data.title}</h2>
      </div>

      {/* Bottom strip */}
      <div className={cn('rounded-2xl p-4', cfg.badge)}>
        <div className={cn('flex items-center justify-between', isMini ? 'gap-2' : 'gap-4')}>
          <div className="flex-1">
            <div className={cn('font-black tracking-tighter', cfg.stat, isMini ? 'text-2xl' : 'text-4xl')}>{data.distance}</div>
            <div className={cn('font-medium', cfg.sub, isMini ? 'text-[10px]' : 'text-xs')}>km</div>
          </div>
          <div className={cn('w-px h-10', cfg.divider)} />
          <div className="text-center">
            <div className={cn('font-bold', cfg.stat, isMini ? 'text-base' : 'text-xl')}>{data.duration}</div>
            <div className={cn('font-medium', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>time</div>
          </div>
          <div className={cn('w-px h-10', cfg.divider)} />
          <div className="text-center">
            <div className={cn('font-bold', cfg.stat, isMini ? 'text-base' : 'text-xl')}>{data.pace}</div>
            <div className={cn('font-medium', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>pace</div>
          </div>
          <div className={cn('w-px h-10', cfg.divider)} />
          <div className="text-center">
            <div className={cn('font-bold', cfg.stat, isMini ? 'text-base' : 'text-xl')}>{data.calories}</div>
            <div className={cn('font-medium', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>kcal</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// NEW: Split diagonal - diagonal accent with stats
function SplitDiagonalLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <>
      {/* Diagonal accent overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[200%] h-32 bg-gradient-to-r from-emerald-500/30 to-cyan-500/20 -rotate-12 origin-top-left"
          style={{ top: '40%', left: '-50%' }}
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between relative z-10">
        {/* Top */}
        <div>
          <div className={cn('flex items-center gap-2 mb-2', cfg.badge, 'w-fit px-3 py-1.5 rounded-full')}>
            <span className="text-sm">{activityIcons[data.activityType]}</span>
            <span className={cn('font-semibold tracking-wide uppercase', cfg.badgeText, isMini ? 'text-[8px]' : 'text-xs')}>{data.activityType}</span>
          </div>
          <h2 className={cn('font-bold leading-tight tracking-tight', cfg.text, isMini ? 'text-lg' : 'text-3xl')}>{data.title}</h2>
        </div>

        {/* Center: big distance */}
        <div className="flex items-baseline gap-2">
          <span className={cn('font-black tracking-tighter leading-none', cfg.stat, isMini ? 'text-5xl' : 'text-8xl')}>{data.distance}</span>
          <span className={cn('font-semibold tracking-wide uppercase', cfg.sub, isMini ? 'text-sm' : 'text-xl')}>km</span>
        </div>

        {/* Bottom: stats row */}
        <div className="flex items-center gap-4">
          <div>
            <div className={cn('font-bold', cfg.stat, isMini ? 'text-base' : 'text-xl')}>{data.duration}</div>
            <div className={cn('font-medium', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>Duration</div>
          </div>
          <div>
            <div className={cn('font-bold', cfg.stat, isMini ? 'text-base' : 'text-xl')}>{data.pace}</div>
            <div className={cn('font-medium', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>Pace</div>
          </div>
          <div className="ml-auto">
            <div className={cn('font-medium tracking-widest uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{data.date}</div>
          </div>
        </div>
      </div>
    </>
  )
}

// NEW: Floating stats - floating cards over background
function FloatingStatsLayout({ data, cfg, isMini }: { data: WorkoutData; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Top left: title card */}
      <div className={cn('self-start rounded-2xl p-3 backdrop-blur-sm max-w-[80%]', cfg.badge)}>
        <div className={cn('font-semibold tracking-widest uppercase mb-1', cfg.label, isMini ? 'text-[8px]' : 'text-[10px]')}>
          {data.activityType}
        </div>
        <h2 className={cn('font-bold leading-tight tracking-tight', cfg.text, isMini ? 'text-sm' : 'text-xl')}>{data.title}</h2>
      </div>

      {/* Center: main distance card */}
      <div className={cn('self-center rounded-3xl p-5 backdrop-blur-md text-center', cfg.badge)}>
        <div className={cn('font-black tracking-tighter leading-none', cfg.stat, isMini ? 'text-4xl' : 'text-7xl')}>{data.distance}</div>
        <div className={cn('font-medium mt-1 tracking-wide', cfg.sub, isMini ? 'text-[10px]' : 'text-sm')}>kilometers</div>
      </div>

      {/* Bottom: floating stat pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <FloatingPill value={data.duration} label="time" cfg={cfg} isMini={isMini} />
        <FloatingPill value={data.pace} label="pace" cfg={cfg} isMini={isMini} />
        <FloatingPill value={data.calories} label="kcal" cfg={cfg} isMini={isMini} />
      </div>

      {/* Date badge */}
      <div className="absolute bottom-4 right-4">
        <div className={cn('px-2 py-1 rounded-full backdrop-blur-sm', cfg.badge)}>
          <span className={cn('font-medium tracking-widest uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{data.date}</span>
        </div>
      </div>
    </div>
  )
}

function FloatingPill({ value, label, cfg, isMini }: { value: string; label: string; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className={cn('flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-sm', cfg.badge)}>
      <span className={cn('font-bold', cfg.stat, isMini ? 'text-xs' : 'text-sm')}>{value}</span>
      <span className={cn('font-medium', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{label}</span>
    </div>
  )
}

function StatItem({ value, label, cfg, isMini }: { value: string; label: string; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={cn('font-bold tracking-tight leading-none', cfg.stat, isMini ? 'text-sm' : 'text-xl')}>{value}</span>
      <span className={cn('font-medium tracking-wide uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{label}</span>
    </div>
  )
}

function StatItemCenter({ value, label, cfg, isMini }: { value: string; label: string; cfg: LayoutConfig; isMini: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={cn('font-bold tracking-tight leading-none', cfg.stat, isMini ? 'text-sm' : 'text-xl')}>{value}</span>
      <span className={cn('font-medium tracking-wide uppercase', cfg.label, isMini ? 'text-[8px]' : 'text-xs')}>{label}</span>
    </div>
  )
}

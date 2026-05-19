import { Clock3, Grid2x2, Plus } from 'lucide-react'
import type { NavTab } from '../../types/workout'

type BottomNavProps = {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

const tabs: Array<{ id: NavTab; label: string; icon: typeof Plus }> = [
  { id: 'create', label: 'Create', icon: Plus },
  { id: 'templates', label: 'Templates', icon: Grid2x2 },
  { id: 'history', label: 'History', icon: Clock3 },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: 'calc(var(--safe-area-bottom) + 12px)' }}
    >
      <div className="mb-1 flex w-full max-w-sm items-center rounded-3xl border border-white/10 bg-slate-950/90 px-2 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={
                isActive
                  ? 'flex flex-1 flex-col items-center gap-1 rounded-2xl bg-emerald-400/15 px-3 py-2 text-emerald-300 transition-all'
                  : 'flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-slate-500 transition-all hover:text-white'
              }
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

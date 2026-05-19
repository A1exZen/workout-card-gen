import { useEffect } from 'react'
import { Activity, Clock3, History, Home, Sparkles } from 'lucide-react'
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { usePersistedImageBackgrounds } from './hooks/usePersistedImageBackgrounds'
import { LandingPage } from './pages/LandingPage'
import { EditorPage } from './pages/EditorPage'
import { HistoryPage } from './pages/HistoryPage'
import { useWorkoutStore } from './store/useWorkoutStore'

const navigation = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/app', label: 'Editor', icon: Sparkles, end: false },
  { to: '/history', label: 'History', icon: History, end: false },
]

function AppShell() {
  const location = useLocation()
  const notice = useWorkoutStore((state) => state.notice)
  const clearNotice = useWorkoutStore((state) => state.clearNotice)

  usePersistedImageBackgrounds()

  useEffect(() => {
    if (!notice) {
      return
    }

    const timeout = window.setTimeout(() => clearNotice(), 2200)
    return () => window.clearTimeout(timeout)
  }, [clearNotice, notice])

  if (location.pathname === '/app') {
    return (
      <>
        {notice ? (
          <div className="pointer-events-none fixed inset-x-0 top-16 z-[60] flex justify-center px-4">
            <div className="rounded-full border border-cyan-400/30 bg-slate-950/90 px-4 py-2 text-sm text-cyan-100 shadow-lg backdrop-blur-xl">
              {notice}
            </div>
          </div>
        ) : null}
        <Routes>
          <Route path="/app" element={<EditorPage />} />
        </Routes>
      </>
    )
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-4 sm:px-6">
      <header className="sticky top-3 z-30 mb-6 rounded-[28px] border border-white/10 bg-slate-950/75 px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#d9ff7a,#4bd3ff)] text-slate-950">
              <Activity className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-lime-200/90 uppercase">
                Pace Studio
              </p>
              <p className="text-sm text-slate-300">Workout Card Generator</p>
            </div>
          </NavLink>

          <nav className="grid grid-cols-3 gap-2" aria-label="Primary">
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/0 bg-white/[0.03] text-slate-400 hover:border-white/10 hover:text-white',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {notice ? (
        <div className="pointer-events-none sticky top-28 z-30 mb-5 flex justify-center">
          <div className="rounded-full border border-cyan-400/30 bg-slate-950/90 px-4 py-2 text-sm text-cyan-100 shadow-lg backdrop-blur-xl">
            {notice}
          </div>
        </div>
      ) : null}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>

      <footer className="mt-8 flex flex-col items-start justify-between gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-slate-400 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          <span>Mobile-first PWA editor for fast social-ready workout cards.</span>
        </div>
        <p>Tailwind + Zustand + React Router + html-to-image</p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

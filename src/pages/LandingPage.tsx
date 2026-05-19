import { ArrowDownToLine, ArrowRight, Layers3, Smartphone, Sparkles, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { defaultWorkout, exportSizeLabels, templateCatalog } from '../data/templates'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import type { ExportSize } from '../types/workout'
import { WorkoutCardPreview } from '../components/card/WorkoutCardPreview'

const previewSizes: ExportSize[] = ['portrait', 'square', 'story', 'portrait']

export function LandingPage() {
  const { canInstall, triggerInstall } = useInstallPrompt()

  return (
    <div className="space-y-5">
      <section className="grid gap-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:grid-cols-[0.96fr_1.04fr] lg:p-8">
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime-200/90">
            Fast → Beautiful → Customizable → Shareable
          </p>
          <h1 className="max-w-[12ch] text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            Generate premium workout cards in under a minute.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-300">
            Mobile-first creator for runners, cyclists, and walkers who want polished social
            exports without the analytics clutter.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d9ff7a,#4bd3ff)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Create your workout card
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20"
              href="#templates"
            >
              Browse templates
              <Layers3 className="h-4 w-4" />
            </a>
            {canInstall ? (
              <button
                type="button"
                onClick={() => {
                  void triggerInstall()
                }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:-translate-y-0.5 hover:border-emerald-400/40"
              >
                Install app
                <ArrowDownToLine className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {!canInstall ? (
            <p className="text-sm text-slate-400">
              Install prompt appears automatically on supported mobile browsers after a little usage.
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <strong className="block text-3xl font-semibold tracking-[-0.05em] text-white">4</strong>
              <span className="mt-2 block text-sm text-slate-400">distinct template families</span>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <strong className="block text-3xl font-semibold tracking-[-0.05em] text-white">3</strong>
              <span className="mt-2 block text-sm text-slate-400">export ratios for social media</span>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <strong className="block text-3xl font-semibold tracking-[-0.05em] text-white">0</strong>
              <span className="mt-2 block text-sm text-slate-400">accounts required for MVP</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="grid w-full max-w-[520px] gap-4 sm:grid-cols-2">
            {templateCatalog.map((template, index) => (
              <div
                key={template.id}
                className={
                  index === 2
                    ? 'translate-y-6 rotate-[5deg] sm:translate-y-8'
                    : index === 1
                      ? 'rotate-[4deg]'
                      : '-rotate-[4deg]'
                }
              >
                <WorkoutCardPreview
                  workout={defaultWorkout}
                  templateId={template.id}
                  layoutId={index === 0 ? 'classic' : index === 1 ? 'hero-center' : index === 2 ? 'minimal' : 'floating-stats'}
                  background={template.defaultBackground}
                  exportSize={previewSizes[index]}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <FeatureCard icon={Zap} eyebrow="Built for speed" title="Live preview while you edit">
          Update title, pace, calories, template, and background in one flow. The card refreshes
          instantly.
        </FeatureCard>
        <FeatureCard icon={Sparkles} eyebrow="Visual variety" title="Layouts that feel genuinely different">
          Clean Apple-inspired, dark premium, bold gradient, and immersive story layouts cover
          different moods, not just different colors.
        </FeatureCard>
        <FeatureCard icon={Smartphone} eyebrow="Creator friendly" title="Export for every social surface">
          Story, square, and portrait ratios are ready for Instagram, Telegram, and quick sharing.
        </FeatureCard>
      </section>

      <section id="templates" className="space-y-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-200/90">Templates</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            Choose between moods, compositions, and typography hierarchies.
          </h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {templateCatalog.map((template, index) => (
            <article
              key={template.id}
              className="grid gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_240px]"
            >
              <div>
                <WorkoutCardPreview
                  workout={defaultWorkout}
                  templateId={template.id}
                  layoutId={index % 2 === 0 ? 'classic' : 'hero-center'}
                  background={template.defaultBackground}
                  exportSize={previewSizes[index]}
                />
              </div>
              <div className="flex flex-col justify-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">{template.eyebrow}</p>
                <h3 className="text-2xl font-semibold tracking-[-0.05em] text-white">{template.label}</h3>
                <span className="text-sm font-medium text-lime-200/90">{exportSizeLabels[previewSizes[index]]}</span>
                <p className="text-sm leading-6 text-slate-400">{template.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/[0.04] px-5 py-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-200/90">MVP direction</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
            Less like analytics software. More like a creator tool.
          </h2>
        </div>
        <Link
          to="/app"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#d9ff7a,#4bd3ff)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
        >
          Open editor
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: typeof Zap
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-cyan-300">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-200/90">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">{children}</p>
    </article>
  )
}

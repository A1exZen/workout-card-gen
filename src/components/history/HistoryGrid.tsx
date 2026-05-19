import { Copy, FolderOpen, Trash2 } from 'lucide-react'
import { templateCatalog } from '../../data/templates'
import { summarizeWorkout } from '../../lib/formatters'
import type { SavedCard } from '../../types/workout'
import { WorkoutCardPreview } from '../card/WorkoutCardPreview'

type HistoryGridProps = {
  cards: SavedCard[]
  onOpen: (card: SavedCard) => void
  onDuplicate: (card: SavedCard) => void
  onDeleteRequest: (card: SavedCard) => void
}

export function HistoryGrid({
  cards,
  onOpen,
  onDuplicate,
  onDeleteRequest,
}: HistoryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {cards.map((card) => {
        const template =
          templateCatalog.find((item) => item.id === card.templateId) ?? templateCatalog[0]

        return (
          <article
            key={card.id}
            className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl md:grid-cols-[180px_minmax(0,1fr)]"
          >
            <div className="self-start">
              <WorkoutCardPreview
                workout={card.workout}
                templateId={template.id}
                layoutId={card.layoutId}
                background={card.background}
                exportSize={card.exportSize}
                compact
              />
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-200/90">{template.label}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl">{card.workout.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{summarizeWorkout(card.workout)}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                <span>{new Date(card.createdAt).toLocaleDateString('en-US')}</span>
                <span className="capitalize">{card.exportSize}</span>
                <span className="capitalize">{card.layoutId.replace('-', ' ')}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20"
                  onClick={() => onOpen(card)}
                >
                  <FolderOpen className="h-4 w-4" />
                  Open
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20"
                  onClick={() => onDuplicate(card)}
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/15 bg-rose-400/[0.05] px-4 py-2.5 text-sm font-medium text-rose-100 transition hover:border-rose-400/30"
                  onClick={() => onDeleteRequest(card)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

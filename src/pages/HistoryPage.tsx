import { useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/useWorkoutStore'
import type { SavedCard } from '../types/workout'
import { HistoryGrid } from '../components/history/HistoryGrid'

export function HistoryPage() {
  const navigate = useNavigate()
  const cards = useWorkoutStore((state) => state.savedCards)
  const loadSavedCard = useWorkoutStore((state) => state.loadSavedCard)
  const duplicateCard = useWorkoutStore((state) => state.duplicateCard)
  const deleteCard = useWorkoutStore((state) => state.deleteCard)
  const [pendingDelete, setPendingDelete] = useState<SavedCard | null>(null)

  const openCard = (card: SavedCard) => {
    loadSavedCard(card)
    navigate('/app')
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/[0.04] px-5 py-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-200/90">Local history</p>
          <h1 className="mt-2 max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Saved cards stay on this device.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Reopen, duplicate, or delete saved layouts. Only the configuration is stored, not the
            generated image files.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#d9ff7a,#4bd3ff)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          onClick={() => navigate('/app')}
        >
          <Plus className="h-4 w-4" />
          New card
        </button>
      </section>

      {cards.length > 0 ? (
        <HistoryGrid
          cards={cards}
          onOpen={openCard}
          onDuplicate={duplicateCard}
          onDeleteRequest={setPendingDelete}
        />
      ) : (
        <section className="flex flex-col items-center gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-14 text-center shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-cyan-300">
            <Save className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-200/90">Nothing saved yet</p>
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">
            Create a card, save it, and it will appear here.
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d9ff7a,#4bd3ff)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            onClick={() => navigate('/app')}
          >
            <Plus className="h-4 w-4" />
            Open editor
          </button>
        </section>
      )}

      {pendingDelete ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-slate-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200/90">Delete card</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-white">
              Remove "{pendingDelete.workout.title}" from local history?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              This deletes the saved configuration from this device. Exported images are not affected.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-white/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCard(pendingDelete)
                  setPendingDelete(null)
                }}
                className="flex-1 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:border-rose-400/35"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

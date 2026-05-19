import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { defaultWorkout, templateCatalog } from '../data/templates'
import { createSavedCard, draftFromSavedCard, duplicateSavedCard } from '../lib/storage'
import type {
  BackgroundOption,
  EditorDraft,
  ImageFormat,
  LayoutId,
  SavedCard,
  TemplateId,
  WorkoutData,
} from '../types/workout'

type WorkoutStore = {
  draft: EditorDraft
  savedCards: SavedCard[]
  notice: string | null
  updateWorkout: (partial: Partial<WorkoutData>) => void
  setNotice: (notice: string | null) => void
  hydrateImageBackgrounds: (draftBackground: EditorDraft['background'], savedCards: SavedCard[]) => void
  setTemplate: (templateId: TemplateId) => void
  setLayout: (layoutId: LayoutId) => void
  setBackground: (background: BackgroundOption) => void
  setExportSize: (exportSize: EditorDraft['exportSize']) => void
  setImageFormat: (imageFormat: ImageFormat) => void
  saveDraft: () => void
  loadSavedCard: (card: SavedCard) => void
  duplicateCard: (card: SavedCard) => void
  deleteCard: (card: SavedCard) => void
  clearNotice: () => void
}

const defaultDraft: EditorDraft = {
  workout: defaultWorkout,
  templateId: 'apple-fitness',
  layoutId: 'classic',
  background: templateCatalog[0].defaultBackground,
  exportSize: 'portrait',
  imageFormat: 'png',
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      draft: defaultDraft,
      savedCards: [],
      notice: null,
      updateWorkout: (partial) =>
        set((state) => ({
          draft: {
            ...state.draft,
            workout: {
              ...state.draft.workout,
              ...partial,
            },
          },
        })),
      setNotice: (notice) => set({ notice }),
      hydrateImageBackgrounds: (draftBackground, savedCards) =>
        set((state) => ({
          draft: {
            ...state.draft,
            background: draftBackground,
          },
          savedCards,
        })),
      setTemplate: (templateId) => {
        const template = templateCatalog.find((item) => item.id === templateId) ?? templateCatalog[0]

        set((state) => ({
          draft: {
            ...state.draft,
            templateId,
            background: template.defaultBackground,
          },
        }))
      },
      setLayout: (layoutId) =>
        set((state) => ({
          draft: {
            ...state.draft,
            layoutId,
          },
        })),
      setBackground: (background) =>
        set((state) => ({
          draft: {
            ...state.draft,
            background,
          },
        })),
      setExportSize: (exportSize) =>
        set((state) => ({
          draft: {
            ...state.draft,
            exportSize,
          },
        })),
      setImageFormat: (imageFormat) =>
        set((state) => ({
          draft: {
            ...state.draft,
            imageFormat,
          },
        })),
      saveDraft: () =>
        set((state) => ({
          savedCards: [createSavedCard(state.draft), ...state.savedCards],
          notice: 'Card saved to local history.',
        })),
      loadSavedCard: (card) =>
        set((state) => ({
          draft: draftFromSavedCard(card, state.draft.imageFormat),
          notice: 'Saved card loaded into editor.',
        })),
      duplicateCard: (card) =>
        set((state) => ({
          savedCards: [duplicateSavedCard(card), ...state.savedCards],
          notice: 'Card duplicated.',
        })),
      deleteCard: (card) =>
        set((state) => ({
          savedCards: state.savedCards.filter((item) => item.id !== card.id),
          notice: 'Card removed from history.',
        })),
      clearNotice: () => set({ notice: null }),
    }),
    {
      name: 'workout-card-generator.store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        draft: state.draft,
        savedCards: state.savedCards,
      }),
    },
  ),
)

export function getSavedCardsCount() {
  return useWorkoutStore.getState().savedCards.length
}

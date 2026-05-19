import { templateCatalog } from '../data/templates'
import type { EditorDraft, ImageFormat, SavedCard } from '../types/workout'

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `card-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createSavedCard(draft: EditorDraft) {
  return {
    id: createId(),
    workout: draft.workout,
    templateId: draft.templateId,
    layoutId: draft.layoutId,
    background: draft.background,
    exportSize: draft.exportSize,
    createdAt: new Date().toISOString(),
  } satisfies SavedCard
}

export function duplicateSavedCard(card: SavedCard) {
  return {
    ...card,
    id: createId(),
    createdAt: new Date().toISOString(),
  } satisfies SavedCard
}

export function draftFromSavedCard(card: SavedCard, imageFormat: ImageFormat = 'png') {
  const fallbackTemplate = templateCatalog[0]

  return {
    workout: card.workout,
    templateId: (templateCatalog.find((template) => template.id === card.templateId)?.id ??
      fallbackTemplate.id),
    layoutId: card.layoutId ?? 'classic',
    background: card.background,
    exportSize: card.exportSize,
    imageFormat,
  } satisfies EditorDraft
}

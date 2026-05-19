import { useEffect } from 'react'
import { templateCatalog } from '../data/templates'
import {
  ensureImagePreviewUrl,
  pruneStoredImages,
  releaseUnusedImagePreviewUrls,
} from '../lib/imageStore'
import { useWorkoutStore } from '../store/useWorkoutStore'
import type { BackgroundOption, ImageBackground, SavedCard } from '../types/workout'

function isImageBackground(background: BackgroundOption): background is ImageBackground {
  return background.type === 'image'
}

function getTemplateFallback(templateId: SavedCard['templateId']) {
  return (
    templateCatalog.find((template) => template.id === templateId)?.defaultBackground ??
    templateCatalog[0].defaultBackground
  )
}

function getReferencedImageIds(draftBackground: BackgroundOption, savedCards: SavedCard[]) {
  const imageIds = new Set<string>()

  if (isImageBackground(draftBackground) && draftBackground.imageId) {
    imageIds.add(draftBackground.imageId)
  }

  savedCards.forEach((card) => {
    if (isImageBackground(card.background) && card.background.imageId) {
      imageIds.add(card.background.imageId)
    }
  })

  return imageIds
}

function sameBackground(left: BackgroundOption, right: BackgroundOption) {
  return (
    left.type === right.type &&
    left.value === right.value &&
    (!isImageBackground(left) || !isImageBackground(right) || left.imageId === right.imageId)
  )
}

async function resolveBackground(background: BackgroundOption, fallback: BackgroundOption) {
  if (!isImageBackground(background) || !background.imageId) {
    return isImageBackground(background) ? fallback : background
  }

  let previewUrl: string | null

  try {
    previewUrl = await ensureImagePreviewUrl(background.imageId)
  } catch {
    return fallback
  }

  if (!previewUrl) {
    return fallback
  }

  if (background.value === previewUrl) {
    return background
  }

  return {
    ...background,
    value: previewUrl,
  } satisfies BackgroundOption
}

export function usePersistedImageBackgrounds() {
  const draftBackground = useWorkoutStore((state) => state.draft.background)
  const draftTemplateId = useWorkoutStore((state) => state.draft.templateId)
  const savedCards = useWorkoutStore((state) => state.savedCards)
  const hydrateImageBackgrounds = useWorkoutStore((state) => state.hydrateImageBackgrounds)

  useEffect(() => {
    let active = true

    const hydrate = async () => {
      const nextDraftBackground = await resolveBackground(
        draftBackground,
        getTemplateFallback(draftTemplateId),
      )

      const nextSavedCards = await Promise.all(
        savedCards.map(async (card) => ({
          ...card,
          background: await resolveBackground(card.background, getTemplateFallback(card.templateId)),
        })),
      )

      if (!active) {
        const usedImageIds = getReferencedImageIds(nextDraftBackground, nextSavedCards)
        releaseUnusedImagePreviewUrls(usedImageIds)
        return
      }

      const cardsChanged =
        nextSavedCards.length !== savedCards.length ||
        nextSavedCards.some((card, index) => !sameBackground(card.background, savedCards[index]?.background))

      if (!sameBackground(nextDraftBackground, draftBackground) || cardsChanged) {
        hydrateImageBackgrounds(nextDraftBackground, nextSavedCards)
      }

      const usedImageIds = getReferencedImageIds(nextDraftBackground, nextSavedCards)
      releaseUnusedImagePreviewUrls(usedImageIds)
      void pruneStoredImages(usedImageIds).catch(() => undefined)
    }

    void hydrate()

    return () => {
      active = false
    }
  }, [draftBackground, draftTemplateId, hydrateImageBackgrounds, savedCards])
}

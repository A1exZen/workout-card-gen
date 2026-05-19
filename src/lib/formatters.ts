import type { ActivityType, BackgroundOption, ExportSize, WorkoutData } from '../types/workout'

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024

export const activityMeta: Record<
  ActivityType,
  { label: string; shortLabel: string; icon: string }
> = {
  run: { label: 'Run', shortLabel: 'RUN', icon: 'R' },
  ride: { label: 'Ride', shortLabel: 'RIDE', icon: 'C' },
  walk: { label: 'Walk', shortLabel: 'WALK', icon: 'W' },
}

export const exportSizeTitles: Record<ExportSize, string> = {
  story: 'Story',
  square: 'Square',
  portrait: 'Portrait',
}

export function formatDistance(distance: number) {
  return Number.isInteger(distance) ? distance.toFixed(0) : distance.toFixed(1)
}

export function formatCalories(calories?: number) {
  if (!calories) {
    return 'Optional'
  }

  return `${new Intl.NumberFormat('en-US').format(calories)} kcal`
}

export function getBackgroundStyle(background: BackgroundOption) {
  if (background.type === 'gradient') {
    return { backgroundImage: background.value }
  }

  if (background.type === 'image') {
    return {
      backgroundImage: `url(${background.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  return { backgroundColor: background.value }
}

export function summarizeWorkout(workout: WorkoutData) {
  return `${activityMeta[workout.activityType].label} • ${formatDistance(workout.distance)} km • ${workout.duration}`
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function sanitizeTextInput(value: string, maxLength: number) {
  return value.replace(/\s+/g, ' ').trimStart().slice(0, maxLength)
}

export function sanitizeDecimalInput(
  value: string,
  { maxIntegerDigits = 3, maxFractionDigits = 1 }: { maxIntegerDigits?: number; maxFractionDigits?: number } = {},
) {
  const normalized = value.replace(',', '.').replace(/[^\d.]/g, '')

  if (!normalized) {
    return ''
  }

  const hasDecimal = normalized.includes('.')
  const [rawInteger = '', ...rawFractionParts] = normalized.split('.')
  const integerPart = rawInteger.slice(0, maxIntegerDigits)
  const fractionPart = rawFractionParts.join('').slice(0, maxFractionDigits)

  if (!hasDecimal) {
    return integerPart
  }

  return fractionPart ? `${integerPart || '0'}.${fractionPart}` : `${integerPart || '0'}.`
}

export function sanitizeIntegerInput(value: string, maxDigits = 5) {
  return value.replace(/\D/g, '').slice(0, maxDigits)
}

export function sanitizeFileName(value: string, fallback = 'workout-card') {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || fallback
}

export function displayText(value: string, fallback: string) {
  const normalized = value.trim()
  return normalized || fallback
}

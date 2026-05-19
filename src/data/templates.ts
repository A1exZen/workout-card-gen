import type {
  ActivityType,
  BackgroundOption,
  ExportSize,
  LayoutId,
  TemplateId,
  WorkoutData,
} from '../types/workout'

export type TemplateDefinition = {
  id: TemplateId
  label: string
  eyebrow: string
  description: string
  accent: string
  defaultBackground: BackgroundOption
}

export type LayoutDefinition = {
  id: LayoutId
  label: string
  description: string
}

export const templateCatalog: TemplateDefinition[] = [
  {
    id: 'apple-fitness',
    label: 'Apple Fitness',
    eyebrow: 'clean white',
    description: 'Bright, spacious layout with a centered hero metric and subtle wellness energy.',
    accent: '#c5ff69',
    defaultBackground: {
      type: 'gradient',
      value: 'linear-gradient(160deg, #fefce8 0%, #f5f3ff 45%, #e0f2fe 100%)',
    },
  },
  {
    id: 'dark-minimal',
    label: 'Dark Minimal',
    eyebrow: 'premium black',
    description: 'Sharp typography and quiet contrast for sleek social posts.',
    accent: '#44f0b6',
    defaultBackground: {
      type: 'color',
      value: '#0b1020',
    },
  },
  {
    id: 'gradient-sport',
    label: 'Gradient Sport',
    eyebrow: 'energetic color',
    description: 'Bold gradients, punchy stats, and motion-led composition.',
    accent: '#88ffb7',
    defaultBackground: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #1233ff 0%, #00d3c8 45%, #d9ff7a 100%)',
    },
  },
  {
    id: 'story-mode',
    label: 'Story Mode',
    eyebrow: 'immersive vertical',
    description: 'Editorial overlay with cinematic framing tuned for stories.',
    accent: '#ff9966',
    defaultBackground: {
      type: 'gradient',
      value: 'linear-gradient(180deg, #130f24 0%, #301446 50%, #ff7d4d 100%)',
    },
  },
]

export const layoutCatalog: LayoutDefinition[] = [
  { id: 'classic', label: 'Classic', description: 'Traditional header and stat grid layout.' },
  { id: 'hero-center', label: 'Hero', description: 'Centered distance with surrounding support stats.' },
  { id: 'minimal', label: 'Minimal', description: 'Clean essentials-only composition.' },
  { id: 'photo-focus', label: 'Photo', description: 'Large background feel with a glass stat overlay.' },
  { id: 'corner-badge', label: 'Badge', description: 'Small activity badge with a bold lower hero metric.' },
  { id: 'bottom-strip', label: 'Strip', description: 'Stats collected in a bottom strip for cleaner top space.' },
  { id: 'split-diagonal', label: 'Diagonal', description: 'Angular composition with stronger motion cues.' },
  { id: 'floating-stats', label: 'Float', description: 'Floating stat blocks over the canvas.' },
]

export const solidBackgrounds: BackgroundOption[] = [
  { type: 'color', value: '#ffffff' },
  { type: 'color', value: '#f4f7fb' },
  { type: 'color', value: '#0b1020' },
  { type: 'color', value: '#141a2f' },
  { type: 'color', value: '#0d1117' },
  { type: 'color', value: '#1d1135' },
]

export const gradientBackgrounds: BackgroundOption[] = [
  {
    type: 'gradient',
    value: 'linear-gradient(160deg, #fefce8 0%, #f5f3ff 45%, #e0f2fe 100%)',
  },
  {
    type: 'gradient',
    value: 'linear-gradient(135deg, #1233ff 0%, #00d3c8 45%, #d9ff7a 100%)',
  },
  {
    type: 'gradient',
    value: 'linear-gradient(135deg, #231942 0%, #5e548e 45%, #ff7d4d 100%)',
  },
  {
    type: 'gradient',
    value: 'linear-gradient(135deg, #051937 0%, #004d7a 35%, #00bf72 100%)',
  },
  {
    type: 'gradient',
    value: 'linear-gradient(135deg, #2d1b69 0%, #11998e 55%, #f8ffae 100%)',
  },
  {
    type: 'gradient',
    value: 'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)',
  },
]

export const exportSizeLabels: Record<ExportSize, string> = {
  story: '9:16',
  square: '1:1',
  portrait: '4:5',
}

export const activityOptions: { id: ActivityType; label: string }[] = [
  { id: 'run', label: 'Run' },
  { id: 'ride', label: 'Ride' },
  { id: 'walk', label: 'Walk' },
]

export const defaultWorkout: WorkoutData = {
  title: 'Morning Recharge',
  activityType: 'run',
  distance: 10.2,
  duration: '52:14',
  pace: '5:07 /km',
  calories: 742,
  date: 'May 19, 2026',
}

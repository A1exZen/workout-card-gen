export type ActivityType = 'run' | 'ride' | 'walk'

export type TemplateId =
  | 'apple-fitness'
  | 'dark-minimal'
  | 'gradient-sport'
  | 'story-mode'

export type LayoutId =
  | 'classic'
  | 'hero-center'
  | 'minimal'
  | 'photo-focus'
  | 'corner-badge'
  | 'bottom-strip'
  | 'split-diagonal'
  | 'floating-stats'

export type ExportSize = 'story' | 'square' | 'portrait'

export type ImageFormat = 'png' | 'jpg'

export type BackgroundType = 'color' | 'gradient' | 'image'

export type NavTab = 'create' | 'templates' | 'history'

export type WorkoutData = {
  title: string
  activityType: ActivityType
  distance: number
  duration: string
  pace: string
  calories?: number
  date: string
}

export type ColorBackground = {
  type: 'color'
  value: string
}

export type GradientBackground = {
  type: 'gradient'
  value: string
}

export type ImageBackground = {
  type: 'image'
  value: string
  imageId?: string
}

export type BackgroundOption = ColorBackground | GradientBackground | ImageBackground

export type EditorDraft = {
  workout: WorkoutData
  templateId: TemplateId
  layoutId: LayoutId
  background: BackgroundOption
  exportSize: ExportSize
  imageFormat: ImageFormat
}

export type SavedCard = {
  id: string
  workout: WorkoutData
  templateId: TemplateId
  layoutId: LayoutId
  background: BackgroundOption
  exportSize: ExportSize
  createdAt: string
}

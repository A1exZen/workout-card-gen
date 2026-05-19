# Workout Card Generator — Tech Specification (MVP)

# 1. Product Overview

Workout Card Generator is a mobile-first PWA/web application for creating beautiful social-media-ready workout cards.

The application is focused on:

* running
* cycling
* walking
* fitness activity sharing

The product is NOT:

* a workout tracker
* an analytics platform
* a social network

The core purpose is:

* fast card creation
* aesthetic presentation
* simple customization
* social-media-ready export

---

# 2. Product Vision

The application helps users quickly generate premium-looking workout cards without:

* VPN usage
* complicated analytics
* paid subscription limitations
* overloaded interfaces

Main value proposition:

```txt
Fast → Beautiful → Customizable → Shareable
```

The product should feel:

* modern
* lightweight
* intuitive
* visually premium

The application should feel more like:

* Canva
* Apple Fitness
* modern creator tools

rather than:

* Strava analytics
* Garmin dashboards
* technical sports software

---

# 3. Target Audience

Primary users:

* runners
* cyclists
* fitness beginners
* users posting workout progress on social media

Especially:

* users from regions where Strava works poorly
* users wanting beautiful exports
* users preferring simple UI/UX

---

# 4. MVP Goal

The first version should do one thing extremely well:

```txt
Generate beautiful workout cards.
```

Main user flow:

```txt
Open app
→ Enter workout data
→ Choose template
→ Customize appearance
→ Export image
→ Share
```

The application should allow users to generate visually appealing workout cards in under one minute.

---

# 5. Platform

## MVP Platform

```txt
PWA (Progressive Web App)
```

Reasons:

* easy deployment
* works on mobile and desktop
* installable on phones
* no App Store publishing required
* easy sharing via URL
* frontend-only architecture
* fast iteration and deployment

---

# 6. Design Direction

## Main Style

The application should follow:

* Apple Fitness inspired design
* modern minimalism
* premium visual language
* clean typography
* soft gradients
* elegant spacing
* rounded corners
* subtle shadows

The application should feel:

* minimal
* energetic
* modern
* emotional
* premium
* social-media-friendly

---

# 7. Core MVP Features

## 7.1 Workout Data Input

User can manually enter:

* activity type
* distance
* duration
* pace
* calories
* date
* workout title

Supported activity types:

* Run
* Ride
* Walk

---

## 7.2 Card Templates

Initial templates:

* Apple Fitness style
* Dark minimal
* Gradient sport
* Story mode

Templates should not be visually repetitive.

The application should provide different layout formats, not only color variations.

Example template types:

* large photo/background focus with small text at the bottom
* minimal stats-only layout
* large distance-focused layout
* split layout with image and metrics
* story-style layout for Instagram
* clean white Apple Fitness style
* dark premium layout
* gradient sport layout

Templates should differ by:

* composition
* typography hierarchy
* metric placement
* image/background usage
* mood/style
* export format adaptation

The user should feel that they are choosing between genuinely different designs, not just changing colors.

The application should provide a broad variety of visual presentation formats similar to the premium sharing customization available in Strava.

---

## 7.3 Background Customization

Supported:

* solid colors
* gradients

Planned later:

* image upload
* video backgrounds

---

## 7.4 Export

Supported export formats:

* PNG
* JPG

Supported aspect ratios:

* Story (9:16)
* Square (1:1)
* Portrait (4:5)

Exported images should be:

* crisp
* high-resolution
* optimized for social media sharing

---

## 7.5 History

Users can:

* save cards
* reopen cards
* duplicate cards
* delete cards

Storage method:

* localStorage

Only card settings are stored, not generated images.

---

# 8. Features Excluded From MVP

The following features are intentionally postponed:

* authentication
* backend
* database
* social feed
* followers/comments
* cloud sync
* payments
* AI features
* Strava API integration
* GPX/TCX parsing
* route maps
* workout synchronization

---

# 9. Technical Stack

## Frontend

```txt
React
Vite
TypeScript
Tailwind CSS
```

## Routing

```txt
React Router
```

## State Management

```txt
useState
or Zustand
```

## Export Generation

```txt
html-to-image
```

## Icons

```txt
lucide-react
```

## PWA Support

```txt
vite-plugin-pwa
```

## Deployment

```txt
Vercel
```

---

# 10. Application Routes

```txt
/           → Landing page
/app        → Card editor
/history    → Saved cards
```

---

# 11. Project Architecture

## Folder Structure

```txt
src/
  app/
    App.tsx
    router.tsx

  pages/
    LandingPage.tsx
    EditorPage.tsx
    HistoryPage.tsx

  components/
    layout/
    editor/
    card/
    history/

  lib/
    storage.ts
    exportImage.ts
    formatters.ts

  data/
    templates.ts

  types/
    workout.ts
```

---

# 12. Main Components

## Editor Components

* WorkoutForm
* TemplateSelector
* BackgroundSelector
* ExportSizeSelector
* ExportButton
* SaveButton

## Card Components

* WorkoutCardPreview
* AppleFitnessCard
* GradientCard
* MinimalCard

## History Components

* HistoryGrid
* HistoryCard

---

# 13. Data Models

## WorkoutData

```ts
type WorkoutData = {
  title: string
  activityType: "run" | "ride" | "walk"
  distance: number
  duration: string
  pace: string
  calories?: number
  date: string
}
```

## SavedCard

```ts
type SavedCard = {
  id: string
  workout: WorkoutData
  templateId: string
  background: {
    type: "color" | "gradient"
    value: string
  }
  exportSize: "story" | "square" | "portrait"
  createdAt: string
}
```

---

# 14. Technical User Flow

```txt
User opens /app
→ form loads default workout data
→ user edits workout information
→ live preview updates instantly
→ user selects template
→ preview rerenders
→ user exports PNG
→ image downloads
→ user saves card
→ card saved in localStorage
```

---

# 15. Export Logic

The application generates images from the rendered card component using:

```txt
html-to-image
```

Export flow:

```txt
WorkoutCardPreview ref
→ convert DOM to PNG
→ trigger download
```

---

# 16. Storage Logic

MVP storage approach:

```txt
localStorage
```

Stored:

* workout data
* template settings
* export settings
* card configuration

Not stored:

* generated images
* large media files

---

# 17. Mobile UX

The application is mobile-first.

Main priorities:

* thumb-friendly controls
* large touch targets
* minimal steps
* smooth interactions
* instant visual feedback

Desktop layout:

* split editor + preview

Mobile layout:

* preview on top
* controls below

---

# 18. Landing Page Structure

Sections:

* Hero section
* App preview mockups
* Features section
* Template previews
* CTA section

Main CTA:

```txt
Create your workout card
```

Landing page purpose:

* explain the product quickly
* visually demonstrate templates
* drive users into the editor

---

# 19. Future Roadmap

## v1.1

* image background upload
* more templates
* improved history page
* editable saved cards

## v2

* GPX/TCX import
* route rendering
* Strava integration
* activity parsing

## v3

* cloud sync
* accounts
* saved presets
* public template gallery
* social/community features

---

# 20. Deployment Strategy

Deployment flow:

```txt
GitHub
→ Vercel
→ Public PWA URL
```

The application should:

* work without VPN
* be globally accessible
* support mobile installation as PWA
* load quickly on mobile devices

---

# 21. Product Philosophy

The application should feel:

```txt
More like Canva
Less like Strava
```

Focus:

* aesthetics
* simplicity
* speed
* emotion
* visual storytelling

Not:

* technical analytics
* sports science
* complex tracking dashboards

Card templates are one of the core product values.

The application should focus on giving users beautiful and diverse workout-sharing formats, not just basic metric cards.

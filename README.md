# pace

Minimal modern PWA for creating beautiful workout cards for social media.

Inspired by Apple Fitness, modern creator tools, and clean mobile-first UI/UX.

---

# ✨ Features

* Create workout cards in seconds
* Apple Fitness inspired UI
* Multiple unique template styles
* Running / Cycling / Walking support
* Live card preview
* PNG/JPG export
* Story / Square / Portrait formats
* Mobile-first experience
* PWA support
* Local card history
* Fast frontend-only architecture

---

# 🎯 Product Vision

pace is not a workout tracker or analytics dashboard.

The application focuses on:

* aesthetics
* simplicity
* customization
* social sharing

The goal is to make workout sharing:

* fast
* beautiful
* intuitive
* accessible without VPN or paid subscriptions

---

# 🧩 Tech Stack

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS

## Additional Libraries

* React Router
* Zustand
* html-to-image
* lucide-react
* vite-plugin-pwa

## Deployment

* Vercel

---

# 📱 MVP Features

## Workout Input

Users can manually enter:

* activity type
* distance
* duration
* pace
* calories
* date
* title

---

## Templates

Different visual formats:

* Apple Fitness
* Minimal
* Gradient sport
* Story layouts
* Image-focused layouts
* Large-stat layouts

Templates differ by:

* composition
* typography
* spacing
* metric placement
* visual mood

---

## Export

Supported formats:

* PNG
* JPG

Supported ratios:

* 9:16 Story
* 1:1 Square
* 4:5 Portrait

---

## History

Local card history using:

* localStorage

Users can:

* save cards
* reopen cards
* duplicate cards
* delete cards

---

# 🗂 Project Structure

```txt
src/
  app/
  pages/
  components/
  lib/
  data/
  types/
```

---

# 🚀 Development

## Install dependencies

```bash
npm install
```

## Run development server

```bash
npm run dev
```

## Build project

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

---

# 🌍 Deployment

The project is optimized for:

* Vercel
* PWA installation
* mobile-first usage

Deployment flow:

```txt
GitHub → Vercel → Public PWA URL
```

---

# 🛣 Roadmap

## v1

* Workout card generator
* Export
* Templates
* History

## v1.1

* Image backgrounds
* More templates
* Improved editor

## v2

* GPX/TCX import
* Route rendering
* Strava integration

## v3

* Cloud sync
* Accounts
* Community features

---

# 🎨 Design Philosophy

pace should feel:

```txt
More like Canva
Less like Strava
```

Focus:

* minimalism
* emotion
* aesthetics
* speed
* premium mobile UX

---

# 📄 License

MIT

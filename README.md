# 🎬 Innopolis Student Life — 6-Minute Programmatic Video Edit

An automated, high-energy 6-minute video edit of the "Life of Innopolis University Students" documentary built entirely with **React**, **Remotion**, and **TypeScript**.

![Remotion](https://img.shields.io/badge/Remotion-v4.0-blue?style=flat-square)
![React](https://img.shields.io/badge/React-v18.3-61dafb?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-3178c6?style=flat-square)

---

## 📺 Watch Final Video Player

<div align="center">
  <a href="https://drive.google.com/file/d/1bkbnZTs_SMliLmCp7Za0bgebg0L0vApU/view?usp=drive_link" target="_blank">
    <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b56e-0d88afbcfe4e.png" alt="Watch Final Video" width="700px" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
    <br>
    <h2>▶ Click Here to Play the Final 6-Minute Video (Google Drive)</h2>
  </a>
</div>

---

## ⚡ Highlights & Features

- **🎬 Seamless Clip Transitions**: Overlapping clip cuts with smooth cross-dissolves, motion blur sweeps, and cubic Bezier audio crossfades for a broadcast-quality feel.
- **✨ Kinetic Typography & Motion**: 3D title reveals, chapter intro cards with particle fields, and responsive pop-in stickers with elastic bounce.
- **📊 Glassmorphic Progress HUD**: Real-time chapter progress bar, active time remaining display, and an animated audio wave visualizer.
- **💎 Animated Vector Icons**: Integrated `lucide-react` icons with floating physics, glow pulses, and rotating dashed border badges.
- **💰 Animated Fact Cards & Counters**: Highlighting student scholarships, tuition, dorm life, and university stats with live counting animations.
- **⚔️ "Myth vs. Reality" Matrix**: Interactive comparison cards with animated status badges.

---

## 📁 Project Architecture

```
.
├── src/
│   ├── Edit.tsx        # Core Remotion composition (overlays, transitions, graphics)
│   ├── timeline.ts     # EDL parser & frame-accurate insert positioning logic
│   ├── edl.json        # Cut sheet mapping (25 FPS source cut points)
│   ├── Root.tsx        # Remotion Root composition registration
│   └── index.ts        # Entry point
├── public/
│   └── source.mp4      # Original source video (add manually)
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18+) installed.

### 2. Add Source Video
Place the raw source video inside the `public/` directory and name it `source.mp4`:
```bash
public/source.mp4
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Preview in Remotion Studio
Launch the interactive editor with live preview:
```bash
npx remotion studio src/index.ts
```

### 5. Render Video
To export the final 6-minute video file (`.mp4`):
```bash
npx remotion render src/index.ts InnopolisEdit out/innopolis-6min.mp4
```

---

## 🛠️ Stack & Technologies

- [Remotion](https://www.remotion.dev/) — Programmatic video editing in React
- [React 18](https://react.dev/) — UI & Animation state
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Lucide React](https://lucide.dev/) — Modern vector icons

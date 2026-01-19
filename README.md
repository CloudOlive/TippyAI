# TippyAI

A clean, mobile-friendly tip calculator for small groups (2-10 people).  
Built with React + Vite.

## Features
- Bill input with tip presets and custom tip option
- Pre-tax tip toggle with tax field
- Named splits, unequal adjustments, and rounding options
- Cash tip helper mode
- Share breakdown (copies to clipboard)
- Light/dark mode toggle

## Getting Started
```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173/`).

## Tests
```bash
npm test
```

## Project Structure
- `src/App.jsx` — app shell and theme toggle
- `src/components/` — UI components
- `src/utils/calc.js` — calculation helpers
- `src/styles.css` — global styles

## Notes
- Designed for mobile-first usage in restaurant settings.

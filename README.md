# Caroline's 60th Birthday Invitation

An interactive 3D web invitation featuring a curry model with a creative "Spicy Spin Reveal" interaction.

## Tech Stack

- **Frontend**: React + Vite
- **3D**: Three.js + React Three Fiber
- **Animation**: GSAP + Framer Motion
- **Styling**: Tailwind CSS
- **Backend**: Vercel Serverless Functions + Google Sheets API

## Getting Started

### Prerequisites

- Node.js 22+ (currently using v22.8.0)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── components/
│   ├── Scene/          # 3D scene components
│   ├── UI/             # User interface components
│   └── Effects/        # Post-processing effects
├── hooks/              # Custom React hooks
├── utils/              # Utilities and constants
└── api/                # API client code

public/
├── models/             # 3D GLB models (add curry.glb here)
└── sounds/             # Audio files
```

## Next Steps

1. **Add the curry model**: Place `curry.glb` file in `public/models/`
2. **Add audio files**: Place sound files in `public/sounds/`
3. **Update event details**: Edit `src/utils/constants.js` with date/time
4. **Set up Google Sheets**: Follow Phase 7 in the implementation plan

## Development Progress

- [x] Phase 1: Project initialization and setup
- [ ] Phase 2: 3D model integration
- [ ] Phase 3: Spin interaction
- [ ] Phase 4: Reveal animation
- [ ] Phase 5: Audio integration
- [ ] Phase 6: UI components
- [ ] Phase 7: Google Sheets backend
- [ ] Phase 8: Polish & effects
- [ ] Phase 9: Optimization
- [ ] Phase 10: Deployment

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes

- The 3D scene currently shows a placeholder cube until the curry model is added
- Environment variables are needed for Google Sheets integration (Phase 7)
- Audio files should be royalty-free and compressed to ~128kbps MP3

## License

Private project for Caroline's birthday celebration

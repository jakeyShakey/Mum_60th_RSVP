// Event Details
export const EVENT_DETAILS = {
  name: "Caroline's 60th Birthday",
  date: "Saturday, February 7th, 2026", // User can update this later
  time: "6:00pm", // User can update this later
  venue: {
    name: "The Angle Spice",
    location: "Stilton",
  },
  note: "Delicious food provided and very special entertainment!",
};

// Colors
export const COLORS = {
  background: {
    initial: '#000000',
    transition1: '#1a0000',
    transition2: '#330000',
    final: '#661100',
  },
  particles: {
    steam: '#ffffff',
    spice: '#ff6b35',
    gold: '#f4a261',
  },
  ui: {
    primary: '#ff6b35',
    secondary: '#f4a261',
    text: '#ffffff',
    textDark: '#000000',
  },
};

// Animation Timings (in seconds)
export const TIMINGS = {
  spinDuration: 2,
  revealDuration: 3,
  particleExplosion: 1.5,
  textStagger: 0.1,
};

// 3D Configuration
export const SCENE_CONFIG = {
  camera: {
    position: [0, 0, 5],
    fov: 75,
  },
  model: {
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  particles: {
    count: {
      desktop: 1000,
      mobile: 500,
    },
    size: 0.05,
  },
};

// Performance Settings
export const PERFORMANCE = {
  detectMobile: () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  detectLowEnd: () => navigator.hardwareConcurrency <= 4,
  getParticleCount: function() {
    if (this.detectMobile()) return SCENE_CONFIG.particles.count.mobile;
    return SCENE_CONFIG.particles.count.desktop;
  },
};

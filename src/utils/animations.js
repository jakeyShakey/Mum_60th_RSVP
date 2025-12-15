import gsap from 'gsap';
import { COLORS, TIMINGS } from './constants';

/**
 * GSAP Animation Timelines for the Spicy Spin Reveal
 */

/**
 * Reveal animation sequence triggered when spin completes
 * @param {Object} params - Animation parameters
 * @param {THREE.Camera} params.camera - Three.js camera for camera animations
 * @param {HTMLElement} params.backgroundEl - Background element for color transitions
 * @param {Function} params.onComplete - Callback when animation completes
 * @returns {gsap.core.Timeline}
 */
export function createRevealTimeline({ camera, backgroundEl, onComplete }) {
  const tl = gsap.timeline({
    onComplete,
  });

  // 1. Brief pause for curry explosion to complete (explosion is now 0.8s)
  tl.to({}, { duration: 0.9 });

  // 2. Camera pulls back to reveal the "new realm"
  if (camera) {
    tl.to(
      camera.position,
      {
        z: 8, // Pull back further for more space
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }

  // 3. Background color transition to the final "realm"
  if (backgroundEl) {
    tl.to(
      backgroundEl,
      {
        backgroundColor: COLORS.background.final,
        duration: 1.8,
        ease: 'power2.out',
      },
      '-=1.0'
    );
  }

  return tl;
}

/**
 * Stagger animation for invitation text reveal
 * @param {string} containerSelector - CSS selector for text container
 * @param {Function} onComplete - Callback when animation completes
 * @returns {gsap.core.Timeline}
 */
export function createTextRevealTimeline(containerSelector, onComplete) {
  const tl = gsap.timeline({ onComplete });

  // Animate each line of text with stagger
  tl.from(`${containerSelector} > *`, {
    opacity: 0,
    y: 30,
    rotationX: -15,
    duration: 0.8,
    stagger: 0.15,
    ease: 'back.out(1.2)',
  });

  return tl;
}

/**
 * Particle explosion animation for reveal moment
 * @param {Object} particleSystem - Three.js particle system reference
 * @param {Function} onComplete - Callback when animation completes
 * @returns {gsap.core.Timeline}
 */
export function createParticleExplosionTimeline(particleSystem, onComplete) {
  const tl = gsap.timeline({ onComplete });

  if (!particleSystem) return tl;

  // Trigger explosion effect
  tl.to(particleSystem, {
    intensity: 2,
    duration: 0.5,
    ease: 'power4.out',
  }).to(particleSystem, {
    intensity: 0.3,
    duration: 1,
    ease: 'power2.inOut',
  });

  return tl;
}

/**
 * RSVP button entrance animation
 * @param {string} buttonSelector - CSS selector for RSVP button
 * @returns {gsap.core.Timeline}
 */
export function createRSVPButtonTimeline(buttonSelector) {
  const tl = gsap.timeline();

  tl.from(buttonSelector, {
    opacity: 0,
    scale: 0.8,
    y: 20,
    duration: 0.6,
    ease: 'back.out(1.7)',
  });

  return tl;
}

/**
 * Background gradient animation during spin progress
 * @param {HTMLElement} backgroundEl - Background element
 * @param {number} progress - Spin progress (0-1)
 */
export function animateBackgroundGradient(backgroundEl, progress) {
  if (!backgroundEl) return;

  // Interpolate between background colors based on progress
  const colors = COLORS.background;
  let targetColor;

  if (progress < 0.25) {
    targetColor = colors.initial;
  } else if (progress < 0.5) {
    targetColor = colors.transition1;
  } else if (progress < 0.75) {
    targetColor = colors.transition2;
  } else {
    targetColor = colors.final;
  }

  gsap.to(backgroundEl, {
    backgroundColor: targetColor,
    duration: 0.5,
    ease: 'power1.out',
  });
}

/**
 * Success celebration animation (confetti effect)
 * @param {string} containerSelector - CSS selector for container
 * @returns {gsap.core.Timeline}
 */
export function createCelebrationTimeline(containerSelector) {
  const tl = gsap.timeline();

  // Create a burst effect
  tl.from(`${containerSelector}`, {
    scale: 0.5,
    opacity: 0,
    duration: 0.4,
    ease: 'back.out(2)',
  });

  return tl;
}

/**
 * Automated click-to-spin animation for curry model
 * Triggers dramatic 3D tumbling spin that leads to explosion
 * @param {Object} params - Animation parameters
 * @param {THREE.Group} params.curryGroup - The curry 3D model group reference
 * @param {Function} params.onComplete - Callback when spin completes (triggers explosion)
 * @param {number} params.duration - Animation duration in seconds (default: 5.0)
 * @returns {gsap.core.Timeline}
 */
export function createClickSpinTimeline({
  curryGroup,
  onComplete,
  duration = 5.0,
}) {
  const tl = gsap.timeline({
    onComplete,
  });

  if (!curryGroup) return tl;

  // Rotation animation (3D tumble) - 5s slow, dramatic
  tl.to(curryGroup.rotation, {
    y: Math.PI * 6, // 3 full rotations on Y-axis
    x: Math.PI * 2.5, // 1.25 rotations on X-axis (stops just before flip for perfect top-down view)
    z: Math.PI * 1, // 0.5 rotation on Z-axis for extra tumble
    duration: duration * 0.8, // Most of the animation (4s)
    ease: 'power2.inOut',
  });

  // Scale animation (concurrent with rotation)
  tl.to(
    curryGroup.scale,
    {
      x: 2.0,
      y: 2.0,
      z: 2.0,
      duration: duration * 0.8, // 4 seconds
      ease: 'power2.out',
    },
    0 // Start at beginning
  );

  // Final acceleration before explosion (speed up dramatically)
  tl.to(
    curryGroup.rotation,
    {
      y: `+=${Math.PI * 2}`, // Extra full rotation (blur effect)
      x: `+=${Math.PI}`, // Extra half rotation
      duration: duration * 0.2, // Last 1 second
      ease: 'power4.in',
    },
    `-=${duration * 0.2}` // Overlap with end of main rotation
  );

  return tl;
}

/**
 * Custom GSAP confetti animation for RSVP success
 * @param {HTMLElement} container - Container element for confetti particles
 */
export function createConfettiAnimation(container) {
  // Detect mobile for reduced particle count
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 50 : 100;
  const colors = ['#FF6B35', '#F4A261', '#E9C46A', '#D62828'];

  // Create particle elements
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';

    container.appendChild(particle);
    particles.push(particle);
  }

  // Animate particles in explosion pattern
  particles.forEach((particle, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const velocity = 200 + Math.random() * 300;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 100; // Upward bias

    gsap
      .timeline()
      .to(particle, {
        x: tx,
        y: ty,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
      .to(
        particle,
        {
          y: `+=${500}`, // Fall down
          opacity: 0,
          duration: 1.5,
          ease: 'power2.in',
        },
        '-=0.2'
      )
      .call(() => {
        particle.remove(); // Cleanup
      });
  });
}

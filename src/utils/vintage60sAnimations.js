import gsap from 'gsap';

/**
 * Master vintage 1960s entrance animation timeline
 * Creates theatrical reveal with retro aesthetic
 *
 * @param {string} containerSelector - CSS selector for invitation container
 * @param {Function} onComplete - Callback when animation completes
 * @returns {gsap.core.Timeline}
 */
export function createVintage60sEntranceTimeline(containerSelector, onComplete) {
  const tl = gsap.timeline({ onComplete });

  // Set initial hidden states
  tl.set('.rsvp-button', { opacity: 0, scale: 0 });

  // ========================================
  // PHASE 1: GRAND ENTRANCE (0-1.8s)
  // ========================================

  // Giant "60" watermark scales in with elastic bounce
  tl.to('.giant-sixty', {
    opacity: 0.15,
    scale: 1,
    duration: 1.3,
    ease: 'elastic.out(1, 0.5)',
  }, 0.2);

  // Border frame fades in
  tl.to('.border-frame', {
    opacity: 1,
    duration: 1.0,
    ease: 'power1.inOut',
  }, 0.5);

  // ========================================
  // PHASE 2: TEXT CONTENT REVEAL (2.0-4.5s)
  // ========================================

  // Main headline with shimmer effect
  tl.from('.invitation-headline', {
    opacity: 0,
    y: -30,
    scale: 0.8,
    duration: 0.7,
    ease: 'back.out(1.4)',
  }, 2.0);

  // Add shimmer glow to headline
  tl.to('.invitation-headline', {
    textShadow: '0 0 30px rgba(255, 107, 53, 1), 3px 3px 0px rgba(139, 69, 19, 0.3), 6px 6px 10px rgba(0, 0, 0, 0.2)',
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
  }, 2.4);

  // First divider expands
  tl.to('.divider-ornament:nth-of-type(1)', {
    opacity: 1,
    scaleX: 1,
    duration: 0.5,
    ease: 'power2.out',
  }, 2.7);

  // Personalized greeting
  tl.from('.invitation-greeting', {
    opacity: 0,
    y: 20,
    scale: 0.9,
    duration: 0.6,
    ease: 'power2.out',
  }, 3.0);

  // Date & Time (staggered)
  tl.from('.invitation-datetime > *', {
    opacity: 0,
    x: -20,
    duration: 0.5,
    stagger: 0.15,
    ease: 'power2.out',
  }, 3.3);

  // Venue section
  tl.from('.invitation-venue', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power2.out',
  }, 3.7);

  // Second divider
  tl.to('.divider-ornament:nth-of-type(2)', {
    opacity: 1,
    scaleX: 1,
    duration: 0.4,
    ease: 'power2.out',
  }, 4.0);

  // Special note
  tl.from('.invitation-note', {
    opacity: 0,
    y: 10,
    scale: 0.95,
    duration: 0.5,
    ease: 'back.out(1.2)',
  }, 4.2);

  // ========================================
  // PHASE 3: CALL-TO-ACTION FINALE (4.7-5.5s)
  // ========================================

  // RSVP button with elastic bounce
  tl.to('.rsvp-button', {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    ease: 'elastic.out(1, 0.6)',
  }, 4.7);

  // Add glow pulse to button
  tl.to('.rsvp-button', {
    boxShadow: '0 0 40px rgba(255, 107, 53, 0.8), 0 0 80px rgba(255, 107, 53, 0.6), 0 4px 10px rgba(0, 0, 0, 0.3)',
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
  }, 5.0);

  // Final subtle settle
  tl.to(containerSelector, {
    scale: 0.98,
    duration: 0.2,
    ease: 'power1.inOut',
  }, 5.3)
  .to(containerSelector, {
    scale: 1,
    duration: 0.3,
    ease: 'elastic.out(1, 0.3)',
  });

  return tl;
}

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createVintage60sEntranceTimeline } from '../../utils/vintage60sAnimations';
import { EVENT_DETAILS } from '../../utils/constants';
import {
  GiantSixtyBackground,
  BorderFrame,
  DividerOrnament,
} from './VintageDecorations';

/**
 * InvitationCard component - Vintage 1960s Design
 * Displays party details with retro aesthetic and theatrical entrance
 */
export default function InvitationCard({ show = false, guestName, onRSVPClick }) {
  const containerRef = useRef();

  // Trigger vintage entrance animation when card appears
  useEffect(() => {
    if (show && containerRef.current) {
      createVintage60sEntranceTimeline('.invitation-container');
    }
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4 py-4 overflow-y-auto"
    >
      <div
        ref={containerRef}
        className="invitation-container relative pointer-events-auto
                   w-[min(90vw,700px)] rounded-lg my-auto"
        style={{
          background: 'radial-gradient(circle at center, #FFF8E7 0%, #FF8C42 100%)',
          boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
          padding: 'clamp(1.5rem, 4vw, 4rem)',
        }}
      >
        {/* ===== DECORATIVE LAYER ===== */}

        {/* Giant "60" Background Watermark */}
        <GiantSixtyBackground />

        {/* Border Frame */}
        <BorderFrame />

        {/* ===== CONTENT LAYER ===== */}

        <div className="relative z-10 text-center">
          {/* Main Headline */}
          <h1
            className="invitation-headline font-headline text-fluid-6xl
                       text-gradient-gold text-vintage-shadow leading-tight"
            style={{ marginBottom: 'clamp(1rem, 3vw, 2rem)' }}
          >
            {EVENT_DETAILS.name}
          </h1>

          {/* Divider 1 */}
          <DividerOrnament style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }} />

          {/* Personalized Greeting */}
          {guestName && (
            <p className="invitation-greeting font-script text-fluid-4xl
                          text-vintage-burgundy"
               style={{ marginBottom: 'clamp(1rem, 3vw, 2rem)' }}
            >
              You're invited, {guestName}!
            </p>
          )}

          {/* Date & Time */}
          <div className="invitation-datetime font-body text-fluid-3xl
                          text-vintage-brown font-semibold space-y-1"
               style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }}
          >
            <p>{EVENT_DETAILS.date}</p>
            <p>{EVENT_DETAILS.time}</p>
          </div>

          {/* Venue */}
          <div className="invitation-venue font-body text-fluid-2xl
                          text-vintage-burgundy"
               style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }}
          >
            <p className="font-bold mb-1">{EVENT_DETAILS.venue.name}</p>
            <p className="text-retro-gold font-medium">{EVENT_DETAILS.venue.location}</p>
          </div>

          {/* Divider 2 */}
          <DividerOrnament style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }} />

          {/* Special Note */}
          <p className="invitation-note font-body text-fluid-xl
                        text-retro-orange italic"
             style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}
          >
            {EVENT_DETAILS.note}
          </p>

          {/* RSVP Button */}
          <button
            onClick={onRSVPClick}
            className="rsvp-button font-body bg-gradient-to-r from-retro-orange to-retro-red
                       text-white rounded-full text-fluid-2xl font-bold
                       uppercase tracking-wider
                       hover:scale-105 active:scale-95 transition-transform
                       button-vintage-glow border-4 border-vintage-cream"
            style={{ 
              paddingLeft: 'clamp(2rem, 4vw, 2.5rem)',
              paddingRight: 'clamp(2rem, 4vw, 2.5rem)',
              paddingTop: 'clamp(1rem, 2.5vw, 1.25rem)',
              paddingBottom: 'clamp(1rem, 2.5vw, 1.25rem)',
            }}
          >
            RSVP Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

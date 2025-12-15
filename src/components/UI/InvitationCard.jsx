import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createTextRevealTimeline, createRSVPButtonTimeline } from '../../utils/animations';
import { EVENT_DETAILS } from '../../utils/constants';

/**
 * InvitationCard component - Displays party details after reveal
 */
export default function InvitationCard({ show = false, guestName, onRSVPClick }) {
  const cardRef = useRef();
  const buttonRef = useRef();

  // Trigger GSAP animations when card appears
  useEffect(() => {
    if (show && cardRef.current) {
      // Animate text reveal
      const textTl = createTextRevealTimeline('.invitation-content');

      // Animate RSVP button after text
      textTl.eventCallback('onComplete', () => {
        if (buttonRef.current) {
          createRSVPButtonTimeline('.rsvp-button');
        }
      });
    }
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
      <div
        ref={cardRef}
        className="invitation-content text-center pointer-events-auto max-w-2xl px-8"
      >
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-display text-white mb-6 text-shadow">
          {EVENT_DETAILS.name}
        </h1>

        {/* Personalized greeting */}
        {guestName && (
          <p className="text-2xl md:text-3xl text-curry-gold mb-6 font-semibold">
            You're invited, {guestName}!
          </p>
        )}

        {/* Date & Time */}
        <div className="text-2xl md:text-3xl text-spice-yellow mb-4">
          <p>{EVENT_DETAILS.date}</p>
          <p>{EVENT_DETAILS.time}</p>
        </div>

        {/* Venue */}
        <div className="text-xl md:text-2xl text-white mb-4">
          <p className="font-semibold">{EVENT_DETAILS.venue.name}</p>
          <p className="text-curry-gold">{EVENT_DETAILS.venue.location}</p>
        </div>

        {/* Special Note */}
        <p className="text-lg md:text-xl text-spice-orange mb-8 italic">
          {EVENT_DETAILS.note}
        </p>

        {/* RSVP Button */}
        <button
          ref={buttonRef}
          onClick={onRSVPClick}
          className="rsvp-button bg-gradient-to-r from-spice-orange to-spice-red text-white
                     px-8 py-4 rounded-full text-xl font-semibold
                     hover:scale-105 active:scale-95 transition-transform
                     shadow-lg hover:shadow-xl glow"
        >
          RSVP Now
        </button>
      </div>
    </motion.div>
  );
}

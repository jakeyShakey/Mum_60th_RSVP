import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { createConfettiAnimation } from '../../utils/animations';

/**
 * SuccessMessage component - Celebration screen after RSVP submission
 */
export default function SuccessMessage({ response, guestName, onClose }) {
  const confettiRef = useRef();
  const messageRef = useRef();

  const isAccepted = response === 'accepted';

  useEffect(() => {
    // Trigger confetti animation for accepted responses only
    if (isAccepted && confettiRef.current) {
      createConfettiAnimation(confettiRef.current);
    }

    // Animate message entrance with stagger
    if (messageRef.current) {
      gsap.from(messageRef.current.children, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(1.2)',
      });
    }
  }, [isAccepted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    >
      {/* Confetti container (only for accepted) */}
      {isAccepted && (
        <div
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        />
      )}

      <div ref={messageRef} className="relative text-center max-w-lg px-8">
        {/* Large emoji */}
        <div className="text-8xl mb-6">
          {isAccepted ? '🎉' : '😔'}
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-display text-white mb-4">
          {isAccepted ? 'Wonderful!' : "We'll miss you"}
        </h2>

        {/* Personalized message */}
        <p className="text-xl md:text-2xl text-curry-gold mb-8">
          {isAccepted
            ? `Can't wait to celebrate with you, ${guestName}!`
            : `Thanks for letting us know, ${guestName}.`}
        </p>

        {/* Additional info for accepted */}
        {isAccepted && (
          <p className="text-lg text-spice-yellow mb-8">
            We'll send you all the details soon!
          </p>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-spice-orange to-spice-red text-white
                   px-8 py-4 rounded-full text-lg font-semibold
                   hover:scale-105 active:scale-95 transition-transform
                   shadow-lg glow"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

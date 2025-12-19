import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { createVintage60sEntranceTimeline } from '../../utils/vintage60sAnimations';
import { submitRSVP } from '../../api/rsvpService';
import { EVENT_DETAILS } from '../../utils/constants';
import {
  GiantSixtyBackground,
  BorderFrame,
  DividerOrnament,
} from './VintageDecorations';

/**
 * Loading Spinner Component
 */
function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * FlippableCard component - Combines invitation (front) and RSVP form (back)
 */
export default function FlippableCard({ show = false, guestName, guestData, token }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [attendingCount, setAttendingCount] = useState(guestData?.partySize || 1);
  const [foodPreference, setFoodPreference] = useState('indian');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [localSubmittedData, setLocalSubmittedData] = useState(null);
  const containerRef = useRef();
  const frontRef = useRef();
  const backRef = useRef();

  // Update attendingCount when guestData loads
  useEffect(() => {
    if (guestData?.partySize) {
      setAttendingCount(guestData.partySize);
    }
  }, [guestData]);

  // Check if already submitted
  const rsvpStatus = typeof guestData?.rsvpStatus === 'string'
    ? guestData.rsvpStatus.toLowerCase()
    : 'pending';
  const hasSubmittedToServer = rsvpStatus !== 'pending' && rsvpStatus !== '' && rsvpStatus !== null;
  const hasLocalSubmission = localSubmittedData !== null;
  const hasSubmitted = hasSubmittedToServer || hasLocalSubmission;

  // Determine which data to display in read-only view
  const displayRsvpStatus = hasLocalSubmission ? localSubmittedData.rsvpStatus : rsvpStatus;
  const displayAttendingCount = hasLocalSubmission ? localSubmittedData.attendingCount : guestData?.attendingCount;
  const displayFoodPreference = hasLocalSubmission ? localSubmittedData.foodPreference : guestData?.foodPreference;

  const partySize = guestData?.partySize || 1;
  const isCouple = partySize > 1;

  // Trigger vintage entrance animation when card appears (front face only, once)
  useEffect(() => {
    if (show && containerRef.current && !isFlipped) {
      createVintage60sEntranceTimeline('.flippable-card-front .invitation-content');
    }
  }, [show, isFlipped]);

  // Animate RSVP form buttons when flipped to back
  useEffect(() => {
    if (isFlipped && backRef.current && !hasSubmitted) {
      gsap.from(backRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power2.out',
      });

      setTimeout(() => {
        gsap.from('.rsvp-button-option', {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.4,
          ease: 'power2.out',
        });
      }, 200);
    }
  }, [isFlipped, hasSubmitted]);

  // Animate accept form
  useEffect(() => {
    if (showAcceptForm) {
      gsap.from('.accept-form-fields', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [showAcceptForm]);

  /**
   * Handle flip to back (RSVP form)
   */
  const handleFlipToBack = () => {
    setIsFlipped(true);
  };

  /**
   * Handle flip back to front (invitation)
   */
  const handleFlipToFront = () => {
    setIsFlipped(false);
    setShowAcceptForm(false); // Reset form state when flipping back
  };

  /**
   * Handle Accept button click
   */
  const handleAcceptClick = () => {
    setShowAcceptForm(true);
  };

  /**
   * Handle Decline button click
   */
  const handleDeclineClick = async () => {
    if (hasSubmitted || hasAttemptedSubmit) return;

    setHasAttemptedSubmit(true);
    setIsSubmitting(true);

    try {
      await submitRSVP(token, 'declined', 0, null);

      // Store local submission data to trigger read-only view
      setLocalSubmittedData({
        rsvpStatus: 'declined',
        attendingCount: 0,
        foodPreference: null
      });

      // No auto-close - let user close manually
    } catch (error) {
      console.error('RSVP submission failed:', error);
      alert(`Failed to submit RSVP: ${error.message}\n\nPlease try again.`);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
    }
  };

  /**
   * Handle Submit RSVP
   */
  const handleSubmitRSVP = async () => {
    if (hasSubmitted || hasAttemptedSubmit) return;

    setHasAttemptedSubmit(true);
    setIsSubmitting(true);

    try {
      await submitRSVP(token, 'accepted', attendingCount, foodPreference);

      // Store local submission data to trigger read-only view
      setLocalSubmittedData({
        rsvpStatus: 'accepted',
        attendingCount: attendingCount,
        foodPreference: foodPreference
      });

      // No auto-close - let user close manually
    } catch (error) {
      console.error('RSVP submission failed:', error);
      alert(`Failed to submit RSVP: ${error.message}\n\nPlease try again.`);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
    }
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4 py-4 overflow-y-auto"
    >
      <div ref={containerRef} className="flippable-card-container pointer-events-auto my-auto">
        <div className={`flippable-card-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* ========== FRONT FACE: INVITATION ========== */}
          <div ref={frontRef} className="flippable-card-front">
            <div
              className="invitation-content relative w-full rounded-lg"
              style={{
                background: 'radial-gradient(circle at center, #FFF8E7 0%, #FF8C42 100%)',
                boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              }}
            >
              {/* Decorative Layer */}
              <GiantSixtyBackground />
              <BorderFrame />

              {/* Content Layer */}
              <div className="relative z-10 text-center">
                {/* Main Headline */}
                <h1
                  className="invitation-headline font-headline
                             text-gradient-gold text-vintage-shadow leading-tight"
                  style={{ 
                    fontSize: 'clamp(2.5rem, 10vw, 5rem)',
                    marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)' 
                  }}
                >
                  {EVENT_DETAILS.name}
                </h1>

                {/* Divider 1 */}
                <DividerOrnament style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)' }} />

                {/* Personalized Greeting */}
                {guestName && (
                  <p className="invitation-greeting font-script text-fluid-2xl
                                text-vintage-burgundy"
                     style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)' }}
                  >
                    You're invited, {guestName}!
                  </p>
                )}

                {/* Date & Time */}
                <div className="invitation-datetime font-body text-fluid-xl
                                text-vintage-brown font-semibold space-y-1"
                     style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)' }}
                >
                  <p>{EVENT_DETAILS.date}</p>
                  <p>{EVENT_DETAILS.time}</p>
                </div>

                {/* Venue */}
                <div className="invitation-venue font-body text-fluid-lg
                                text-vintage-burgundy"
                     style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)' }}
                >
                  <p className="font-bold mb-1">{EVENT_DETAILS.venue.name}</p>
                  <p className="text-retro-gold font-medium">{EVENT_DETAILS.venue.location}</p>
                </div>

                {/* Divider 2 */}
                <DividerOrnament style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)' }} />

                {/* Special Note */}
                <p className="invitation-note font-body text-fluid-base
                              text-retro-orange italic"
                   style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)' }}
                >
                  {EVENT_DETAILS.note}
                </p>

                {/* RSVP Button */}
                <button
                  onClick={handleFlipToBack}
                  className="rsvp-button font-body bg-gradient-to-r from-retro-orange to-retro-red
                             text-white rounded-full text-fluid-lg font-bold
                             uppercase tracking-wider
                             hover:scale-105 active:scale-95 transition-transform
                             button-vintage-glow border-4 border-vintage-cream"
                  style={{ 
                    paddingLeft: 'clamp(1.5rem, 3vw, 2rem)',
                    paddingRight: 'clamp(1.5rem, 3vw, 2rem)',
                    paddingTop: 'clamp(0.75rem, 2vw, 1rem)',
                    paddingBottom: 'clamp(0.75rem, 2vw, 1rem)',
                  }}
                >
                  RSVP Now
                </button>
              </div>
            </div>
          </div>

          {/* ========== BACK FACE: RSVP FORM ========== */}
          <div ref={backRef} className="flippable-card-back">
            <div
              className="relative w-full h-full rounded-lg p-6 md:p-16 overflow-y-auto flex flex-col"
              style={{
                background: 'radial-gradient(circle at center, #FFF8E7 0%, #FF8C42 100%)',
                boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Back to Invitation button */}
              <button
                onClick={handleFlipToFront}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full text-spice-red z-50 min-w-[44px] min-h-[44px] hover:scale-110 transition-all duration-300 shadow-lg"
                aria-label="Back to invitation"
              >
                <span className="text-2xl font-bold">×</span>
              </button>

              {/* Vintage Decorative Elements */}
              <GiantSixtyBackground />
              <BorderFrame />

              {/* Content Layer */}
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6 relative mt-6">
                  <h2 className="font-headline text-4xl md:text-5xl text-gradient-gold text-vintage-shadow mb-6 leading-tight">
                    {hasSubmitted ? '✨ Your RSVP ✨' : '🎊 RSVP 🎊'}
                  </h2>

                  <DividerOrnament className="mb-4" />

                  <p className="font-script text-2xl md:text-3xl text-vintage-burgundy mb-4">
                    {guestData?.name}
                  </p>
                </div>

                {hasSubmitted ? (
                  // Already submitted view
                  <div className="text-center py-6">
                    <div className="mb-6 relative">
                      <div className="text-7xl md:text-9xl animate-bounce" style={{
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                        animation: 'bounce 2s ease-in-out infinite'
                      }}>
                        {displayRsvpStatus === 'accepted' ? '🎉' : '😔'}
                      </div>
                    </div>
                    <div className="bg-vintage-cream/95 p-6 md:p-8 rounded-2xl border-4 border-retro-gold shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                      <p className="font-headline text-3xl md:text-4xl mb-4 text-vintage-shadow" style={{
                        color: displayRsvpStatus === 'accepted' ? '#FF6B35' : '#800020'
                      }}>
                        You {displayRsvpStatus === 'accepted' ? '✨ Accepted! ✨' : 'Declined'}
                      </p>
                      {displayRsvpStatus === 'accepted' && (
                        <div className="space-y-3 mt-4">
                          <div className="bg-retro-gold/90 p-4 rounded-xl border-2 border-vintage-burgundy">
                            <p className="font-body text-lg md:text-xl text-vintage-brown font-semibold">
                              👥 Attending: <span className="text-vintage-burgundy font-bold">{displayAttendingCount} {displayAttendingCount === 1 ? 'person' : 'people'}</span>
                            </p>
                          </div>
                          <div className="bg-retro-gold/90 p-4 rounded-xl border-2 border-vintage-burgundy">
                            <p className="font-body text-lg md:text-xl text-vintage-brown font-semibold">
                              🍛 Food: <span className="text-vintage-burgundy font-bold">{displayFoodPreference === 'indian' ? 'Indian (Traditional)' : 'English'}</span>
                            </p>
                          </div>
                        </div>
                      )}
                      {displayRsvpStatus === 'accepted' && (
                        <p className="font-body text-xl md:text-2xl text-vintage-burgundy mt-6 font-bold animate-pulse">
                          See you there! 🎊
                        </p>
                      )}
                    </div>
                  </div>
                ) : !showAcceptForm ? (
                  // Initial Accept/Decline buttons
                  <div className="flex flex-col gap-3 md:gap-4">
                    <button
                      onClick={handleAcceptClick}
                      disabled={isSubmitting}
                      className="rsvp-button-option w-full font-body bg-gradient-to-r from-retro-orange to-retro-red
                               text-white px-8 py-3 rounded-full text-lg md:text-xl font-bold
                               uppercase tracking-wider
                               hover:scale-105 active:scale-95 transition-transform
                               button-vintage-glow border-3 border-vintage-cream disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-xl">🎉</span>
                        <span>Accept Invitation!</span>
                      </span>
                    </button>

                    <button
                      onClick={handleDeclineClick}
                      disabled={isSubmitting}
                      className="rsvp-button-option w-full font-body bg-gradient-to-r from-vintage-brown to-vintage-burgundy
                               text-white px-8 py-3 rounded-full text-lg md:text-xl font-bold
                               uppercase tracking-wider
                               hover:scale-105 active:scale-95 transition-transform
                               border-3 border-vintage-cream disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingSpinner /> Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>Can't Make It</span>
                        </span>
                      )}
                    </button>
                  </div>
                ) : (
                  // Accept form with party size and food preference
                  <div className="accept-form-fields flex flex-col gap-4">
                    <DividerOrnament className="mb-1" />

                    {/* Party Size Selection (only if couple) */}
                    {isCouple && (
                      <div className="bg-vintage-cream/95 p-4 rounded-2xl border-2 border-retro-gold">
                        <label className="block font-body text-lg md:text-xl text-vintage-burgundy font-semibold mb-3 text-center">
                          👥 Can you both make it?
                        </label>
                        <div className="flex flex-col gap-3">
                          <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                            attendingCount === partySize
                              ? 'bg-retro-gold border-vintage-burgundy shadow-[0_0_20px_rgba(233,196,106,0.5)] scale-105'
                              : 'bg-vintage-cream border-retro-gold hover:bg-white hover:scale-102'
                          }`}>
                            <input
                              type="radio"
                              name="partySize"
                              value={partySize}
                              checked={attendingCount === partySize}
                              onChange={() => setAttendingCount(partySize)}
                              className="mr-3 w-5 h-5 accent-retro-gold"
                            />
                            <span className={`font-body text-lg md:text-xl font-semibold ${attendingCount === partySize ? 'text-vintage-burgundy' : 'text-vintage-brown'}`}>✨ Yes, both of us!</span>
                          </label>
                          <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                            attendingCount === 1
                              ? 'bg-retro-gold border-vintage-burgundy shadow-[0_0_20px_rgba(233,196,106,0.5)] scale-105'
                              : 'bg-vintage-cream border-retro-gold hover:bg-white hover:scale-102'
                          }`}>
                            <input
                              type="radio"
                              name="partySize"
                              value="1"
                              checked={attendingCount === 1}
                              onChange={() => setAttendingCount(1)}
                              className="mr-3 w-5 h-5 accent-retro-gold"
                            />
                            <span className={`font-body text-lg md:text-xl font-semibold ${attendingCount === 1 ? 'text-vintage-burgundy' : 'text-vintage-brown'}`}>Only 1 of us can make it</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Food Preference Selection */}
                    <div className="bg-vintage-cream/95 p-4 rounded-2xl border-2 border-retro-gold">
                      <label className="block font-body text-lg md:text-xl text-vintage-burgundy font-semibold mb-3 text-center">
                        🍛 Food Preference
                      </label>
                      <select
                        value={foodPreference}
                        onChange={(e) => setFoodPreference(e.target.value)}
                        className="w-full p-4 rounded-xl bg-white font-body text-vintage-brown text-lg md:text-xl font-semibold cursor-pointer
                                 focus:outline-none focus:ring-2 focus:ring-retro-gold shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                                 border-2 border-retro-gold hover:border-vintage-burgundy transition-all duration-300"
                      >
                        <option value="indian">🌶️ Indian (Traditional Curry)</option>
                        <option value="english">🥘 English Food</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmitRSVP}
                      disabled={isSubmitting}
                      className="w-full font-body bg-gradient-to-r from-retro-gold to-retro-yellow text-vintage-burgundy px-8 py-3 rounded-full text-lg md:text-xl font-bold
                               uppercase tracking-wider
                               hover:scale-105 active:scale-95 transition-transform
                               button-vintage-glow border-3 border-vintage-burgundy disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingSpinner /> Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-3xl">✓</span>
                          <span>Submit RSVP</span>
                        </span>
                      )}
                    </button>

                    {/* Back to choices button */}
                    <button
                      onClick={() => setShowAcceptForm(false)}
                      className="font-body text-vintage-burgundy text-sm md:text-base underline hover:text-vintage-brown transition-colors"
                    >
                      ← Back to choices
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

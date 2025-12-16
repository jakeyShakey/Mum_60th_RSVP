import { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { submitRSVP } from '../../api/rsvpService';

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
 * RSVPForm3D - 3D floating RSVP form using drei's Html component
 */
export default function RSVPForm3D({ show, guestData, token, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [attendingCount, setAttendingCount] = useState(guestData?.partySize || 1);
  const [foodPreference, setFoodPreference] = useState('indian');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [localSubmittedData, setLocalSubmittedData] = useState(null);
  const contentRef = useRef();

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

  // GSAP entrance animation
  useEffect(() => {
    if (contentRef.current && show) {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power2.out',
      });

      if (!hasSubmitted) {
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
    }
  }, [show, hasSubmitted]);

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
    <Html
      position={[0, 0, 5]}
      transform
      distanceFactor={2.5}
      occlude
      style={{ pointerEvents: 'auto' }}
    >
      <div style={{ width: '400px', maxWidth: '90vw'}}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="rsvp-form-3d"
          >
          <div className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 p-8 md:p-10 rounded-3xl shadow-[0_0_80px_rgba(255,165,0,0.9)] border-4 border-yellow-300 max-h-[80vh] overflow-y-auto"
            ref={contentRef}
            style={{
              boxShadow: '0 0 80px rgba(255,165,0,0.9), 0 0 120px rgba(255,215,0,0.6), inset 0 0 100px rgba(255,255,255,0.3)'
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full text-spice-red z-50 min-w-[44px] min-h-[44px] hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="Close RSVP"
            >
              <span className="text-2xl font-bold">×</span>
            </button>

            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-20 h-20 opacity-70 pointer-events-none">
              <div className="absolute top-3 left-3 text-white text-6xl drop-shadow-lg">✦</div>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 opacity-70 pointer-events-none">
              <div className="absolute top-3 right-3 text-white text-6xl drop-shadow-lg">✦</div>
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-70 pointer-events-none">
              <div className="absolute bottom-3 left-3 text-white text-6xl drop-shadow-lg">✦</div>
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-70 pointer-events-none">
              <div className="absolute bottom-3 right-3 text-white text-6xl drop-shadow-lg">✦</div>
            </div>

            {/* Header */}
            <div className="text-center mb-8 relative mt-8">
              <h2 className="text-4xl md:text-5xl font-display text-white mb-3 relative drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' }}>
                {hasSubmitted ? '✨ Your RSVP ✨' : '🎊 RSVP 🎊'}
              </h2>
              <p className="text-xl md:text-2xl text-white font-bold relative drop-shadow-lg bg-white/90 text-spice-red px-6 py-2 rounded-full inline-block" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
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
                <div className="bg-white/90 p-6 md:p-8 rounded-2xl border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  <p className="text-2xl md:text-3xl text-spice-red mb-4 font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    You {displayRsvpStatus === 'accepted' ? '✨ Accepted! ✨' : 'Declined'}
                  </p>
                  {displayRsvpStatus === 'accepted' && (
                    <div className="space-y-3 mt-4">
                      <div className="bg-curry-gold/90 p-4 rounded-xl border-2 border-curry-gold">
                        <p className="text-lg md:text-xl text-spice-red font-semibold">
                          👥 Attending: <span className="text-spice-red font-bold">{displayAttendingCount} {displayAttendingCount === 1 ? 'person' : 'people'}</span>
                        </p>
                      </div>
                      <div className="bg-curry-gold/90 p-4 rounded-xl border-2 border-curry-gold">
                        <p className="text-lg md:text-xl text-spice-red font-semibold">
                          🍛 Food: <span className="text-spice-red font-bold">{displayFoodPreference === 'indian' ? 'Indian (Traditional)' : 'English'}</span>
                        </p>
                      </div>
                    </div>
                  )}
                  {displayRsvpStatus === 'accepted' && (
                    <p className="text-xl md:text-2xl text-spice-red mt-6 font-bold animate-pulse">
                      See you there! 🎊
                    </p>
                  )}
                </div>
              </div>
            ) : !showAcceptForm ? (
              // Initial Accept/Decline buttons
              <div className="flex flex-col gap-4 md:gap-6">
                <button
                  onClick={handleAcceptClick}
                  disabled={isSubmitting}
                  className="rsvp-button-option w-full py-5 md:py-6 px-6 md:px-8 bg-gradient-to-r from-white to-curry-gold text-spice-red rounded-2xl text-xl md:text-2xl font-bold
                           hover:from-curry-gold hover:to-white hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.8)] active:scale-100
                           transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed
                           border-2 border-white/30 relative overflow-hidden group"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-2xl md:text-3xl">🎉</span>
                    <span>Accept Invitation!</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                </button>

                <button
                  onClick={handleDeclineClick}
                  disabled={isSubmitting}
                  className="rsvp-button-option w-full py-4 md:py-5 px-6 md:px-8 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl text-lg md:text-xl font-semibold
                           hover:from-gray-600 hover:to-gray-800 hover:scale-105 active:scale-95
                           transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed
                           border-2 border-gray-600/50"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
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
              <div className="accept-form-fields flex flex-col gap-6">
                {/* Party Size Selection (only if couple) */}
                {isCouple && (
                  <div className="bg-white/95 p-5 rounded-2xl border-2 border-white">
                    <label className="block text-spice-red text-xl md:text-2xl font-bold mb-4 text-center" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      👥 Can you both make it?
                    </label>
                    <div className="flex flex-col gap-3">
                      <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-3 ${
                        attendingCount === partySize
                          ? 'bg-curry-gold border-curry-gold shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105'
                          : 'bg-white/90 border-white/50 hover:bg-white hover:scale-102'
                      }`}>
                        <input
                          type="radio"
                          name="partySize"
                          value={partySize}
                          checked={attendingCount === partySize}
                          onChange={() => setAttendingCount(partySize)}
                          className="mr-3 w-5 h-5 accent-curry-gold"
                        />
                        <span className={`text-lg md:text-xl font-semibold ${attendingCount === partySize ? 'text-white' : 'text-spice-red'}`}>✨ Yes, both of us!</span>
                      </label>
                      <label className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 border-3 ${
                        attendingCount === 1
                          ? 'bg-curry-gold border-curry-gold shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-105'
                          : 'bg-white/90 border-white/50 hover:bg-white hover:scale-102'
                      }`}>
                        <input
                          type="radio"
                          name="partySize"
                          value="1"
                          checked={attendingCount === 1}
                          onChange={() => setAttendingCount(1)}
                          className="mr-3 w-5 h-5 accent-curry-gold"
                        />
                        <span className={`text-lg md:text-xl font-semibold ${attendingCount === 1 ? 'text-white' : 'text-spice-red'}`}>Only 1 of us can make it</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Food Preference Selection */}
                <div className="bg-white/95 p-5 rounded-2xl border-2 border-white">
                  <label className="block text-spice-red text-xl md:text-2xl font-bold mb-4 text-center" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    🍛 Food Preference
                  </label>
                  <select
                    value={foodPreference}
                    onChange={(e) => setFoodPreference(e.target.value)}
                    className="w-full p-4 rounded-xl bg-white text-gray-800 text-lg md:text-xl font-bold cursor-pointer
                             focus:outline-none focus:ring-4 focus:ring-curry-gold shadow-[0_4px_20px_rgba(0,0,0,0.3)]
                             border-2 border-curry-gold/30 hover:border-curry-gold transition-all duration-300"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                  >
                    <option value="indian">🌶️ Indian (Traditional Curry)</option>
                    <option value="english">🥘 English Food</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitRSVP}
                  disabled={isSubmitting}
                  className="w-full py-5 md:py-6 px-6 md:px-8 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-2xl text-xl md:text-2xl font-bold
                           hover:from-green-600 hover:to-green-800 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] active:scale-100
                           transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed
                           border-2 border-white/30"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
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
                  className="text-white text-sm md:text-base underline hover:text-white/80 transition-colors"
                >
                  ← Back to choices
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </Html>
  );
}

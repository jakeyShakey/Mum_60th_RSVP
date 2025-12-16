import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { submitRSVP } from '../api/rsvpService';
import { useGuest } from '../contexts/GuestContext';
import LoadingScreen from '../components/UI/LoadingScreen';
import ErrorMessage from '../components/UI/ErrorMessage';
import AudioControls from '../components/UI/AudioControls';

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
 * RSVPPage component - Full-page RSVP form
 */
export default function RSVPPage() {
  const navigate = useNavigate();
  const { token, guestData, loading, error } = useGuest();

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

  // Check if already submitted (handle undefined/null/empty as pending)
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

  // GSAP entrance animation for content
  useEffect(() => {
    if (contentRef.current && !loading && !error) {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Animate buttons with stagger (only if not already submitted)
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
  }, [hasSubmitted, loading, error]);

  // Animate accept form when it appears
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
   * Handle Accept button click - show form instead of submitting
   */
  const handleAcceptClick = () => {
    setShowAcceptForm(true);
  };

  /**
   * Handle Decline button click - submit immediately
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

      // No auto-redirect - let user close manually
    } catch (error) {
      console.error('RSVP submission failed:', error);
      alert(`Failed to submit RSVP: ${error.message}\n\nPlease try again.`);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
    }
  };

  /**
   * Handle Submit RSVP (after form is filled)
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

      // No auto-redirect - let user close manually
    } catch (error) {
      console.error('RSVP submission failed:', error);
      alert(`Failed to submit RSVP: ${error.message}\n\nPlease try again.`);
      setIsSubmitting(false);
      setHasAttemptedSubmit(false);
    }
  };

  // Show loading screen while fetching guest data
  if (loading) {
    return <LoadingScreen progress={50} />;
  }

  // Show error screen if guest data failed to load
  if (error || !guestData) {
    return (
      <ErrorMessage
        error={error || "Unable to load invitation details"}
        onRetry={() => navigate(`/invite/${token}`)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen min-h-[100dvh] overflow-y-auto bg-black"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate(`/invite/${token}`)}
        className="fixed top-4 left-4 p-4 bg-curry-gold rounded-full text-white z-50 min-w-[44px] min-h-[44px] hover:bg-curry-gold/80 transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(255,215,0,0.5)]"
        aria-label="Back to invitation"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
      >
        <span className="text-2xl">←</span>
      </button>

      {/* Audio Controls */}
      <AudioControls />

      <div className="max-w-md md:max-w-lg mx-auto p-4 md:p-8 py-16">
        <div
          ref={contentRef}
          className="relative bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 p-8 md:p-10 rounded-3xl shadow-[0_0_80px_rgba(255,165,0,0.9)] border-4 border-yellow-300"
          style={{
            boxShadow: '0 0 80px rgba(255,165,0,0.9), 0 0 120px rgba(255,215,0,0.6), inset 0 0 100px rgba(255,255,255,0.3)'
          }}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20 opacity-70">
            <div className="absolute top-3 left-3 text-white text-6xl drop-shadow-lg">✦</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 opacity-70">
            <div className="absolute top-3 right-3 text-white text-6xl drop-shadow-lg">✦</div>
          </div>
          <div className="absolute bottom-0 left-0 w-20 h-20 opacity-70">
            <div className="absolute bottom-3 left-3 text-white text-6xl drop-shadow-lg">✦</div>
          </div>
          <div className="absolute bottom-0 right-0 w-20 h-20 opacity-70">
            <div className="absolute bottom-3 right-3 text-white text-6xl drop-shadow-lg">✦</div>
          </div>

          {/* Header */}
          <div className="text-center mb-10 relative">
            <h2 className="text-5xl font-display text-white mb-3 relative drop-shadow-2xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' }}>
              {hasSubmitted ? '✨ Your RSVP ✨' : '🎊 RSVP 🎊'}
            </h2>
            <p className="text-2xl text-white font-bold relative drop-shadow-lg bg-white/90 text-spice-red px-6 py-2 rounded-full inline-block" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {guestData.name}
            </p>
          </div>

          {hasSubmitted ? (
            // Already submitted view (read-only)
            <div className="text-center py-10">
              <div className="mb-8 relative">
                <div className="text-9xl animate-bounce" style={{
                  filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                  animation: 'bounce 2s ease-in-out infinite'
                }}>
                  {displayRsvpStatus === 'accepted' ? '🎉' : '😔'}
                </div>
              </div>
              <div className="bg-white/90 p-8 rounded-2xl border-2 border-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <p className="text-3xl text-spice-red mb-6 font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  You {displayRsvpStatus === 'accepted' ? '✨ Accepted! ✨' : 'Declined'}
                </p>
                {displayRsvpStatus === 'accepted' && (
                  <div className="space-y-4 mt-6">
                    <div className="bg-curry-gold/90 p-4 rounded-xl border-2 border-curry-gold">
                      <p className="text-xl text-spice-red font-semibold">
                        👥 Attending: <span className="text-spice-red font-bold">{displayAttendingCount} {displayAttendingCount === 1 ? 'person' : 'people'}</span>
                      </p>
                    </div>
                    <div className="bg-curry-gold/90 p-4 rounded-xl border-2 border-curry-gold">
                      <p className="text-xl text-spice-red font-semibold">
                        🍛 Food: <span className="text-spice-red font-bold">{displayFoodPreference === 'indian' ? 'Indian (Traditional)' : 'English'}</span>
                      </p>
                    </div>
                  </div>
                )}
                {!hasLocalSubmission && guestData.timestamp && (
                  <p className="text-lg text-gray-700 mt-6 italic">
                    Submitted on {new Date(guestData.timestamp).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {displayRsvpStatus === 'accepted' && (
                  <p className="text-2xl text-spice-red mt-8 font-bold animate-pulse">
                    See you there! 🎊
                  </p>
                )}
                <button
                  onClick={() => navigate(`/invite/${token}`)}
                  className="mt-8 py-4 px-8 bg-curry-gold hover:bg-curry-gold/80 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                >
                  Back to Invitation
                </button>
              </div>
            </div>
          ) : !showAcceptForm ? (
            // Initial Accept/Decline buttons
            <div className="flex flex-col gap-6">
              {/* Accept Button */}
              <button
                onClick={handleAcceptClick}
                disabled={isSubmitting}
                className="rsvp-button-option w-full py-6 px-8 bg-gradient-to-r from-white to-curry-gold text-spice-red rounded-2xl text-2xl font-bold
                         hover:from-curry-gold hover:to-white hover:scale-110 hover:shadow-[0_0_40px_rgba(255,215,0,0.8)] active:scale-100
                         transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed
                         border-2 border-white/30 relative overflow-hidden group"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-3xl">🎉</span>
                  <span>Accept Invitation!</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </button>

              {/* Decline Button */}
              <button
                onClick={handleDeclineClick}
                disabled={isSubmitting}
                className="rsvp-button-option w-full py-5 px-8 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl text-xl font-semibold
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
            <div className="accept-form-fields flex flex-col gap-8">
              {/* Party Size Selection (only if couple) */}
              {isCouple && (
                <div className="bg-white/95 p-6 rounded-2xl border-2 border-white">
                  <label className="block text-spice-red text-2xl font-bold mb-5 text-center" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    👥 Can you both make it?
                  </label>
                  <div className="flex flex-col gap-4">
                    <label className={`flex items-center p-5 rounded-xl cursor-pointer transition-all duration-300 border-3 ${
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
                        className="mr-4 w-6 h-6 accent-curry-gold"
                      />
                      <span className={`text-xl font-semibold ${attendingCount === partySize ? 'text-white' : 'text-spice-red'}`}>✨ Yes, both of us!</span>
                    </label>
                    <label className={`flex items-center p-5 rounded-xl cursor-pointer transition-all duration-300 border-3 ${
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
                        className="mr-4 w-6 h-6 accent-curry-gold"
                      />
                      <span className={`text-xl font-semibold ${attendingCount === 1 ? 'text-white' : 'text-spice-red'}`}>Only 1 of us can make it</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Food Preference Selection */}
              <div className="bg-white/95 p-6 rounded-2xl border-2 border-white">
                <label className="block text-spice-red text-2xl font-bold mb-5 text-center" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  🍛 Food Preference
                </label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  className="w-full p-5 rounded-xl bg-white text-gray-800 text-xl font-bold cursor-pointer
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
                className="w-full py-6 px-8 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl text-2xl font-bold
                         hover:from-green-500 hover:to-green-700 hover:scale-110 hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] active:scale-100
                         transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed
                         border-2 border-white/30 relative overflow-hidden group"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner /> <span>Submitting...</span>
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-3xl">✅</span>
                    <span>Confirm RSVP!</span>
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

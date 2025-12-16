import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { submitRSVP } from '../api/rsvpService';
import { useGuest } from '../contexts/GuestContext';
import LoadingScreen from '../components/UI/LoadingScreen';
import ErrorMessage from '../components/UI/ErrorMessage';
import AudioControls from '../components/UI/AudioControls';
import {
  GiantSixtyBackground,
  BorderFrame,
  DividerOrnament,
} from '../components/UI/VintageDecorations';

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
          className="relative rounded-lg p-12 md:p-16"
          style={{
            background: 'radial-gradient(circle at center, #FFF8E7 0%, #FF8C42 100%)',
            boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Vintage Decorative Elements */}
          <GiantSixtyBackground />
          <BorderFrame />

          {/* Content Layer */}
          <div className="relative z-10">

          {/* Header */}
          <div className="text-center mb-8 relative">
            <h2 className="font-headline text-5xl md:text-6xl text-gradient-gold text-vintage-shadow mb-8 leading-tight">
              {hasSubmitted ? '✨ Your RSVP ✨' : '🎊 RSVP 🎊'}
            </h2>

            <DividerOrnament className="mb-6" />

            <p className="font-script text-3xl md:text-4xl text-vintage-burgundy mb-6">
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
              <div className="bg-vintage-cream/95 p-8 rounded-2xl border-4 border-retro-gold shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <p className="font-headline text-3xl md:text-4xl mb-6 text-vintage-shadow" style={{
                  color: displayRsvpStatus === 'accepted' ? '#FF6B35' : '#800020'
                }}>
                  You {displayRsvpStatus === 'accepted' ? '✨ Accepted! ✨' : 'Declined'}
                </p>
                {displayRsvpStatus === 'accepted' && (
                  <div className="space-y-4 mt-6">
                    <div className="bg-retro-gold/90 p-4 rounded-xl border-2 border-vintage-burgundy">
                      <p className="font-body text-xl text-vintage-brown font-semibold">
                        👥 Attending: <span className="text-vintage-burgundy font-bold">{displayAttendingCount} {displayAttendingCount === 1 ? 'person' : 'people'}</span>
                      </p>
                    </div>
                    <div className="bg-retro-gold/90 p-4 rounded-xl border-2 border-vintage-burgundy">
                      <p className="font-body text-xl text-vintage-brown font-semibold">
                        🍛 Food: <span className="text-vintage-burgundy font-bold">{displayFoodPreference === 'indian' ? 'Indian (Traditional)' : 'English'}</span>
                      </p>
                    </div>
                  </div>
                )}
                {!hasLocalSubmission && guestData.timestamp && (
                  <p className="font-body text-lg text-vintage-brown mt-6 italic">
                    Submitted on {new Date(guestData.timestamp).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {displayRsvpStatus === 'accepted' && (
                  <p className="font-body text-2xl text-vintage-burgundy mt-8 font-bold animate-pulse">
                    See you there! 🎊
                  </p>
                )}
                <button
                  onClick={() => navigate(`/invite/${token}`)}
                  className="mt-8 font-body bg-gradient-to-r from-retro-gold to-retro-yellow text-vintage-burgundy px-8 py-4 rounded-full text-lg font-bold
                           uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform
                           button-vintage-glow border-4 border-vintage-burgundy"
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
                className="rsvp-button-option w-full font-body bg-gradient-to-r from-retro-orange to-retro-red
                         text-white px-10 py-5 rounded-full text-xl md:text-2xl font-bold
                         uppercase tracking-wider
                         hover:scale-105 active:scale-95 transition-transform
                         button-vintage-glow border-4 border-vintage-cream disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-3xl">🎉</span>
                  <span>Accept Invitation!</span>
                </span>
              </button>

              {/* Decline Button */}
              <button
                onClick={handleDeclineClick}
                disabled={isSubmitting}
                className="rsvp-button-option w-full font-body bg-gradient-to-r from-vintage-brown to-vintage-burgundy
                         text-white px-10 py-5 rounded-full text-xl md:text-2xl font-bold
                         uppercase tracking-wider
                         hover:scale-105 active:scale-95 transition-transform
                         border-4 border-vintage-cream disabled:opacity-50 disabled:cursor-not-allowed"
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
              <DividerOrnament className="mb-2" />

              {/* Party Size Selection (only if couple) */}
              {isCouple && (
                <div className="bg-vintage-cream/95 p-6 rounded-2xl border-2 border-retro-gold">
                  <label className="block font-body text-2xl text-vintage-burgundy font-semibold mb-5 text-center">
                    👥 Can you both make it?
                  </label>
                  <div className="flex flex-col gap-4">
                    <label className={`flex items-center p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
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
                        className="mr-4 w-6 h-6 accent-retro-gold"
                      />
                      <span className={`font-body text-xl font-semibold ${attendingCount === partySize ? 'text-vintage-burgundy' : 'text-vintage-brown'}`}>✨ Yes, both of us!</span>
                    </label>
                    <label className={`flex items-center p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
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
                        className="mr-4 w-6 h-6 accent-retro-gold"
                      />
                      <span className={`font-body text-xl font-semibold ${attendingCount === 1 ? 'text-vintage-burgundy' : 'text-vintage-brown'}`}>Only 1 of us can make it</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Food Preference Selection */}
              <div className="bg-vintage-cream/95 p-6 rounded-2xl border-2 border-retro-gold">
                <label className="block font-body text-2xl text-vintage-burgundy font-semibold mb-5 text-center">
                  🍛 Food Preference
                </label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  className="w-full p-5 rounded-xl bg-white font-body text-vintage-brown text-xl font-semibold cursor-pointer
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
                className="w-full font-body bg-gradient-to-r from-retro-gold to-retro-yellow text-vintage-burgundy px-10 py-5 rounded-full text-xl md:text-2xl font-bold
                         uppercase tracking-wider
                         hover:scale-105 active:scale-95 transition-transform
                         button-vintage-glow border-4 border-vintage-burgundy disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner /> <span>Submitting...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-3xl">✓</span>
                    <span>Submit RSVP</span>
                  </span>
                )}
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import Scene from '../components/Scene/Scene';
import LoadingScreen from '../components/UI/LoadingScreen';
import FlippableCard from '../components/UI/FlippableCard';
import AudioControls from '../components/UI/AudioControls';
import ErrorMessage from '../components/UI/ErrorMessage';
import { createRevealTimeline } from '../utils/animations';
import { useGuest } from '../contexts/GuestContext';

function InvitePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [interactionState, setInteractionState] = useState('idle'); // idle, revealed
  const [showCard, setShowCard] = useState(false);

  const backgroundRef = useRef();
  const cameraRef = useRef();

  // Token-based authentication from context
  const { token, guestData, loading: guestLoading, error: guestError } = useGuest();

  // Track when scene is ready and hide loading screen
  useEffect(() => {
    if (sceneReady) {
      // Small delay for smooth transition
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [sceneReady]);

  // Handle spin completion - trigger reveal animation
  const handleSpinComplete = useCallback(() => {
    console.log('Spin complete! Triggering reveal...');
    setInteractionState('revealed');

    // Trigger reveal animation timeline
    const tl = createRevealTimeline({
      camera: cameraRef.current,
      backgroundEl: backgroundRef.current,
      onComplete: () => {
        // Show flippable card after reveal animation
        setShowCard(true);
      },
    });
  }, []);

  // Particle intensity: 0 while spinning, burst to 1 when revealed
  const particleIntensity = interactionState === 'revealed' ? 1 : 0;

  // Show error screen if guest token is invalid
  if (guestError) {
    return <ErrorMessage error={guestError} onRetry={() => window.location.reload()} />;
  }

  // Show loading screen while fetching guest data
  if (guestLoading) {
    return <LoadingScreen progress={50} />;
  }

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: '#000000' }}>
      {/* Background animation layer - sits behind everything */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: '#000000', zIndex: -10 }}
      />

      {/* 3D Scene */}
      <Scene
        onSpinComplete={handleSpinComplete}
        particleIntensity={particleIntensity}
        cameraRef={cameraRef}
        onReady={() => setSceneReady(true)}
      />

      {/* Loading Screen */}
      {isLoading && <LoadingScreen progress={sceneReady ? 100 : 50} />}

      {/* Audio Controls */}
      {!isLoading && <AudioControls />}

      {/* Flippable Card (Invitation + RSVP) */}
      {!isLoading && (
        <FlippableCard
          show={showCard}
          guestName={guestData?.name}
          guestData={guestData}
          token={token}
        />
      )}

      {/* Debug info (remove later) */}
      {!isLoading && !showCard && (
        <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 p-3 rounded z-10">
          <p>State: {interactionState}</p>
          <p>Interaction: Click curry to reveal</p>
        </div>
      )}
    </div>
  );
}

export default InvitePage;

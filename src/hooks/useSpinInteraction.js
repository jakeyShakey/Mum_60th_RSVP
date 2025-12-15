import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook to track spin interaction for the curry model
 * Tracks mouse/touch drag events and calculates rotation progress (0-720°)
 * Now supports omnidirectional spinning!
 */
export function useSpinInteraction() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinProgress, setSpinProgress] = useState(0); // 0-720 degrees
  const [isComplete, setIsComplete] = useState(false);
  const [currentRotationX, setCurrentRotationX] = useState(0);
  const [currentRotationY, setCurrentRotationY] = useState(0);

  const isDragging = useRef(false);
  const previousMouseX = useRef(0);
  const previousMouseY = useRef(0);
  const totalRotation = useRef(0);

  // Start dragging
  const handlePointerDown = useCallback((event) => {
    isDragging.current = true;
    previousMouseX.current = event.clientX || event.touches?.[0]?.clientX || 0;
    previousMouseY.current = event.clientY || event.touches?.[0]?.clientY || 0;
    setIsSpinning(true);

    // Prevent default to avoid text selection
    event.preventDefault();
  }, []);

  // Handle drag movement - omnidirectional
  const handlePointerMove = useCallback((event) => {
    if (!isDragging.current) return;

    const clientX = event.clientX || event.touches?.[0]?.clientX || 0;
    const clientY = event.clientY || event.touches?.[0]?.clientY || 0;

    const deltaX = clientX - previousMouseX.current;
    const deltaY = clientY - previousMouseY.current;

    // Convert pixel movement to rotation (scaled for sensitivity)
    const rotationDeltaY = deltaX * 0.01; // Horizontal drag = Y-axis rotation
    const rotationDeltaX = deltaY * 0.01; // Vertical drag = X-axis rotation

    // Update rotation on both axes
    setCurrentRotationY((prev) => prev + rotationDeltaY);
    setCurrentRotationX((prev) => prev + rotationDeltaX);

    // Track total rotation (magnitude of both axes for progress)
    const totalDelta = Math.sqrt(rotationDeltaX ** 2 + rotationDeltaY ** 2);
    totalRotation.current += totalDelta;

    // Calculate progress (0-720 degrees) - doubled requirement
    const progress = Math.min(totalRotation.current * (180 / Math.PI), 720);
    setSpinProgress(progress);

    // Check if complete (now requires 720 degrees)
    if (progress >= 720 && !isComplete) {
      setIsComplete(true);
    }

    previousMouseX.current = clientX;
    previousMouseY.current = clientY;
  }, [isComplete]);

  // Stop dragging
  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    setIsSpinning(false);
  }, []);

  // Reset interaction
  const reset = useCallback(() => {
    setIsSpinning(false);
    setSpinProgress(0);
    setIsComplete(false);
    setCurrentRotationX(0);
    setCurrentRotationY(0);
    isDragging.current = false;
    totalRotation.current = 0;
  }, []);

  // Get milestone information (for quarter turns) - updated for 720 degrees
  const getMilestone = useCallback(() => {
    if (spinProgress >= 540) return 4; // 3/4 of 720
    if (spinProgress >= 360) return 3; // 1/2 of 720
    if (spinProgress >= 180) return 2; // 1/4 of 720
    if (spinProgress > 0) return 1;
    return 0;
  }, [spinProgress]);

  return {
    // State
    isSpinning,
    spinProgress,
    isComplete,
    currentRotationX,
    currentRotationY,
    milestone: getMilestone(),

    // Handlers
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    reset,

    // Progress percentage (0-100)
    progressPercent: Math.min((spinProgress / 720) * 100, 100),
  };
}

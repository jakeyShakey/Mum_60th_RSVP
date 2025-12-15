import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for managing audio playback with React
 *
 * @param {Object} options - Configuration options
 * @param {string} options.src - Audio file path
 * @param {number} options.volume - Initial volume (0-1)
 * @param {boolean} options.loop - Whether to loop the audio
 * @param {boolean} options.preload - Whether to preload the audio
 * @returns {Object} Audio controls and state
 */
export function useSound({ src, volume = 1.0, loop = false, preload = true }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;

    if (preload) {
      audio.preload = 'auto';
    }

    // Event listeners for audio state
    const handleCanPlayThrough = () => setIsLoaded(true);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e) => {
      console.warn(`Audio load failed for ${src}:`, e);
      setIsLoaded(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    // Cleanup
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [src, loop, preload]);

  // Update volume when prop changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // Play audio
  const play = useCallback(() => {
    if (audioRef.current && isLoaded) {
      // Reset to beginning if already ended
      if (audioRef.current.ended) {
        audioRef.current.currentTime = 0;
      }

      audioRef.current.play().catch(err => {
        // Handle autoplay restrictions gracefully
        if (err.name === 'NotAllowedError') {
          console.warn('Audio autoplay blocked. User interaction required.');
        } else {
          console.warn('Audio play failed:', err);
        }
      });
    }
  }, [isLoaded]);

  // Pause audio
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Stop audio (pause and reset to beginning)
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Update volume
  const setVolume = useCallback((newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  }, []);

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
    isLoaded,
    audioRef
  };
}

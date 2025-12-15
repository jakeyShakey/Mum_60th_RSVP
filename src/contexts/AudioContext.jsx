import { createContext, useContext, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { useAudioManager } from '../hooks/useAudioManager';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const { isMuted, getEffectiveVolume } = useAudioManager();

  // Background music - lives at app level
  const backgroundMusic = useSound({
    src: '/audio/background-music.mp3',
    volume: getEffectiveVolume(0.3),
    loop: true,
    preload: true,
  });

  // Start music when loaded
  useEffect(() => {
    if (backgroundMusic.isLoaded) {
      backgroundMusic.play();
    }
  }, [backgroundMusic.isLoaded, backgroundMusic]);

  // Update volume when mute changes
  useEffect(() => {
    backgroundMusic.setVolume(getEffectiveVolume(0.3));
  }, [isMuted, backgroundMusic, getEffectiveVolume]);

  return (
    <AudioContext.Provider value={{ backgroundMusic }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}

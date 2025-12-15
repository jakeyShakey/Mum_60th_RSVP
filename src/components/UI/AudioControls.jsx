import { useAudioManager } from '../../hooks/useAudioManager';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * AudioControls - Floating mute toggle button
 * Displays in top-right corner with speaker icon
 */
export default function AudioControls() {
  const { isMuted, toggleMute } = useAudioManager();

  return (
    <button
      onClick={toggleMute}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Click to unmute' : 'Click to mute'}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-white" />
      ) : (
        <Volume2 className="w-6 h-6 text-white animate-pulse" />
      )}
    </button>
  );
}

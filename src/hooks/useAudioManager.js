import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global audio state management using Zustand
 * Manages mute state, master volume, and autoplay restrictions
 * State is persisted to localStorage
 */
export const useAudioManager = create(
  persist(
    (set, get) => ({
      // State
      isMuted: false,
      masterVolume: 1.0,
      autoplayBlocked: false,

      // Actions
      toggleMute: () =>
        set((state) => {
          console.log(`Audio ${state.isMuted ? 'unmuted' : 'muted'}`);
          return { isMuted: !state.isMuted };
        }),

      setMuted: (muted) => {
        console.log(`Audio ${muted ? 'muted' : 'unmuted'}`);
        set({ isMuted: muted });
      },

      setMasterVolume: (volume) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        console.log(`Master volume set to ${Math.round(clampedVolume * 100)}%`);
        set({ masterVolume: clampedVolume });
      },

      setAutoplayBlocked: (blocked) => {
        if (blocked) {
          console.warn('Audio autoplay blocked by browser');
        }
        set({ autoplayBlocked: blocked });
      },

      // Helper function to get effective volume (respects mute state)
      getEffectiveVolume: (baseVolume = 1.0) => {
        const state = get();
        return state.isMuted ? 0 : baseVolume * state.masterVolume;
      },
    }),
    {
      name: 'audio-settings', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        isMuted: state.isMuted,
        masterVolume: state.masterVolume,
      }),
    }
  )
);

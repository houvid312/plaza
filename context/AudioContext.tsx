import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface AudioContextValue {
  isPlaying: boolean;
  toggle: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying: false,
  toggle: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(true); // default ON visually
  const loadedRef = useRef(false);
  const autoplayAttempted = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/ambient.mp3'),
          {
            isLooping: true,
            volume: 0.25,
            shouldPlay: true,
          }
        );

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        loadedRef.current = true;

        // Check if autoplay actually worked (browsers may block it)
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          if (mounted) setIsPlaying(true);
          autoplayAttempted.current = true;
        } else {
          // Autoplay blocked — retry on first user interaction
          if (mounted) setIsPlaying(true); // show as "on" so bars animate
          if (Platform.OS === 'web') {
            const startOnInteraction = async () => {
              if (autoplayAttempted.current) return;
              autoplayAttempted.current = true;
              try {
                await sound.playAsync();
              } catch {}
              document.removeEventListener('click', startOnInteraction);
              document.removeEventListener('scroll', startOnInteraction, true);
              document.removeEventListener('touchstart', startOnInteraction);
            };
            document.addEventListener('click', startOnInteraction, { once: false });
            document.addEventListener('scroll', startOnInteraction, { once: false, capture: true });
            document.addEventListener('touchstart', startOnInteraction, { once: false });
          }
        }
      } catch (e) {
        // Audio not available (e.g. SSR or unsupported platform)
      }
    }

    load();

    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
    };
  }, []);

  const toggle = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound || !loadedRef.current) return;
    autoplayAttempted.current = true;

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch {}
  }, []);

  return (
    <AudioCtx.Provider value={{ isPlaying, toggle }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}

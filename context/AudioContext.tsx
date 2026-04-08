import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { useAudioPlayer, AudioModule } from 'expo-audio';
import { Platform } from 'react-native';

interface AudioContextValue {
  isPlaying: boolean;
  toggle: () => void;
}

const AudioCtx = createContext<AudioContextValue>({
  isPlaying: false,
  toggle: () => {},
});

const audioSource = Platform.OS === 'web'
  ? { uri: '/ambient.mp3' }
  : require('../assets/audio/ambient.mp3');

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer(audioSource);
  const [isPlaying, setIsPlaying] = useState(true);
  const startedRef = useRef(false);

  // Configure and auto-play
  useEffect(() => {
    if (!player) return;

    player.loop = true;
    player.volume = 0.25;

    function tryPlay() {
      if (startedRef.current) return;
      try {
        player.play();
        startedRef.current = true;
        setIsPlaying(true);
      } catch {}
    }

    // Try immediate autoplay
    tryPlay();

    // If browser blocks autoplay, start on first interaction
    if (Platform.OS === 'web' && !startedRef.current) {
      const onInteraction = () => {
        tryPlay();
        document.removeEventListener('click', onInteraction);
        document.removeEventListener('scroll', onInteraction, true);
        document.removeEventListener('touchstart', onInteraction);
      };
      document.addEventListener('click', onInteraction);
      document.addEventListener('scroll', onInteraction, { capture: true });
      document.addEventListener('touchstart', onInteraction);

      return () => {
        document.removeEventListener('click', onInteraction);
        document.removeEventListener('scroll', onInteraction, true);
        document.removeEventListener('touchstart', onInteraction);
      };
    }
  }, [player]);

  const toggle = useCallback(() => {
    if (!player) return;

    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      startedRef.current = true;
      setIsPlaying(true);
    }
  }, [player]);

  return (
    <AudioCtx.Provider value={{ isPlaying, toggle }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}

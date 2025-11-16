import { useEffect, useRef, useState } from "react";

type SoundscapeName =
  | "Forest Ambience"
  | "Ocean Waves"
  | "Rain & Thunder"
  | "Nordic Winds"
  | "Meditation Bowls"
  | "Birch Forest"
  | "Silent"
  | string;

export interface UseSoundscapeAudioOptions {
  isSessionRunning: boolean;
  currentProgramSoundscape?: SoundscapeName | null;
}

export interface UseSoundscapeAudio {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  playPreview: (soundscape: SoundscapeName) => void;
  stop: () => void;
}

const soundscapeAudioMap: Record<string, string> = {
  "Forest Ambience":
    "https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3",
  "Ocean Waves":
    "https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3",
  "Rain & Thunder":
    "https://assets.mixkit.co/active_storage/sfx/2410/2410-preview.mp3",
  "Nordic Winds":
    "https://assets.mixkit.co/active_storage/sfx/2398/2398-preview.mp3",
  "Meditation Bowls":
    "https://assets.mixkit.co/active_storage/sfx/2417/2417-preview.mp3",
  "Birch Forest":
    "https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3",
  Silent: "",
};

export function useSoundscapeAudio(
  options: UseSoundscapeAudioOptions,
): UseSoundscapeAudio {
  const { isSessionRunning, currentProgramSoundscape } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolumeState] = useState(0.6);
  const [isMuted, setMuted] = useState(false);

  const playUrl = (url: string) => {
    if (!url) return;
    stop(); // ensure single audio instance
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    audio.muted = isMuted;
    audioRef.current = audio;
    audio.src = url;
    audio
      .play()
      .catch((err) => {
        console.error("Audio playback failed", err);
        audioRef.current = null;
      });
  };

  const stop = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.muted = true;
      audioRef.current.volume = 0;
      audioRef.current.src = "";
      try {
        audioRef.current.load();
      } catch {}
    } catch {}
    audioRef.current = null;
  };

  const playPreview = (soundscape: SoundscapeName) => {
    const url = soundscapeAudioMap[soundscape];
    if (!url) return;
    // Toggle preview
    if (audioRef.current) {
      stop();
    } else {
      playUrl(url);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
      audioRef.current.volume = next ? 0 : volume;
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (v > 0 && isMuted) {
      setMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  useEffect(() => {
    // Auto manage audio when session/program changes
    const name = currentProgramSoundscape || "";
    const url = soundscapeAudioMap[name];
    if (isSessionRunning && url) {
      if (!audioRef.current) {
        playUrl(url);
      }
    } else {
      // if session stops or no program soundscape, stop
      if (audioRef.current) stop();
    }
    return () => {
      // no-op here; global stop handled by consumers on unmount if needed
    };
  }, [isSessionRunning, currentProgramSoundscape]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    isMuted,
    volume,
    toggleMute,
    setVolume,
    playPreview,
    stop,
  };
}



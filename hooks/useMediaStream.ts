'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MediaStreamState } from '@/lib/types';

interface UseMediaStreamReturn extends MediaStreamState {
  toggleAudio: () => void;
  toggleVideo: () => void;
  startStream: () => Promise<void>;
  stopStream: () => void;
  error: string | null;
}

export const useMediaStream = (): UseMediaStreamReturn => {
  const [state, setState] = useState<MediaStreamState>({
    audioEnabled: true,
    videoEnabled: true,
    stream: null,
    audioLevel: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Calculate RMS (Root Mean Square) for better audio level detection
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const normalizedLevel = Math.min(1, rms * 3); // Amplify for visibility

    setState((prev) => ({ ...prev, audioLevel: normalizedLevel }));

    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
  }, []);

  const startStream = useCallback(async () => {
    try {
      // Try audio only first (camera optional)
      // Try audio + video first
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
      } catch (err) {
        console.warn('Failed to get video, trying audio only:', err);
        // Fallback to audio only
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          setError('Camera not available. Audio-only mode enabled.');
        } catch (audioErr) {
          throw audioErr; // Re-throw if even audio fails
        }
      }

      const hasVideo = mediaStream.getVideoTracks().length > 0;
      const hasAudio = mediaStream.getAudioTracks().length > 0;

      setState((prev) => ({ 
        ...prev, 
        stream: mediaStream,
        videoEnabled: hasVideo,
        audioEnabled: hasAudio
      }));

      // Set up audio analysis only if we have audio
      if (hasAudio) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        
        const source = audioContextRef.current.createMediaStreamSource(mediaStream);
        source.connect(analyserRef.current);

        monitorAudioLevel();
      }
      
      if (mediaStream.getVideoTracks().length === 0) {
        console.log('Running in audio-only mode');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setError('Microphone access denied. Please enable permissions in your browser settings and refresh.');
      } else if (errorMessage.includes('NotFoundError')) {
        setError('No microphone found. Please connect a microphone and refresh.');
      } else {
        setError('Failed to access microphone. Please check permissions and try again.');
      }
    }
  }, [monitorAudioLevel]);

  const stopStream = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
      setState((prev) => ({ ...prev, stream: null, audioLevel: 0 }));
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [state.stream]);

  const toggleAudio = useCallback(() => {
    if (state.stream) {
      const audioTracks = state.stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setState((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }));
    }
  }, [state.stream]);

  const toggleVideo = useCallback(() => {
    if (state.stream) {
      const videoTracks = state.stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setState((prev) => ({ ...prev, videoEnabled: !prev.videoEnabled }));
    }
  }, [state.stream]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    ...state,
    toggleAudio,
    toggleVideo,
    startStream,
    stopStream,
    error,
  };
};

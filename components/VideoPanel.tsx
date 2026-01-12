'use client';

import React, { useEffect, useRef } from 'react';
import { VideoOff, Camera } from 'lucide-react';

interface VideoPanelProps {
  stream: MediaStream | null;
  videoEnabled: boolean;
  audioLevel: number;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({
  stream,
  videoEnabled,
  audioLevel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log('🎥 Setting video srcObject:', {
        hasVideoTracks: stream.getVideoTracks().length,
        videoTracks: stream.getVideoTracks().map(t => ({
          id: t.id,
          enabled: t.enabled,
          readyState: t.readyState,
          label: t.label
        }))
      });
      videoRef.current.srcObject = stream;
      
      // Force play
      videoRef.current.play().catch(err => {
        console.error('❌ Video play error:', err);
      });
    }
  }, [stream]);

  // Check if stream has video tracks
  const hasVideo = stream && stream.getVideoTracks().length > 0;
  const videoTrack = hasVideo ? stream.getVideoTracks()[0] : null;
  const showVideo = hasVideo && videoTrack && videoTrack.enabled && videoTrack.readyState === 'live';

  console.log('📺 VideoPanel:', { 
    hasStream: !!stream, 
    hasVideo,
    videoTrack: videoTrack ? {
      id: videoTrack.id,
      enabled: videoTrack.enabled,
      readyState: videoTrack.readyState,
      muted: videoTrack.muted
    } : null,
    showVideo,
    videoEnabledProp: videoEnabled
  });

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Video Feed */}
      <div className="flex-1 glass-effect rounded-2xl overflow-hidden relative">
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Camera indicator */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Camera size={14} className="text-genesys-orange" />
              <span className="text-xs text-white">
                {videoTrack?.enabled ? 'Camera On' : 'Camera Paused'}
              </span>
            </div>
            {/* Debug overlay */}
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-yellow-400">
              {videoTrack?.readyState}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-dark-secondary">
            <VideoOff size={40} className="text-gray-600 mb-2" />
            <p className="text-sm text-gray-500">Camera Off</p>
            <p className="text-xs text-gray-600 mt-2">
              {stream ? 'No video tracks' : 'No stream'}
            </p>
          </div>
        )}
      </div>

      {/* Microphone Level */}
      <div className="glass-effect rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Mic Level</span>
          <span className="text-xs text-gray-600">
            {Math.round(audioLevel * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-dark-accent rounded-full overflow-hidden">
          <div
            className="h-full genesys-gradient transition-all duration-75"
            style={{ width: `${Math.min(100, audioLevel * 100)}%` }}
          />
        </div>
        {/* Debug */}
        {audioLevel > 0.01 && (
          <div className="text-xs text-green-400 mt-1">
            🎤 Detecting: {Math.round(audioLevel * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

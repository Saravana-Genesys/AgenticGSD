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
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Video Feed */}
      <div className="flex-1 glass-effect rounded-xl overflow-hidden relative">
        {stream && videoEnabled ? (
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
              <Camera size={14} className="text-green-400" />
              <span className="text-xs text-white">Camera On</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-900/50">
            <VideoOff size={40} className="text-gray-600 mb-2" />
            <p className="text-sm text-gray-500">Camera Off</p>
          </div>
        )}
      </div>

      {/* Microphone Level */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Mic Level</span>
          <span className="text-xs text-gray-600">
            {Math.round(audioLevel * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-75"
            style={{ width: `${Math.min(100, audioLevel * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

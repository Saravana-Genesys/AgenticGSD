'use client';

import React from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';
import type { CallStatus } from '@/lib/types';

interface ControlPanelProps {
  callStatus: CallStatus;
  audioEnabled: boolean;
  videoEnabled: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  callStatus,
  audioEnabled,
  videoEnabled,
  onStartCall,
  onEndCall,
  onToggleAudio,
  onToggleVideo,
}) => {
  const isCallActive = callStatus === 'active' || callStatus === 'connecting';

  return (
    <div className="flex items-center justify-center gap-4 p-5 glass-effect rounded-xl">
      {/* Audio Toggle */}
      <button
        onClick={onToggleAudio}
        disabled={!isCallActive}
        className={`p-4 rounded-full transition-all duration-200 ${
          audioEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
        } ${!isCallActive ? 'opacity-40 cursor-not-allowed' : ''}`}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? <Mic size={22} /> : <MicOff size={22} />}
      </button>

      {/* Video Toggle */}
      <button
        onClick={onToggleVideo}
        disabled={!isCallActive}
        className={`p-4 rounded-full transition-all duration-200 ${
          videoEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
        } ${!isCallActive ? 'opacity-40 cursor-not-allowed' : ''}`}
        title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {videoEnabled ? <Video size={22} /> : <VideoOff size={22} />}
      </button>

      {/* Call Button */}
      {!isCallActive ? (
        <button
          onClick={onStartCall}
          disabled={callStatus === 'connecting'}
          className="px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 flex items-center gap-3 font-semibold text-white shadow-lg shadow-green-500/25 disabled:opacity-50"
        >
          <Phone size={22} />
          <span>{callStatus === 'connecting' ? 'Connecting...' : 'Start Call'}</span>
        </button>
      ) : (
        <button
          onClick={onEndCall}
          className="px-8 py-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 flex items-center gap-3 font-semibold text-white shadow-lg shadow-red-500/25"
        >
          <PhoneOff size={22} />
          <span>End Call</span>
        </button>
      )}
    </div>
  );
};

'use client';

import { useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';

interface VideoPlayerProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
  onToggleVideo?: () => void;
  onToggleAudio?: () => void;
}

export default function VideoPlayer({
  stream,
  isLocal = false,
  isVideoEnabled = true,
  isAudioEnabled = true,
  onToggleVideo,
  onToggleAudio,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      
      {!isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <FaVideoSlash className="text-6xl text-gray-400" />
        </div>
      )}

      {isLocal && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? 'bg-gray-700' : 'bg-red-600'
            } hover:opacity-80 transition`}
          >
            {isVideoEnabled ? (
              <FaVideo className="text-white text-xl" />
            ) : (
              <FaVideoSlash className="text-white text-xl" />
            )}
          </button>
          <button
            onClick={onToggleAudio}
            className={`p-4 rounded-full ${
              isAudioEnabled ? 'bg-gray-700' : 'bg-red-600'
            } hover:opacity-80 transition`}
          >
            {isAudioEnabled ? (
              <FaMicrophone className="text-white text-xl" />
            ) : (
              <FaMicrophoneSlash className="text-white text-xl" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

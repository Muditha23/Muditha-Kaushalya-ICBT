import React, { useState, useEffect } from 'react';
import { useCamera } from '../contexts/CameraContext';
import { useStream } from '../contexts/StreamContext';
import { useUI } from '../contexts/UIContext';
import CameraControls from './CameraControls';
import StatusBar from './StatusBar';
import SettingsPanel from './SettingsPanel';
import StreamInfo from './StreamInfo';
import CameraLoading from './CameraLoading';
import CameraError from './CameraError';

const CameraView: React.FC = () => {
  const { 
    videoRef, 
    isCameraReady, 
    isLoading,
    error,
    facing
  } = useCamera();
  
  const { isStreaming } = useStream();
  const { isSettingsOpen, isFullscreen } = useUI();
  const [showControls, setShowControls] = useState(true);
  
  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      setShowControls(true);
      
      timeout = setTimeout(() => {
        if (!isSettingsOpen) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    const handleTouchOrMove = () => resetTimer();
    
    document.addEventListener('touchstart', handleTouchOrMove);
    document.addEventListener('mousemove', handleTouchOrMove);
    resetTimer();
    
    return () => {
      clearTimeout(timeout);
      document.removeEventListener('touchstart', handleTouchOrMove);
      document.removeEventListener('mousemove', handleTouchOrMove);
    };
  }, [isSettingsOpen]);
  
  // Make sure controls are visible when settings are open
  useEffect(() => {
    if (isSettingsOpen) {
      setShowControls(true);
    }
  }, [isSettingsOpen]);
  
  return (
    <div className="relative flex flex-col h-full w-full bg-black">
      {/* Status Bar */}
      <StatusBar />
      
      {/* Camera Preview */}
      <div className={`relative flex-grow ${facing === 'user' ? 'scale-x-[-1]' : ''}`}>
        {isLoading && <CameraLoading />}
        {error && <CameraError message={error} />}
        
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        
        {/* Streaming Info Overlay */}
        {isStreaming && isCameraReady && <StreamInfo />}
      </div>
      
      {/* Camera Controls */}
      {isCameraReady && (
        <div className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <CameraControls />
        </div>
      )}
      
      {/* Settings Panel */}
      {isSettingsOpen && <SettingsPanel />}
    </div>
  );
};

export default CameraView;
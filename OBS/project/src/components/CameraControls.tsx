import React from 'react';
import { 
  Camera, 
  RefreshCw, 
  ZapOff, 
  Zap, 
  Maximize, 
  Settings, 
  PlayCircle,
  StopCircle
} from 'lucide-react';
import { useCamera } from '../contexts/CameraContext';
import { useStream } from '../contexts/StreamContext';
import { useUI } from '../contexts/UIContext';
import ZoomControl from './controls/ZoomControl';
import IconButton from './ui/IconButton';

const CameraControls: React.FC = () => {
  const { 
    switchCamera, 
    flashEnabled, 
    toggleFlash, 
    capabilities 
  } = useCamera();
  
  const { 
    isStreaming, 
    startStream, 
    stopStream,
    streamStatus
  } = useStream();
  
  const { 
    toggleFullscreen, 
    toggleSettings,
    isFullscreen
  } = useUI();

  const handleStreamToggle = async () => {
    if (isStreaming) {
      stopStream();
    } else {
      await startStream();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <IconButton
          onClick={toggleSettings}
          icon={<Settings className="w-6 h-6" />}
          label="Settings"
        />
        
        <IconButton
          onClick={toggleFullscreen}
          icon={<Maximize className="w-6 h-6" />}
          label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        />
      </div>
      
      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6 pointer-events-auto">
        {capabilities?.torch && (
          <IconButton
            onClick={toggleFlash}
            icon={flashEnabled ? <Zap className="w-6 h-6" /> : <ZapOff className="w-6 h-6" />}
            label={flashEnabled ? "Flash On" : "Flash Off"}
          />
        )}
        
        <IconButton
          onClick={handleStreamToggle}
          icon={isStreaming ? <StopCircle className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
          label={isStreaming ? "Stop Streaming" : "Start Streaming"}
          size="lg"
          color={isStreaming ? "red" : "blue"}
          disabled={streamStatus === 'connecting'}
          loading={streamStatus === 'connecting'}
        />
        
        <IconButton
          onClick={switchCamera}
          icon={<RefreshCw className="w-6 h-6" />}
          label="Switch Camera"
        />
      </div>
      
      {/* Side Controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
        <ZoomControl />
      </div>
    </div>
  );
};

export default CameraControls;
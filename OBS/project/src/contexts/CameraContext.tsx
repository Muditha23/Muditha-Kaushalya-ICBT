import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';

export type CameraFacing = 'environment' | 'user';
export type FocusMode = 'auto' | 'continuous' | 'manual';
export type Resolution = '480p' | '720p' | '1080p';

interface CameraContextType {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraReady: boolean;
  isLoading: boolean;
  error: string | null;
  facing: CameraFacing;
  resolution: Resolution;
  flashEnabled: boolean;
  zoomLevel: number;
  focusMode: FocusMode;
  capabilities: MediaTrackCapabilities | null;
  constraints: MediaTrackConstraints;
  switchCamera: () => Promise<void>;
  setResolution: (res: Resolution) => Promise<void>;
  toggleFlash: () => Promise<void>;
  setZoom: (level: number) => Promise<void>;
  setFocusMode: (mode: FocusMode) => Promise<void>;
  setManualFocus: (distance: number) => Promise<void>;
  getImageCapture: () => ImageCapture | null;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

const resolutionMap: Record<Resolution, { width: number; height: number }> = {
  '480p': { width: 640, height: 480 },
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
};

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraFacing>('environment');
  const [resolution, setResolutionState] = useState<Resolution>('720p');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focusMode, setFocusModeState] = useState<FocusMode>('auto');
  const [capabilities, setCapabilities] = useState<MediaTrackCapabilities | null>(null);
  const [constraints, setConstraints] = useState<MediaTrackConstraints>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const imageCapture = useRef<ImageCapture | null>(null);

  const getImageCapture = useCallback(() => {
    return imageCapture.current;
  }, []);

  const initializeCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const { width, height } = resolutionMap[resolution];
      
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: facing,
          width: { ideal: width },
          height: { ideal: height }
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      const videoTrack = newStream.getVideoTracks()[0];
      if (videoTrack) {
        trackRef.current = videoTrack;
        imageCapture.current = new ImageCapture(videoTrack);
        setCapabilities(videoTrack.getCapabilities());
        setConstraints(videoTrack.getConstraints());

        // Wait for video to be ready
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => {
                setIsCameraReady(true);
                setIsLoading(false);
              }).catch(err => {
                setError('Failed to play video: ' + err.message);
                setIsLoading(false);
              });
            }
          };
        }
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError(err.message || 'Failed to access camera');
      setIsLoading(false);
    }
  }, [facing, resolution, stream]);

  useEffect(() => {
    initializeCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [initializeCamera]);

  const switchCamera = useCallback(async () => {
    setFacing(prev => prev === 'environment' ? 'user' : 'environment');
    return initializeCamera();
  }, [initializeCamera]);

  const setResolution = useCallback(async (res: Resolution) => {
    setResolutionState(res);
    return initializeCamera();
  }, [initializeCamera]);

  const toggleFlash = useCallback(async () => {
    if (trackRef.current && capabilities?.torch) {
      const newFlashState = !flashEnabled;
      try {
        await trackRef.current.applyConstraints({
          advanced: [{ torch: newFlashState }]
        });
        setFlashEnabled(newFlashState);
      } catch (err) {
        console.error('Error toggling flash:', err);
      }
    }
  }, [flashEnabled, capabilities?.torch]);

  const setZoom = useCallback(async (level: number) => {
    if (trackRef.current && capabilities?.zoom) {
      try {
        const min = capabilities.zoom.min || 1;
        const max = capabilities.zoom.max || 10;
        const normalizedLevel = Math.max(min, Math.min(level, max));
        
        await trackRef.current.applyConstraints({
          advanced: [{ zoom: normalizedLevel }]
        });
        setZoomLevel(normalizedLevel);
      } catch (err) {
        console.error('Error setting zoom:', err);
      }
    }
  }, [capabilities?.zoom]);

  const setFocusMode = useCallback(async (mode: FocusMode) => {
    if (trackRef.current && capabilities?.focusMode) {
      try {
        let focusMode: MediaTrackConstraints['focusMode'];
        
        switch (mode) {
          case 'auto':
            focusMode = 'single-shot';
            break;
          case 'continuous':
            focusMode = 'continuous';
            break;
          case 'manual':
            focusMode = 'manual';
            break;
          default:
            focusMode = 'single-shot';
        }
        
        await trackRef.current.applyConstraints({
          advanced: [{ focusMode }]
        });
        setFocusModeState(mode);
      } catch (err) {
        console.error('Error setting focus mode:', err);
      }
    }
  }, [capabilities?.focusMode]);

  const setManualFocus = useCallback(async (distance: number) => {
    if (trackRef.current && capabilities?.focusDistance) {
      try {
        const min = capabilities.focusDistance.min || 0;
        const max = capabilities.focusDistance.max || 1;
        const normalizedDistance = Math.max(min, Math.min(distance, max));
        
        await trackRef.current.applyConstraints({
          advanced: [{ 
            focusMode: 'manual',
            focusDistance: normalizedDistance 
          }]
        });
        setFocusModeState('manual');
      } catch (err) {
        console.error('Error setting manual focus:', err);
      }
    }
  }, [capabilities?.focusDistance]);

  return (
    <CameraContext.Provider value={{
      stream,
      videoRef,
      isCameraReady,
      isLoading,
      error,
      facing,
      resolution,
      flashEnabled,
      zoomLevel,
      focusMode,
      capabilities,
      constraints,
      switchCamera,
      setResolution,
      toggleFlash,
      setZoom,
      setFocusMode,
      setManualFocus,
      getImageCapture
    }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = (): CameraContextType => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};
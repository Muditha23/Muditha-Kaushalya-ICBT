import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

export type SettingsTab = 'camera' | 'stream' | 'about';

interface UIContextType {
  isFullscreen: boolean;
  isSettingsOpen: boolean;
  activeSettingsTab: SettingsTab;
  isRecording: boolean;
  isMuted: boolean;
  batteryLevel: number;
  networkType: string;
  toggleFullscreen: () => void;
  toggleSettings: () => void;
  setSettingsTab: (tab: SettingsTab) => void;
  toggleRecording: () => void;
  toggleMute: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('camera');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [networkType, setNetworkType] = useState('unknown');

  // Battery API
  useEffect(() => {
    const updateBatteryStatus = (battery: any) => {
      setBatteryLevel(Math.floor(battery.level * 100));
      
      // Update on battery changes
      battery.addEventListener('levelchange', () => {
        setBatteryLevel(Math.floor(battery.level * 100));
      });
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then(updateBatteryStatus);
    }
  }, []);

  // Network information
  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setNetworkType(connection.effectiveType || 'unknown');
      }
    };

    updateNetworkInfo();

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  // Fullscreen API
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev);
  }, []);

  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleSetSettingsTab = useCallback((tab: SettingsTab) => {
    setActiveSettingsTab(tab);
  }, []);

  return (
    <UIContext.Provider value={{
      isFullscreen,
      isSettingsOpen,
      activeSettingsTab,
      isRecording,
      isMuted,
      batteryLevel,
      networkType,
      toggleFullscreen,
      toggleSettings,
      setSettingsTab: handleSetSettingsTab,
      toggleRecording,
      toggleMute
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
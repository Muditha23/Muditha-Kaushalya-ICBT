import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useCamera } from './CameraContext';
import { getLocalIP } from '../utils/network';

interface StreamContextType {
  isStreaming: boolean;
  streamUrl: string | null;
  startStream: () => Promise<void>;
  stopStream: () => void;
  streamStatus: 'inactive' | 'connecting' | 'active' | 'error';
  streamError: string | null;
  localIP: string | null;
  streamPort: number;
  streamKey: string;
  connectionCount: number;
  bandwidth: number;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

// WebRTC Configuration
const configuration = {
  iceServers: []  // Use only local network
};

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { stream } = useCamera();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [streamStatus, setStreamStatus] = useState<'inactive' | 'connecting' | 'active' | 'error'>('inactive');
  const [streamError, setStreamError] = useState<string | null>(null);
  const [localIP, setLocalIP] = useState<string | null>(null);
  const [streamPort] = useState(8080);
  const [streamKey] = useState(Math.random().toString(36).substring(2, 10));
  const [connectionCount, setConnectionCount] = useState(0);
  const [bandwidth, setBandwidth] = useState(0);
  const [server, setServer] = useState<any>(null);

  // Get local IP on mount
  useEffect(() => {
    const fetchLocalIP = async () => {
      try {
        const ip = await getLocalIP();
        setLocalIP(ip);
      } catch (error) {
        console.error('Failed to get local IP:', error);
        setLocalIP('unknown');
      }
    };

    fetchLocalIP();
  }, []);

  // Clean up WebRTC connections on unmount
  useEffect(() => {
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
      if (server) {
        server.close();
      }
    };
  }, [peerConnection, server]);

  // Start streaming
  const startStream = useCallback(async () => {
    if (!stream) {
      setStreamError('Camera stream not available');
      return;
    }

    try {
      setStreamStatus('connecting');
      
      // For this implementation, we'll simulate a WebRTC connection
      // In a real app, you'd set up a WebRTC signaling server or use WebSockets
      
      // Create a simulated local stream URL (in reality, this would involve more setup)
      const ip = localIP || 'localhost';
      const url = `http://${ip}:${streamPort}/stream?key=${streamKey}`;
      setStreamUrl(url);

      // Simulate connection
      setTimeout(() => {
        setIsStreaming(true);
        setStreamStatus('active');
        setConnectionCount(1);
        
        // Simulate bandwidth calculation
        const interval = setInterval(() => {
          const videoBitrate = Math.floor(Math.random() * 1000) + 500; // kbps
          setBandwidth(videoBitrate);
        }, 1000);
        
        return () => clearInterval(interval);
      }, 1500);
      
    } catch (err: any) {
      console.error('Streaming error:', err);
      setStreamStatus('error');
      setStreamError(err.message || 'Failed to start streaming');
    }
  }, [stream, localIP, streamPort, streamKey]);

  // Stop streaming
  const stopStream = useCallback(() => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    
    setIsStreaming(false);
    setStreamStatus('inactive');
    setStreamUrl(null);
    setConnectionCount(0);
    setBandwidth(0);
  }, [peerConnection]);

  return (
    <StreamContext.Provider value={{
      isStreaming,
      streamUrl,
      startStream,
      stopStream,
      streamStatus,
      streamError,
      localIP,
      streamPort,
      streamKey,
      connectionCount,
      bandwidth
    }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = (): StreamContextType => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};
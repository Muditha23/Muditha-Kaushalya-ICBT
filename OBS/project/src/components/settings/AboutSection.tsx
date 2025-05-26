import React from 'react';
import { Camera, Github, Globe, Info } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-6">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
          <Camera className="w-12 h-12 text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-center">Mobile Camera Stream</h3>
      <p className="text-gray-400 text-center text-sm">
        A lightweight, browser-based solution for mobile camera streaming
      </p>
      
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-medium flex items-center">
          <Info className="w-4 h-4 mr-2 text-blue-400" />
          How It Works
        </h4>
        <p className="text-xs text-gray-300">
          This app uses WebRTC technology to stream your mobile camera video over your local network. It works entirely in your browser - no installation needed! 
        </p>
        <p className="text-xs text-gray-300">
          Share your stream with any device on the same network, or use it with OBS for professional streaming and recording.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-medium">Troubleshooting</h4>
        <ul className="text-xs text-gray-300 space-y-2">
          <li>
            <strong>Can't access camera?</strong> Make sure you've granted camera permissions in your browser settings.
          </li>
          <li>
            <strong>Stream not working?</strong> Ensure both devices are on the same network and try using the IP address directly.
          </li>
          <li>
            <strong>Poor quality?</strong> Lower the resolution in camera settings or check your network connection.
          </li>
          <li>
            <strong>OBS not connecting?</strong> Make sure to use the specific OBS URL with your stream key.
          </li>
        </ul>
      </div>
      
      <div className="pt-4 border-t border-gray-700 flex justify-center space-x-4">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white flex items-center text-xs"
        >
          <Github className="w-4 h-4 mr-1" />
          GitHub
        </a>
        <a 
          href="https://example.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white flex items-center text-xs"
        >
          <Globe className="w-4 h-4 mr-1" />
          Website
        </a>
      </div>
      
      <div className="text-center text-gray-500 text-xs">
        Version 1.0.0
      </div>
    </div>
  );
};

export default AboutSection;
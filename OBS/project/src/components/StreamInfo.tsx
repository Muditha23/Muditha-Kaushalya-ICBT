import React, { useState, useEffect } from 'react';
import { Link, Share2 } from 'lucide-react';
import { useStream } from '../contexts/StreamContext';
import { copyToClipboard } from '../utils/clipboard';

const StreamInfo: React.FC = () => {
  const { 
    streamUrl, 
    localIP, 
    streamPort,
    connectionCount,
    bandwidth
  } = useStream();
  
  const [showCopied, setShowCopied] = useState(false);
  
  const handleCopyUrl = () => {
    if (streamUrl) {
      copyToClipboard(streamUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };
  
  // Calculate stream quality indicator
  const getQualityIndicator = () => {
    if (bandwidth < 500) return { color: 'red', text: 'Low' };
    if (bandwidth < 1500) return { color: 'yellow', text: 'Medium' };
    return { color: 'green', text: 'High' };
  };
  
  const quality = getQualityIndicator();

  return (
    <div className="absolute bottom-24 left-4 right-4 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full bg-${quality.color}-500 mr-2`}></div>
          <span>Stream Quality: {quality.text}</span>
        </div>
        <div>
          {connectionCount} viewer{connectionCount !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="mt-2 flex items-center">
        <Link className="w-4 h-4 mr-2 text-blue-400" />
        <div className="flex-1 truncate mr-2 bg-gray-800 rounded px-2 py-1 text-gray-300 text-xs">
          {streamUrl || `http://${localIP || 'localhost'}:${streamPort}/stream`}
        </div>
        <button 
          onClick={handleCopyUrl}
          className="bg-blue-600 p-1 rounded text-xs flex items-center"
        >
          <Share2 className="w-3 h-3 mr-1" />
          {showCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default StreamInfo;
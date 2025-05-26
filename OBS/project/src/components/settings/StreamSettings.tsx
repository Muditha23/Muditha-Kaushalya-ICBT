import React, { useState } from 'react';
import { useStream } from '../../contexts/StreamContext';
import { Copy, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import SettingItem from '../ui/SettingItem';

const StreamSettings: React.FC = () => {
  const { 
    streamUrl, 
    localIP, 
    streamPort, 
    streamKey,
    isStreaming,
    startStream,
    stopStream
  } = useStream();
  
  const [showCopied, setShowCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, type: string) => {
    copyToClipboard(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(null), 2000);
  };
  
  const getStreamUrl = () => {
    return streamUrl || `http://${localIP || 'localhost'}:${streamPort}/stream`;
  };
  
  const getObsUrl = () => {
    return `${getStreamUrl()}?key=${streamKey}`;
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-4">Stream Settings</h3>

      <SettingItem
        title="Stream Status"
        description="Start or stop the camera stream"
      >
        <button
          onClick={isStreaming ? stopStream : startStream}
          className={`px-4 py-2 ${isStreaming ? 'bg-red-600' : 'bg-blue-600'} text-white text-sm rounded-lg`}
        >
          {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
        </button>
      </SettingItem>

      <SettingItem
        title="Stream URL"
        description="URL for viewing the stream"
      >
        <div className="flex items-center">
          <input
            type="text"
            readOnly
            value={getStreamUrl()}
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none truncate text-xs"
          />
          <button
            onClick={() => handleCopy(getStreamUrl(), 'url')}
            className="ml-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            title="Copy URL"
          >
            {showCopied === 'url' ? (
              <span className="text-green-500 text-xs px-2">Copied!</span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </SettingItem>

      <SettingItem
        title="OBS Browser Source URL"
        description="URL for OBS Browser Source"
      >
        <div className="flex items-center">
          <input
            type="text"
            readOnly
            value={getObsUrl()}
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none truncate text-xs"
          />
          <button
            onClick={() => handleCopy(getObsUrl(), 'obs')}
            className="ml-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            title="Copy OBS URL"
          >
            {showCopied === 'obs' ? (
              <span className="text-green-500 text-xs px-2">Copied!</span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </SettingItem>

      <SettingItem
        title="Stream Key"
        description="Required for connecting to the stream"
      >
        <div className="flex items-center">
          <input
            type="text"
            readOnly
            value={streamKey}
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none"
          />
          <button
            onClick={() => handleCopy(streamKey, 'key')}
            className="ml-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            title="Copy Stream Key"
          >
            {showCopied === 'key' ? (
              <span className="text-green-500 text-xs px-2">Copied!</span>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </SettingItem>

      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h4 className="text-sm font-medium text-white mb-2">OBS Setup Instructions</h4>
        <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
          <li>Open OBS Studio</li>
          <li>Add a new "Browser Source" to your scene</li>
          <li>Copy and paste the OBS URL above into the URL field</li>
          <li>Set width and height to match your resolution</li>
          <li>Enable "Control audio via OBS" if you want audio</li>
          <li>Click "OK" to add the source</li>
        </ol>
        <a 
          href="https://obsproject.com/wiki/Sources-Guide#browser-source" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-3 text-blue-400 hover:underline text-sm"
        >
          OBS Browser Source Guide
          <ExternalLink className="ml-1 w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default StreamSettings;
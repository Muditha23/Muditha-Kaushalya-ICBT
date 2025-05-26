import React from 'react';
import { X } from 'lucide-react';
import { useUI, SettingsTab } from '../contexts/UIContext';
import CameraSettings from './settings/CameraSettings';
import StreamSettings from './settings/StreamSettings';
import AboutSection from './settings/AboutSection';
import IconButton from './ui/IconButton';

const SettingsPanel: React.FC = () => {
  const { isSettingsOpen, toggleSettings, activeSettingsTab, setSettingsTab } = useUI();

  const tabs: Array<{ id: SettingsTab; label: string }> = [
    { id: 'camera', label: 'Camera' },
    { id: 'stream', label: 'Stream' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className={`absolute inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm transition-all duration-300 ${isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="h-full w-full md:w-96 md:max-w-md bg-gray-900 shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Settings</h2>
          <IconButton
            onClick={toggleSettings}
            icon={<X className="w-5 h-5" />}
            label="Close"
            variant="ghost"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex-1 py-3 font-medium text-sm focus:outline-none ${
                activeSettingsTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSettingsTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeSettingsTab === 'camera' && <CameraSettings />}
          {activeSettingsTab === 'stream' && <StreamSettings />}
          {activeSettingsTab === 'about' && <AboutSection />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
import React from 'react';
import { useCamera } from '../../contexts/CameraContext';
import SettingItem from '../ui/SettingItem';

const CameraSettings: React.FC = () => {
  const {
    resolution,
    setResolution,
    flashEnabled,
    toggleFlash,
    focusMode,
    setFocusMode,
    setManualFocus,
    facing,
    switchCamera,
    capabilities
  } = useCamera();

  // Focus distance slider (only shown when manual focus is enabled)
  const renderFocusDistanceControl = () => {
    if (focusMode !== 'manual' || !capabilities?.focusDistance) return null;
    
    const min = capabilities.focusDistance.min || 0;
    const max = capabilities.focusDistance.max || 1;
    const step = capabilities.focusDistance.step || 0.01;
    
    return (
      <div className="mt-2">
        <label className="block text-xs text-gray-400 mb-1">Focus Distance</label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          onChange={(e) => setManualFocus(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Near</span>
          <span>Far</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white mb-4">Camera Settings</h3>

      <SettingItem
        title="Camera"
        description="Switch between front and back camera"
      >
        <button
          onClick={switchCamera}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg"
        >
          Switch to {facing === 'environment' ? 'Front' : 'Back'} Camera
        </button>
      </SettingItem>

      <SettingItem
        title="Resolution"
        description="Set the video resolution"
      >
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value as any)}
          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
      </SettingItem>

      {capabilities?.focusMode && (
        <SettingItem
          title="Focus Mode"
          description="Set camera focus behavior"
        >
          <select
            value={focusMode}
            onChange={(e) => setFocusMode(e.target.value as any)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="auto">Auto Focus</option>
            <option value="continuous">Continuous</option>
            <option value="manual">Manual</option>
          </select>
          
          {renderFocusDistanceControl()}
        </SettingItem>
      )}

      {capabilities?.torch && (
        <SettingItem
          title="Flash/Torch"
          description="Toggle the camera flash"
        >
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={flashEnabled}
              onChange={toggleFlash}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-300">
              {flashEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </SettingItem>
      )}
    </div>
  );
};

export default CameraSettings;
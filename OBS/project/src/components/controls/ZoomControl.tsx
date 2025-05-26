import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCamera } from '../../contexts/CameraContext';

const ZoomControl: React.FC = () => {
  const { zoomLevel, setZoom, capabilities } = useCamera();
  
  const minZoom = capabilities?.zoom?.min || 1;
  const maxZoom = capabilities?.zoom?.max || 5;
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoomLevel + 0.5, maxZoom));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoomLevel - 0.5, minZoom));
  };
  
  // Calculate the fill percentage for the zoom indicator
  const fillPercentage = ((zoomLevel - minZoom) / (maxZoom - minZoom)) * 100;
  
  return (
    <div className="flex flex-col items-center bg-black bg-opacity-40 backdrop-blur-sm rounded-full py-2">
      <button
        onClick={handleZoomIn}
        disabled={zoomLevel >= maxZoom}
        className="p-2 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5" />
      </button>
      
      <div className="my-1 w-1 h-16 bg-gray-700 rounded-full relative overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-blue-500 rounded-full transition-all duration-200"
          style={{ height: `${fillPercentage}%` }}
        />
      </div>
      
      <button
        onClick={handleZoomOut}
        disabled={zoomLevel <= minZoom}
        className="p-2 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5" />
      </button>
      
      <div className="mt-1 text-xs font-mono text-white">
        {zoomLevel.toFixed(1)}x
      </div>
    </div>
  );
};

export default ZoomControl;
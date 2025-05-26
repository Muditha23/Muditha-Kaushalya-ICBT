import React from 'react';
import { Camera } from 'lucide-react';

const CameraLoading: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
      <div className="animate-pulse mb-4">
        <Camera className="w-16 h-16 text-blue-500" />
      </div>
      <h2 className="text-xl font-medium text-white mb-2">Camera Loading</h2>
      <p className="text-gray-400 text-center max-w-xs">
        Please wait while we access your camera...
      </p>
      <div className="mt-6 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default CameraLoading;
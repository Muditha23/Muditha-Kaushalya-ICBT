import React from 'react';
import { AlertOctagon } from 'lucide-react';

interface CameraErrorProps {
  message: string;
}

const CameraError: React.FC<CameraErrorProps> = ({ message }) => {
  const getErrorMessage = () => {
    if (message.includes('Permission denied') || message.includes('permission')) {
      return {
        title: 'Camera Permission Denied',
        details: 'Please allow camera access in your browser settings to use this app.',
      };
    } else if (message.includes('device')) {
      return {
        title: 'Camera Device Error',
        details: 'Unable to access your camera device. Try using a different camera or restarting your device.',
      };
    } else {
      return {
        title: 'Camera Error',
        details: message || 'An unknown error occurred while trying to access the camera.',
      };
    }
  };

  const error = getErrorMessage();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 p-6">
      <div className="mb-4">
        <AlertOctagon className="w-16 h-16 text-red-500" />
      </div>
      <h2 className="text-xl font-medium text-white mb-2">{error.title}</h2>
      <p className="text-gray-300 text-center max-w-xs mb-6">
        {error.details}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default CameraError;
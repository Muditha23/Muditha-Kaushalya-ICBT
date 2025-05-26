import React, { useEffect } from 'react';
import CameraView from './components/CameraView';
import { CameraProvider } from './contexts/CameraContext';
import { StreamProvider } from './contexts/StreamContext';
import { UIProvider } from './contexts/UIContext';

function App() {
  useEffect(() => {
    // Prevent screen from sleeping
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        navigator.wakeLock?.request('screen').catch((err) => {
          console.log('Wake Lock error:', err);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <UIProvider>
      <CameraProvider>
        <StreamProvider>
          <div className="fixed inset-0 flex flex-col bg-black">
            <CameraView />
          </div>
        </StreamProvider>
      </CameraProvider>
    </UIProvider>
  );
}

export default App;
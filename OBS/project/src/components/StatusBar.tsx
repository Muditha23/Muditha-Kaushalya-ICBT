import React, { useEffect, useState } from 'react';
import { Wifi, Battery, BatteryWarning, BatteryCharging } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useStream } from '../contexts/StreamContext';

const StatusBar: React.FC = () => {
  const { batteryLevel, networkType } = useUI();
  const { isStreaming, bandwidth, connectionCount } = useStream();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getNetworkIcon = () => {
    let className = '';
    
    switch(networkType) {
      case '4g':
        className = 'text-green-500';
        break;
      case '3g':
        className = 'text-yellow-500';
        break;
      case '2g':
      case 'slow-2g':
        className = 'text-red-500';
        break;
      default:
        className = 'text-white';
    }
    
    return <Wifi className={`w-4 h-4 ${className}`} />;
  };
  
  const getBatteryIcon = () => {
    if (batteryLevel <= 15) {
      return <BatteryWarning className="w-4 h-4 text-red-500" />;
    } else if (batteryLevel <= 100) {
      return <Battery className={`w-4 h-4 ${batteryLevel <= 30 ? 'text-yellow-500' : 'text-green-500'}`} />;
    } else {
      return <BatteryCharging className="w-4 h-4 text-green-500" />;
    }
  };
  
  return (
    <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 flex items-center justify-between text-xs z-10">
      <div className="flex items-center space-x-2">
        {isStreaming && (
          <>
            <div className="flex items-center">
              <span className="animate-pulse w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              <span className="font-medium">LIVE</span>
            </div>
            <div className="text-gray-300">
              {connectionCount} viewer{connectionCount !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
      
      <div className="text-sm font-medium">
        {formatTime(currentTime)}
      </div>
      
      <div className="flex items-center space-x-3">
        {isStreaming && (
          <div className="text-xs">
            {Math.round(bandwidth)} kbps
          </div>
        )}
        <div className="flex items-center space-x-1">
          <div>{getNetworkIcon()}</div>
          <div>{networkType.toUpperCase()}</div>
        </div>
        <div className="flex items-center space-x-1">
          <div>{getBatteryIcon()}</div>
          <div>{batteryLevel}%</div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
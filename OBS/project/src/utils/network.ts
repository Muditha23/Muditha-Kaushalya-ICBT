/**
 * Attempts to get the local IP address of the device
 * This is needed to create a stream URL that other devices on the network can access
 */
export const getLocalIP = async (): Promise<string> => {
  try {
    // Try using WebRTC to get local IP (most reliable method)
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    return new Promise<string>((resolve, reject) => {
      const ipRegex = /(?:^|\s)(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?=\s|$)/;
      
      // Set timeout in case we can't get the IP
      const timeout = setTimeout(() => {
        pc.close();
        reject(new Error('Timed out getting local IP'));
      }, 5000);
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidateString = event.candidate.candidate;
          const match = ipRegex.exec(candidateString);
          
          if (match) {
            const ip = match[0].trim();
            if (!ip.startsWith('127.')) {
              clearTimeout(timeout);
              pc.close();
              resolve(ip);
            }
          }
        }
      };
      
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') {
          clearTimeout(timeout);
          pc.close();
          reject(new Error('No non-local IP found'));
        }
      };
    });
  } catch (error) {
    console.error('Error getting local IP:', error);
    
    // Fallback method: Return a placeholder
    return 'Connect devices to same WiFi';
  }
};

/**
 * Checks if the device is on a private network
 */
export const isPrivateNetwork = async (): Promise<boolean> => {
  try {
    const ip = await getLocalIP();
    // Check if IP starts with private network ranges
    return ip.startsWith('10.') || 
           ip.startsWith('192.168.') || 
           /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip);
  } catch (error) {
    console.error('Error checking network type:', error);
    return false;
  }
};
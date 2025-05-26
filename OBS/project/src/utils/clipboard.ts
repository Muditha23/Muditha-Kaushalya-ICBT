/**
 * Cross-browser clipboard copy function
 */
export const copyToClipboard = (text: string): Promise<void> => {
  // Try using the modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text)
      .catch(err => {
        console.error('Failed to copy using Clipboard API:', err);
        // Fall back to legacy method
        return legacyCopy(text);
      });
  }
  
  // Use legacy method for browsers without Clipboard API support
  return legacyCopy(text);
};

/**
 * Legacy method to copy text using document.execCommand
 * This is needed for browsers that don't support the Clipboard API
 */
const legacyCopy = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      
      // Set its value to the string to be copied
      textArea.value = text;
      
      // Make it invisible
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Execute the copy command
      const successful = document.execCommand('copy');
      
      // Clean up
      document.body.removeChild(textArea);
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('Unable to copy to clipboard'));
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Utility functions for image handling
 */

/**
 * Convert a Base64 string to a Blob
 */
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteString = window.atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
}

/**
 * Convert an image file to Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Compress an image file to reduce its size
 * Returns a new File instance with compressed data
 */
export async function compressImage(file: File, maxSizeMB: number = 0.7): Promise<File> {
  // This is a placeholder for an image compression function
  // In a real app, you would use a library like compressorjs or browser-image-compression
  
  // For now, we'll just return the original file
  // In a real implementation, you would:
  // 1. Draw the image onto a canvas
  // 2. Export with reduced quality
  // 3. Create a new File object with the compressed data
  console.log("Image compression would be applied here");
  return file;
}

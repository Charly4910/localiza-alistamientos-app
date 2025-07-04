
import React, { useRef } from 'react';
import { Check } from 'lucide-react';
import { PhotoType, PHOTO_LABELS } from '@/types/vehicle';

interface PhotoCaptureProps {
  photoType: PhotoType;
  onPhotoCapture: (photoType: PhotoType, file: File) => void;
  capturedPhoto?: string;
}

const PhotoCapture = ({ photoType, onPhotoCapture, capturedPhoto }: PhotoCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoCapture(photoType, file);
    }
    event.target.value = '';
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openCamera}
        className={`w-full h-16 rounded-lg font-medium text-sm transition-all duration-200 ${
          capturedPhoto 
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md' 
            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl'
        } transform hover:scale-105`}
      >
        <div className="flex items-center justify-center space-x-2">
          {capturedPhoto && <Check className="w-4 h-4" />}
          <span className="text-center leading-tight">
            {PHOTO_LABELS[photoType]}
          </span>
        </div>
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default PhotoCapture;

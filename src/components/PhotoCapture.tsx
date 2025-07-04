
import React, { useRef } from 'react';
import { Camera, Check } from 'lucide-react';
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
    // Limpiar el input para permitir seleccionar la misma foto nuevamente
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
        className={`photo-button w-full ${capturedPhoto ? 'photo-button-captured' : ''}`}
      >
        {capturedPhoto ? (
          <Check className="w-8 h-8 mb-2" />
        ) : (
          <Camera className="w-8 h-8 mb-2" />
        )}
        <span className="text-center text-sm leading-tight">
          {PHOTO_LABELS[photoType]}
        </span>
        {capturedPhoto && (
          <span className="text-xs opacity-90 mt-1">
            ✓ Foto capturada
          </span>
        )}
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

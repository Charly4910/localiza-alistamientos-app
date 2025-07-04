
import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PhotoType, PHOTO_LABELS } from '@/types/vehicle';

interface PhotoCaptureProps {
  photoType: PhotoType;
  onPhotoCapture: (photoType: PhotoType, file: File) => void;
  capturedPhoto?: string;
  onRemovePhoto: (photoType: PhotoType) => void;
}

const PhotoCapture = ({ photoType, onPhotoCapture, capturedPhoto, onRemovePhoto }: PhotoCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoCapture(photoType, file);
    }
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm text-green-800 mb-3">
          {PHOTO_LABELS[photoType]}
        </h3>
        
        {capturedPhoto ? (
          <div className="relative">
            <img
              src={capturedPhoto}
              alt={PHOTO_LABELS[photoType]}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onRemovePhoto(photoType)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
            <Camera className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              Toca para capturar foto
            </p>
            <Button
              onClick={openCamera}
              className="localiza-gradient text-white"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Capturar Foto
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default PhotoCapture;

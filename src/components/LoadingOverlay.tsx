
import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay = ({ isVisible, message = "Cargando..." }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/47630edb-97ec-4500-a43a-55dc80f062d5.png" 
            alt="Localiza Symbol" 
            className="h-16 w-16 mx-auto animate-pulse"
          />
        </div>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">
          {message}
        </h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

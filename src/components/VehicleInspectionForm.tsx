
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PhotoCapture from './PhotoCapture';
import { PhotoType, VehicleInspection, PHOTO_LABELS } from '@/types/vehicle';

interface VehicleInspectionFormProps {
  onInspectionSave: (inspection: Omit<VehicleInspection, 'id' | 'timestamp'>) => void;
  user: {
    email: string;
    name: string;
  };
}

const VehicleInspectionForm = ({ onInspectionSave, user }: VehicleInspectionFormProps) => {
  const [placa, setPlaca] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [photos, setPhotos] = useState<Record<PhotoType, File | null>>({
    frontal: null,
    panoramico: null,
    izquierda: null,
    panoramico_interno: null,
    interior_delantero: null,
    interior_trasero: null,
    interior_techo: null,
    llanta_p1: null,
    llanta_p2: null,
    trasera: null,
    kit_carretera: null,
    repuesto_gata: null,
    derecha: null,
    llanta_p3: null,
    llanta_p4: null,
  });
  const [photoUrls, setPhotoUrls] = useState<Record<PhotoType, string | null>>({
    frontal: null,
    panoramico: null,
    izquierda: null,
    panoramico_interno: null,
    interior_delantero: null,
    interior_trasero: null,
    interior_techo: null,
    llanta_p1: null,
    llanta_p2: null,
    trasera: null,
    kit_carretera: null,
    repuesto_gata: null,
    derecha: null,
    llanta_p3: null,
    llanta_p4: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const photoTypes: PhotoType[] = [
    'frontal', 'panoramico', 'izquierda', 'panoramico_interno',
    'interior_delantero', 'interior_trasero', 'interior_techo',
    'llanta_p1', 'llanta_p2', 'trasera', 'kit_carretera',
    'repuesto_gata', 'derecha', 'llanta_p3', 'llanta_p4'
  ];

  const handlePhotoCapture = (photoType: PhotoType, file: File) => {
    const url = URL.createObjectURL(file);
    setPhotos(prev => ({ ...prev, [photoType]: file }));
    setPhotoUrls(prev => ({ ...prev, [photoType]: url }));
  };

  const handleRemovePhoto = (photoType: PhotoType) => {
    if (photoUrls[photoType]) {
      URL.revokeObjectURL(photoUrls[photoType]!);
    }
    setPhotos(prev => ({ ...prev, [photoType]: null }));
    setPhotoUrls(prev => ({ ...prev, [photoType]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!placa.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor ingresa la placa del vehículo",
        variant: "destructive",
      });
      return;
    }

    const capturedPhotos = Object.entries(photos).filter(([_, file]) => file !== null);
    
    if (capturedPhotos.length === 0) {
      toast({
        title: "Fotos requeridas",
        description: "Debes capturar al menos una foto para completar el alistamiento",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular guardado de fotos
      const vehiclePhotos = capturedPhotos.map(([type, file]) => ({
        id: `${Date.now()}-${type}`,
        type: type as PhotoType,
        url: photoUrls[type as PhotoType]!,
        timestamp: new Date()
      }));

      const inspection: Omit<VehicleInspection, 'id' | 'timestamp'> = {
        placa: placa.toUpperCase(),
        photos: vehiclePhotos,
        observaciones,
        inspector: user
      };

      onInspectionSave(inspection);

      toast({
        title: "Alistamiento guardado",
        description: `El alistamiento del vehículo ${placa.toUpperCase()} ha sido guardado exitosamente`,
      });

      // Limpiar formulario
      setPlaca('');
      setObservaciones('');
      Object.values(photoUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
      setPhotos(Object.fromEntries(photoTypes.map(type => [type, null])) as Record<PhotoType, File | null>);
      setPhotoUrls(Object.fromEntries(photoTypes.map(type => [type, null])) as Record<PhotoType, string | null>);

    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el alistamiento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-green-600" />
            <span>Información del Vehículo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
                Placa del Vehículo
              </label>
              <Input
                id="placa"
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="uppercase"
                maxLength={6}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fotos del Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="photo-grid">
            {photoTypes.map((photoType) => (
              <PhotoCapture
                key={photoType}
                photoType={photoType}
                onPhotoCapture={handlePhotoCapture}
                capturedPhoto={photoUrls[photoType] || undefined}
                onRemovePhoto={handleRemovePhoto}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observaciones Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Escribe aquí cualquier observación adicional sobre el estado del vehículo..."
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          type="submit"
          className="localiza-gradient text-white px-8 py-3 text-lg"
          disabled={isLoading}
        >
          <Save className="w-5 h-5 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar Alistamiento'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleInspectionForm;

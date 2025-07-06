import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Car, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PhotoCapture from './PhotoCapture';
import { PhotoType, VehicleInspection, PHOTO_LABELS, User } from '@/types/vehicle';
import { uploadPhotoToFirebase, saveInspectionToFirestore } from '@/lib/firebaseUtils';

interface VehicleInspectionFormProps {
  onInspectionSave: (inspection: Omit<VehicleInspection, 'id' | 'timestamp' | 'consecutiveNumber'>) => void;
  user: User;
}

const VehicleInspectionForm = ({ onInspectionSave, user }: VehicleInspectionFormProps) => {
  const [placa, setPlaca] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaVencimientoExtintor, setFechaVencimientoExtintor] = useState('');
  const [photos, setPhotos] = useState<Record<PhotoType, File | null>>({
    frontal: null,
    panoramico: null,
    izquierda: null,
    llanta_p1: null,
    llanta_p3: null,
    panoramico_interno: null,
    interior_delantera: null,
    interior_trasera: null,
    interior_techo: null,
    kit_carretera: null,
    repuesto_gata: null,
    trasera: null,
    llanta_p4: null,
    llanta_p2: null,
    derecha: null,
  });
  const [photoUrls, setPhotoUrls] = useState<Record<PhotoType, string | null>>({
    frontal: null,
    panoramico: null,
    izquierda: null,
    llanta_p1: null,
    llanta_p3: null,
    panoramico_interno: null,
    interior_delantera: null,
    interior_trasera: null,
    interior_techo: null,
    kit_carretera: null,
    repuesto_gata: null,
    trasera: null,
    llanta_p4: null,
    llanta_p2: null,
    derecha: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const photoTypes: PhotoType[] = [
    'frontal', 'panoramico', 'izquierda', 'llanta_p1', 'llanta_p3',
    'panoramico_interno', 'interior_delantera', 'interior_trasera', 'interior_techo',
    'kit_carretera', 'repuesto_gata', 'trasera', 'llanta_p4', 'llanta_p2', 'derecha'
  ];

  const handlePhotoCapture = (photoType: PhotoType, file: File) => {
    const url = URL.createObjectURL(file);
    setPhotos(prev => ({ ...prev, [photoType]: file }));
    setPhotoUrls(prev => ({ ...prev, [photoType]: url }));

    toast({
      title: "Foto capturada",
      description: `${PHOTO_LABELS[photoType]} guardada exitosamente`,
    });
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
      const vehiclePhotos = await Promise.all(
        capturedPhotos.map(async ([type, file]) => {
          const url = await uploadPhotoToFirebase(
            file as File,
            placa.toUpperCase(),
            type
          );
          return {
            id: `${Date.now()}-${type}`,
            type: type as PhotoType,
            url,
            timestamp: new Date(),
          };
        })
      );

      const inspection: Omit<VehicleInspection, 'id' | 'timestamp' | 'consecutiveNumber'> = {
        placa: placa.toUpperCase(),
        photos: vehiclePhotos,
        observaciones,
        fechaVencimientoExtintor: fechaVencimientoExtintor || undefined,
        inspector: {
          email: user.email,
          name: user.name,
          userId: user.id,
        },
        department: user.department || 'No asignada',
      };

      await saveInspectionToFirestore({
        ...inspection,
        id: `inspection_${Date.now()}`,
        timestamp: new Date(),
        consecutiveNumber: 0, // Puedes ajustar este número si manejas consecutivos
      });

      onInspectionSave(inspection);

      toast({
        title: "✅ Alistamiento completado",
        description: `El alistamiento del vehículo ${placa.toUpperCase()} ha sido guardado exitosamente`,
      });

      // Limpiar formulario
      setPlaca('');
      setObservaciones('');
      setFechaVencimientoExtintor('');
      Object.values(photoUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
      setPhotos(Object.fromEntries(photoTypes.map(type => [type, null])) as Record<PhotoType, File | null>);
      setPhotoUrls(Object.fromEntries(photoTypes.map(type => [type, null])) as Record<PhotoType, string | null>);

    } catch (error) {
      console.error(error);
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-green-800">
              <Car className="w-6 h-6" />
              <span>Información del Vehículo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label htmlFor="placa" className="block text-sm font-semibold text-gray-700 mb-2">
                Placa del Vehículo *
              </label>
              <Input
                id="placa"
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="uppercase text-lg font-semibold h-12 border-2 border-green-200 focus:border-green-500"
                maxLength={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-green-800 text-xl">📸 Captura de Fotos</CardTitle>
            <p className="text-gray-600">Toca cada botón para abrir la cámara y capturar la foto correspondiente</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photoTypes.map((photoType) => (
                <PhotoCapture
                  key={photoType}
                  photoType={photoType}
                  onPhotoCapture={handlePhotoCapture}
                  capturedPhoto={photoUrls[photoType] || undefined}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-green-800">
              <Calendar className="w-6 h-6" />
              <span>Fecha de Vencimiento del Extintor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label htmlFor="fechaExtintor" className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de Vencimiento del Extintor
              </label>
              <Input
                id="fechaExtintor"
                type="date"
                value={fechaVencimientoExtintor}
                onChange={(e) => setFechaVencimientoExtintor(e.target.value)}
                className="h-12 border-2 border-green-200 focus:border-green-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-green-800">📝 Observaciones Adicionales</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Escribe aquí cualquier observación adicional sobre el estado del vehículo..."
              rows={4}
              className="w-full border-2 border-green-200 focus:border-green-500 resize-none"
            />
          </CardContent>
        </Card>

        <div className="flex justify-center py-6">
          <Button
            type="submit"
            className="localiza-gradient text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            disabled={isLoading}
            size="lg"
          >
            <Save className="w-6 h-6 mr-3" />
            {isLoading ? 'Guardando Alistamiento...' : 'Guardar Alistamiento Completo'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleInspectionForm;

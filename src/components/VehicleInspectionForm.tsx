import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { User } from '@/types/vehicle';

interface VehicleInspectionFormProps {
  user: User;
}

type PhotoType = 'frontal' | 'lateral_derecha' | 'lateral_izquierda' | 'posterior' | 'llanta_repuesto' | 'extintor';

const VehicleInspectionForm = ({ user }: VehicleInspectionFormProps) => {
  const [placa, setPlaca] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fechaVencimientoExtintor, setFechaVencimientoExtintor] = useState<Date | undefined>(undefined);
  const [capturedPhotos, setCapturedPhotos] = useState<{ [key in PhotoType]?: File }>({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { uploadPhoto, createInspection, addInspectionPhoto, fetchData } = useSupabaseData();

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

    setIsLoading(true);

    try {
      // Crear el alistamiento
      const inspectionData = {
        placa: placa.toUpperCase(),
        observaciones: observaciones || null,
        fecha_vencimiento_extintor: fechaVencimientoExtintor ? format(fechaVencimientoExtintor, 'yyyy-MM-dd') : null,
        inspector_id: user.id,
        agency_id: user.department !== 'Sin asignar' ? user.department : null,
      };

      const inspection = await createInspection(inspectionData);
      
      if (inspection) {
        // Subir fotos si existen
        for (const [type, file] of Object.entries(capturedPhotos)) {
          if (file) {
            try {
              const photoUrl = await uploadPhoto(file, inspection.id, type as PhotoType);
              await addInspectionPhoto(inspection.id, type as PhotoType, photoUrl);
            } catch (photoError) {
              console.error(`Error uploading ${type}:`, photoError);
            }
          }
        }

        toast({
          title: "¡Alistamiento completado!",
          description: `Alistamiento #${inspection.consecutive_number} guardado exitosamente`,
        });

        // Reset form
        setPlaca('');
        setObservaciones('');
        setFechaVencimientoExtintor(undefined);
        setCapturedPhotos({});
        setIsLoading(false);
        
        // Refresh data
        await fetchData();
      }
    } catch (error) {
      console.error('Error creating inspection:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el alistamiento. Intenta nuevamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handlePhotoCapture = (type: PhotoType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCapturedPhotos(prevPhotos => ({ ...prevPhotos, [type]: file }));
    }
  };

  const clearPhoto = (type: PhotoType) => {
    setCapturedPhotos(prevPhotos => {
      const newPhotos = { ...prevPhotos };
      delete newPhotos[type];
      return newPhotos;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="placa">Placa del Vehículo</Label>
        <Input
          type="text"
          id="placa"
          placeholder="Ingresa la placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          placeholder="Ingresa las observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <Label>Fecha de Vencimiento del Extintor</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !fechaVencimientoExtintor && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fechaVencimientoExtintor ? (
                format(fechaVencimientoExtintor, "PPP")
              ) : (
                <span>Seleccionar fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fechaVencimientoExtintor}
              onSelect={setFechaVencimientoExtintor}
              disabled={(date) =>
                date < new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Frontal Photo */}
        <div>
          <Label htmlFor="frontalPhoto">Foto Frontal</Label>
          <Input
            type="file"
            id="frontalPhoto"
            accept="image/*"
            onChange={(e) => handlePhotoCapture('frontal', e)}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('frontalPhoto')?.click()}
            >
              Tomar Foto
            </Button>
            {capturedPhotos['frontal'] && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => clearPhoto('frontal')}
              >
                Quitar
              </Button>
            )}
          </div>
          {capturedPhotos['frontal'] && (
            <img
              src={URL.createObjectURL(capturedPhotos['frontal'])}
              alt="Foto Frontal"
              className="mt-2 rounded-md"
            />
          )}
        </div>

        {/* Lateral Derecha Photo */}
        <div>
          <Label htmlFor="lateralDerechaPhoto">Foto Lateral Derecha</Label>
          <Input
            type="file"
            id="lateralDerechaPhoto"
            accept="image/*"
            onChange={(e) => handlePhotoCapture('lateral_derecha', e)}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('lateralDerechaPhoto')?.click()}
            >
              Tomar Foto
            </Button>
            {capturedPhotos['lateral_derecha'] && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => clearPhoto('lateral_derecha')}
              >
                Quitar
              </Button>
            )}
          </div>
          {capturedPhotos['lateral_derecha'] && (
            <img
              src={URL.createObjectURL(capturedPhotos['lateral_derecha'])}
              alt="Foto Lateral Derecha"
              className="mt-2 rounded-md"
            />
          )}
        </div>

        {/* Lateral Izquierda Photo */}
        <div>
          <Label htmlFor="lateralIzquierdaPhoto">Foto Lateral Izquierda</Label>
          <Input
            type="file"
            id="lateralIzquierdaPhoto"
            accept="image/*"
            onChange={(e) => handlePhotoCapture('lateral_izquierda', e)}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('lateralIzquierdaPhoto')?.click()}
            >
              Tomar Foto
            </Button>
            {capturedPhotos['lateral_izquierda'] && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => clearPhoto('lateral_izquierda')}
              >
                Quitar
              </Button>
            )}
          </div>
          {capturedPhotos['lateral_izquierda'] && (
            <img
              src={URL.createObjectURL(capturedPhotos['lateral_izquierda'])}
              alt="Foto Lateral Izquierda"
              className="mt-2 rounded-md"
            />
          )}
        </div>

        {/* Posterior Photo */}
        <div>
          <Label htmlFor="posteriorPhoto">Foto Posterior</Label>
          <Input
            type="file"
            id="posteriorPhoto"
            accept="image/*"
            onChange={(e) => handlePhotoCapture('posterior', e)}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('posteriorPhoto')?.click()}
            >
              Tomar Foto
            </Button>
            {capturedPhotos['posterior'] && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => clearPhoto('posterior')}
              >
                Quitar
              </Button>
            )}
          </div>
          {capturedPhotos['posterior'] && (
            <img
              src={URL.createObjectURL(capturedPhotos['posterior'])}
              alt="Foto Posterior"
              className="mt-2 rounded-md"
            />
          )}
        </div>

        {/* Llanta de Repuesto Photo */}
        <div>
          <Label htmlFor="llantaRepuestoPhoto">Foto Llanta de Repuesto</Label>
          <Input
            type="file"
            id="llantaRepuestoPhoto"
            accept="image/*"
            onChange={(e) => handlePhotoCapture('llanta_repuesto', e)}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('llantaRepuestoPhoto')?.click()}
            >
              Tomar Foto
            </Button>
            {capturedPhotos['llanta_repuesto'] && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => clearPhoto('llanta_repuesto')}
              >
                Quitar
              </Button>
            )}
          </div>
          {capturedPhotos['llanta_repuesto'] && (
            <img
              src={URL.createObjectURL(capturedPhotos['llanta_repuesto'])}
              alt="Foto Llanta de Repuesto"
              className="mt-2 rounded-md"
            />
          )}
        </div>

        {/* Extintor Photo */}
        <div>
          <Label htmlFor="extintorPhoto">Foto Extintor</Label>
          <Input
            type="file"
            id="extintorPhoto"
            accept="image/*"
            onChange={(e) => handlePhotoCapture('extintor', e)}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="flex items-center space-x-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('extintorPhoto')?.click()}
            >
              Tomar Foto
            </Button>
            {capturedPhotos['extintor'] && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => clearPhoto('extintor')}
              >
                Quitar
              </Button>
            )}
          </div>
          {capturedPhotos['extintor'] && (
            <img
              src={URL.createObjectURL(capturedPhotos['extintor'])}
              alt="Foto Extintor"
              className="mt-2 rounded-md"
            />
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full localiza-gradient hover:opacity-90 transition-opacity"
        disabled={isLoading}
      >
        {isLoading ? 'Guardando...' : 'Guardar Alistamiento'}
      </Button>
    </form>
  );
};

export default VehicleInspectionForm;

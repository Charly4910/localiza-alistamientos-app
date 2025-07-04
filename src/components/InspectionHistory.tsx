
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, User, Eye, Image } from 'lucide-react';
import { VehicleInspection, PHOTO_LABELS } from '@/types/vehicle';
import { useToast } from '@/hooks/use-toast';

interface InspectionHistoryProps {
  inspections: VehicleInspection[];
}

const InspectionHistory = ({ inspections }: InspectionHistoryProps) => {
  const [searchPlaca, setSearchPlaca] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<VehicleInspection | null>(null);
  const { toast } = useToast();

  const filteredInspections = inspections.filter(inspection =>
    inspection.placa.toLowerCase().includes(searchPlaca.toLowerCase())
  );

  const handleSearch = () => {
    if (!searchPlaca.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor ingresa una placa para buscar",
        variant: "destructive",
      });
      return;
    }

    if (filteredInspections.length === 0) {
      toast({
        title: "Sin resultados",
        description: `No se encontraron alistamientos para la placa ${searchPlaca.toUpperCase()}`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-green-600" />
            <span>Buscar Historial por Placa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              type="text"
              value={searchPlaca}
              onChange={(e) => setSearchPlaca(e.target.value.toUpperCase())}
              placeholder="Ingresa la placa del vehículo..."
              className="uppercase"
              maxLength={6}
            />
            <Button
              onClick={handleSearch}
              className="localiza-gradient text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredInspections.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-800">
            Resultados de búsqueda {searchPlaca && `para "${searchPlaca.toUpperCase()}"`}
          </h2>
          
          {filteredInspections.map((inspection) => (
            <Card key={inspection.id} className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-green-800">
                        Placa: {inspection.placa}
                      </h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {inspection.photos.length} fotos
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(inspection.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{inspection.inspector.name}</span>
                      </div>
                    </div>
                    
                    {inspection.observaciones && (
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>Observaciones:</strong> {inspection.observaciones}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => setSelectedInspection(inspection)}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Fotos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para ver fotos */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-green-800">
                  Fotos - Placa {selectedInspection.placa}
                </h2>
                <Button
                  onClick={() => setSelectedInspection(null)}
                  variant="outline"
                >
                  Cerrar
                </Button>
              </div>
              
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm"><strong>Inspector:</strong> {selectedInspection.inspector.name}</p>
                <p className="text-sm"><strong>Email:</strong> {selectedInspection.inspector.email}</p>
                <p className="text-sm"><strong>Fecha:</strong> {formatDate(selectedInspection.timestamp)}</p>
                {selectedInspection.observaciones && (
                  <p className="text-sm mt-2"><strong>Observaciones:</strong> {selectedInspection.observaciones}</p>
                )}
              </div>

              <div className="photo-grid">
                {selectedInspection.photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={photo.url}
                        alt={PHOTO_LABELS[photo.type]}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-semibold text-sm text-green-800">
                          {PHOTO_LABELS[photo.type]}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(photo.timestamp)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionHistory;

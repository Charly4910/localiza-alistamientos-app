
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, User, Eye } from 'lucide-react';
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

  const formatSimpleDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <h3 className="text-lg font-semibold text-green-800">
                        Placa: {inspection.placa}
                      </h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {inspection.photos.length} fotos
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(inspection.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{inspection.inspector.name}</span>
                      </div>
                      {inspection.fechaVencimientoExtintor && (
                        <div className="flex items-center space-x-2 col-span-1 sm:col-span-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-700 font-medium">
                            Extintor vence: {formatSimpleDate(inspection.fechaVencimientoExtintor)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {inspection.observaciones && (
                      <div className="bg-gray-50 p-3 rounded-lg mt-2">
                        <p className="text-sm text-gray-700">
                          <strong>Observaciones:</strong> {inspection.observaciones}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => setSelectedInspection(inspection)}
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50 w-full lg:w-auto"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Fotos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para ver fotos */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto w-full">
            <div className="sticky top-0 bg-white p-6 border-b z-10">
              <div className="flex items-center justify-between">
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
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  <p><strong>Inspector:</strong> {selectedInspection.inspector.name}</p>
                  <p><strong>Email:</strong> {selectedInspection.inspector.email}</p>
                  <p><strong>Fecha:</strong> {formatDate(selectedInspection.timestamp)}</p>
                  {selectedInspection.fechaVencimientoExtintor && (
                    <p className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <strong className="text-orange-700">Extintor vence:</strong>{' '}
                      <span className="text-orange-700 font-medium">
                        {formatSimpleDate(selectedInspection.fechaVencimientoExtintor)}
                      </span>
                    </p>
                  )}
                  {selectedInspection.observaciones && (
                    <p className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <strong>Observaciones:</strong> {selectedInspection.observaciones}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedInspection.photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={photo.url}
                          alt={PHOTO_LABELS[photo.type]}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(photo.url, '_blank')}
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm text-green-800 mb-1">
                          {PHOTO_LABELS[photo.type]}
                        </h4>
                        <p className="text-xs text-gray-500">
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

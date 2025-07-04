
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import VehicleInspectionForm from '@/components/VehicleInspectionForm';
import InspectionHistory from '@/components/InspectionHistory';
import { VehicleInspection } from '@/types/vehicle';

const Index = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('localiza_user');
    const savedInspections = localStorage.getItem('localiza_inspections');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedInspections) {
      const parsedInspections = JSON.parse(savedInspections);
      // Convertir strings de fecha a objetos Date
      const inspectionsWithDates = parsedInspections.map((inspection: any) => ({
        ...inspection,
        timestamp: new Date(inspection.timestamp),
        photos: inspection.photos.map((photo: any) => ({
          ...photo,
          timestamp: new Date(photo.timestamp)
        }))
      }));
      setInspections(inspectionsWithDates);
    }
  }, []);

  const handleLogin = (email: string, name: string) => {
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('localiza_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('localiza_user');
  };

  const handleInspectionSave = (inspectionData: Omit<VehicleInspection, 'id' | 'timestamp'>) => {
    const newInspection: VehicleInspection = {
      ...inspectionData,
      id: `inspection_${Date.now()}`,
      timestamp: new Date()
    };
    
    const updatedInspections = [...inspections, newInspection];
    setInspections(updatedInspections);
    localStorage.setItem('localiza_inspections', JSON.stringify(updatedInspections));
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="nuevo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="nuevo" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Nuevo Alistamiento
            </TabsTrigger>
            <TabsTrigger value="historial" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nuevo" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-green-800 mb-2">
                Nuevo Alistamiento de Vehículo
              </h2>
              <p className="text-gray-600">
                Documenta el estado del vehículo con fotos detalladas
              </p>
            </div>
            <VehicleInspectionForm onInspectionSave={handleInspectionSave} user={user} />
          </TabsContent>

          <TabsContent value="historial" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-green-800 mb-2">
                Historial de Alistamientos
              </h2>
              <p className="text-gray-600">
                Busca y revisa alistamientos anteriores por placa
              </p>
            </div>
            <InspectionHistory inspections={inspections} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

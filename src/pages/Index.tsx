
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import UserRegistration from '@/components/UserRegistration';
import PinLogin from '@/components/PinLogin';
import VehicleInspectionForm from '@/components/VehicleInspectionForm';
import InspectionHistory from '@/components/InspectionHistory';
import AdminPanel from '@/components/AdminPanel';
import { VehicleInspection, User } from '@/types/vehicle';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);
  const [loginStep, setLoginStep] = useState<'email' | 'register' | 'pin'>('email');
  const [tempLoginData, setTempLoginData] = useState<{ email: string; name: string } | null>(null);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('localiza_current_user');
    const savedUsers = localStorage.getItem('localiza_users');
    const savedInspections = localStorage.getItem('localiza_inspections');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      const usersWithDates = parsedUsers.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt)
      }));
      setUsers(usersWithDates);
    }
    
    if (savedInspections) {
      const parsedInspections = JSON.parse(savedInspections);
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

  const handleEmailLogin = (email: string, name: string) => {
    setTempLoginData({ email, name });
    
    // Usuario administrador va directo al PIN
    if (email === 'admin@rentingcolombia.com') {
      setLoginStep('pin');
      return;
    }
    
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      setLoginStep('pin');
    } else {
      setLoginStep('register');
    }
  };

  const handleUserRegistered = (user: User) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    setCurrentUser(user);
    localStorage.setItem('localiza_users', JSON.stringify(updatedUsers));
    localStorage.setItem('localiza_current_user', JSON.stringify(user));
    setLoginStep('email');
    setTempLoginData(null);
  };

  const handlePinLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('localiza_current_user', JSON.stringify(user));
    setLoginStep('email');
    setTempLoginData(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginStep('email');
    setTempLoginData(null);
    localStorage.removeItem('localiza_current_user');
  };

  const handleBackToEmailLogin = () => {
    setLoginStep('email');
    setTempLoginData(null);
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

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('localiza_users', JSON.stringify(updatedUsers));
  };

  if (!currentUser) {
    if (loginStep === 'register' && tempLoginData) {
      return (
        <UserRegistration
          email={tempLoginData.email}
          name={tempLoginData.name}
          onUserRegistered={handleUserRegistered}
          existingUsers={users}
        />
      );
    }

    if (loginStep === 'pin' && tempLoginData) {
      return (
        <PinLogin
          email={tempLoginData.email}
          name={tempLoginData.name}
          onLogin={handlePinLogin}
          users={users}
          onBackToEmailLogin={handleBackToEmailLogin}
        />
      );
    }

    return <LoginForm onLogin={handleEmailLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header user={currentUser} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={currentUser.isAdmin ? "admin" : "nuevo"} className="space-y-6">
          <TabsList className={`grid w-full max-w-2xl mx-auto ${currentUser.isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {!currentUser.isAdmin && (
              <TabsTrigger value="nuevo" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Nuevo Alistamiento
              </TabsTrigger>
            )}
            <TabsTrigger value="historial" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Historial
            </TabsTrigger>
            {currentUser.isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Administración
              </TabsTrigger>
            )}
          </TabsList>

          {!currentUser.isAdmin && (
            <TabsContent value="nuevo" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  Nuevo Alistamiento de Vehículo
                </h2>
                <p className="text-gray-600">
                  Documenta el estado del vehículo con fotos detalladas
                </p>
              </div>
              <VehicleInspectionForm onInspectionSave={handleInspectionSave} user={currentUser} />
            </TabsContent>
          )}

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

          {currentUser.isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  Panel de Administración
                </h2>
                <p className="text-gray-600">
                  Gestiona usuarios y sus claves de acceso
                </p>
              </div>
              <AdminPanel users={users} onUpdateUsers={handleUpdateUsers} />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <footer className="bg-white border-t border-green-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Aplicación desarrollada por{' '}
              <span className="font-semibold text-green-700">Charly Hernando Avendaño</span>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Ingeniero de Sistemas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

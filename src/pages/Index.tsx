import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import UserRegistration from '@/components/UserRegistration';
import PinLogin from '@/components/PinLogin';
import VehicleInspectionForm from '@/components/VehicleInspectionForm';
import InspectionHistory from '@/components/InspectionHistory';
import AdminPanel from '@/components/AdminPanel';
import LoadingOverlay from '@/components/LoadingOverlay';
import { VehicleInspection, User, DEFAULT_DEPARTMENTS } from '@/types/vehicle';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [inspections, setInspections] = useState<VehicleInspection[]>([]);
  const [loginStep, setLoginStep] = useState<'email' | 'register' | 'pin'>('email');
  const [tempLoginData, setTempLoginData] = useState<{ email: string; name: string } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [consecutiveCounter, setConsecutiveCounter] = useState(1);

  // Tema oscuro
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('localiza_dark_mode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('localiza_dark_mode', JSON.stringify(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('localiza_current_user');
    const savedUsers = localStorage.getItem('localiza_users');
    const savedInspections = localStorage.getItem('localiza_inspections');
    const savedCounter = localStorage.getItem('localiza_consecutive_counter');
    
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

    if (savedCounter) {
      setConsecutiveCounter(parseInt(savedCounter));
    }
  }, []);

  const showLoading = (message: string, duration: number = 2000) => {
    setLoadingMessage(message);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, duration);
  };

  const handleEmailLogin = (email: string, name: string) => {
    setTempLoginData({ email, name });
    showLoading('Verificando usuario...', 1500);
    
    setTimeout(() => {
      if (email === 'admin@rentingcolombia.com') {
        setLoginStep('pin');
        return;
      }
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setLoginStep('pin');
      } else {
        setLoginStep('register');
      }
    }, 1500);
  };

  const handleUserRegistered = (user: User) => {
    showLoading('Creando usuario...', 1500);
    
    setTimeout(() => {
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      setCurrentUser(user);
      localStorage.setItem('localiza_users', JSON.stringify(updatedUsers));
      localStorage.setItem('localiza_current_user', JSON.stringify(user));
      setLoginStep('email');
      setTempLoginData(null);
    }, 1500);
  };

  const handlePinLogin = (user: User) => {
    showLoading('Iniciando sesión...', 1500);
    
    setTimeout(() => {
      setCurrentUser(user);
      localStorage.setItem('localiza_current_user', JSON.stringify(user));
      setLoginStep('email');
      setTempLoginData(null);
    }, 1500);
  };

  const handleLogout = () => {
    showLoading('Cerrando sesión...', 1500);
    
    setTimeout(() => {
      setCurrentUser(null);
      setLoginStep('email');
      setTempLoginData(null);
      localStorage.removeItem('localiza_current_user');
    }, 1500);
  };

  const handleBackToEmailLogin = () => {
    setLoginStep('email');
    setTempLoginData(null);
  };

  const handleInspectionSave = (inspectionData: Omit<VehicleInspection, 'id' | 'timestamp' | 'consecutiveNumber'>) => {
    showLoading('Guardando alistamiento...', 2000);
    
    setTimeout(() => {
      const newInspection: VehicleInspection = {
        ...inspectionData,
        id: `inspection_${Date.now()}`,
        consecutiveNumber: consecutiveCounter,
        timestamp: new Date()
      };
      
      const updatedInspections = [...inspections, newInspection];
      const newCounter = consecutiveCounter + 1;
      
      setInspections(updatedInspections);
      setConsecutiveCounter(newCounter);
      
      localStorage.setItem('localiza_inspections', JSON.stringify(updatedInspections));
      localStorage.setItem('localiza_consecutive_counter', newCounter.toString());
    }, 2000);
  };

  const handleUpdateUsers = (updatedUsers: User[]) => {
    showLoading('Actualizando usuarios...', 1500);
    
    setTimeout(() => {
      setUsers(updatedUsers);
      localStorage.setItem('localiza_users', JSON.stringify(updatedUsers));
    }, 1500);
  };

  if (!currentUser) {
    if (loginStep === 'register' && tempLoginData) {
      return (
        <>
          <UserRegistration
            email={tempLoginData.email}
            name={tempLoginData.name}
            onUserRegistered={handleUserRegistered}
            existingUsers={users}
            departments={DEFAULT_DEPARTMENTS}
          />
          <LoadingOverlay isVisible={loading} message={loadingMessage} />
        </>
      );
    }

    if (loginStep === 'pin' && tempLoginData) {
      return (
        <>
          <PinLogin
            email={tempLoginData.email}
            name={tempLoginData.name}
            onLogin={handlePinLogin}
            users={users}
            onBackToEmailLogin={handleBackToEmailLogin}
          />
          <LoadingOverlay isVisible={loading} message={loadingMessage} />
        </>
      );
    }

    return (
      <>
        <LoginForm onLogin={handleEmailLogin} />
        <LoadingOverlay isVisible={loading} message={loadingMessage} />
      </>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
      <Header 
        user={currentUser} 
        onLogout={handleLogout} 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue={currentUser.isAdmin ? "admin" : "nuevo"} className="space-y-4 sm:space-y-6">
          <TabsList className={`grid w-full max-w-2xl mx-auto h-10 ${currentUser.isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {!currentUser.isAdmin && (
              <TabsTrigger value="nuevo" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
                Nuevo Alistamiento
              </TabsTrigger>
            )}
            <TabsTrigger value="historial" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
              Historial
            </TabsTrigger>
            {currentUser.isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs sm:text-sm">
                Administración
              </TabsTrigger>
            )}
          </TabsList>

          {!currentUser.isAdmin && (
            <TabsContent value="nuevo" className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
                  Nuevo Alistamiento de Vehículo
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Documenta el estado del vehículo con fotos detalladas
                </p>
              </div>
              <VehicleInspectionForm onInspectionSave={handleInspectionSave} user={currentUser} />
            </TabsContent>
          )}

          <TabsContent value="historial" className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
                Historial de Alistamientos
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Busca y revisa alistamientos anteriores por placa
              </p>
            </div>
            <InspectionHistory inspections={inspections} />
          </TabsContent>

          {currentUser.isAdmin && (
            <TabsContent value="admin" className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-3xl font-bold text-green-800 dark:text-green-400 mb-2">
                  Panel de Administración
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Gestiona usuarios, claves de acceso y alistamientos
                </p>
              </div>
              <AdminPanel 
                users={users} 
                inspections={inspections}
                onUpdateUsers={handleUpdateUsers} 
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-green-200 dark:border-green-800 mt-8 sm:mt-12 transition-colors duration-300">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Aplicación desarrollada por{' '}
              <span className="font-semibold text-green-700 dark:text-green-400">Charly Hernando Avendaño</span>
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Ingeniero de Sistemas - Versión 1.0
            </p>
          </div>
        </div>
      </footer>

      <LoadingOverlay isVisible={loading} message={loadingMessage} />
    </div>
  );
};

export default Index;

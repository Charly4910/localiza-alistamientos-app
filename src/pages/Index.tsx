
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import VehicleInspectionForm from '@/components/VehicleInspectionForm';
import InspectionHistory from '@/components/InspectionHistory';
import AdminPanel from '@/components/AdminPanel';
import LoadingOverlay from '@/components/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const Index = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { inspections, loading: dataLoading } = useSupabaseData();
  const [darkMode, setDarkMode] = useState(false);

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

  React.useEffect(() => {
    const savedDarkMode = localStorage.getItem('localiza_dark_mode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  if (authLoading) {
    return <LoadingOverlay isVisible={true} message="Cargando aplicación..." />;
  }

  if (!user || !profile) {
    return <AuthForm />;
  }

  const currentUser = {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    pin: profile.pin,
    isAdmin: profile.is_admin,
    department: profile.agency_id || 'Sin asignar',
    createdAt: new Date(profile.created_at)
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
      <Header 
        user={currentUser} 
        onLogout={signOut} 
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
              <VehicleInspectionForm user={currentUser} />
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
              <AdminPanel />
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
              Ingeniero de Sistemas - Versión 2.0
            </p>
          </div>
        </div>
      </footer>

      <LoadingOverlay isVisible={dataLoading} message="Cargando datos..." />
    </div>
  );
};

export default Index;

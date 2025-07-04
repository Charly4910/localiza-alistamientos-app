
import React from 'react';
import { User, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: {
    email: string;
    name: string;
    isAdmin?: boolean;
  } | null;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ user, onLogout, darkMode, toggleDarkMode }: HeaderProps) => {
  return (
    <header className="localiza-gradient text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/8a6198c5-9438-452d-9133-4cb2bd965c0d.png" 
                alt="Localiza Logo" 
                className="h-12 w-auto"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Alistamientos</h1>
              <p className="text-green-100 text-sm">Sistema Profesional de Inspección Vehicular v1.0</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user && (
              <>
                <div className="flex items-center space-x-3 bg-white/10 rounded-xl px-4 py-2">
                  <User className="w-5 h-5" />
                  <div className="text-right">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-green-100 text-xs">{user.email}</p>
                    {user.isAdmin && (
                      <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

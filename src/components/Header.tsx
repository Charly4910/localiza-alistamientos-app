
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: {
    email: string;
    name: string;
  } | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="localiza-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">L</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Alistamientos Localiza</h1>
              <p className="text-green-100 text-sm">Sistema de Inspección de Vehículos</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <div className="text-right">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-green-100 text-sm">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

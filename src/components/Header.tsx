
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
    <header className="localiza-gradient text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="localiza-logo">
              LOCALIZA
            </div>
            <div>
              <h1 className="text-3xl font-bold">Alistamientos</h1>
              <p className="text-green-100 text-sm">Sistema Profesional de Inspección Vehicular</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/10 rounded-xl px-4 py-2">
                <User className="w-5 h-5" />
                <div className="text-right">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-green-100 text-xs">{user.email}</p>
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

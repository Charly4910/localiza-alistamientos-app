
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/vehicle';

interface PinLoginProps {
  email: string;
  name: string;
  onLogin: (user: User) => void;
  users: User[];
  onBackToEmailLogin: () => void;
}

const PinLogin = ({ email, name, onLogin, users, onBackToEmailLogin }: PinLoginProps) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      toast({
        title: "PIN incompleto",
        description: "Ingresa tu PIN de 4 dígitos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Verificar PIN de administrador
    if (email === 'admin@rentingcolombia.com' && pin === '2026') {
      const adminUser: User = {
        id: 'admin',
        email: 'admin@rentingcolombia.com',
        name: 'Administrador',
        pin: '2026',
        isAdmin: true,
        createdAt: new Date()
      };
      
      setTimeout(() => {
        onLogin(adminUser);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Verificar PIN de usuario normal
    const user = users.find(u => u.email === email && u.pin === pin);
    
    setTimeout(() => {
      if (user) {
        onLogin(user);
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido/a ${user.name}`,
        });
      } else {
        toast({
          title: "PIN incorrecto",
          description: "El PIN ingresado no es válido",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="localiza-gradient text-white p-4 rounded-lg mb-4 mx-auto w-16 h-16 flex items-center justify-center">
            <span className="text-2xl font-bold">L</span>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Ingresa tu PIN
          </CardTitle>
          <p className="text-sm text-gray-600">
            {name} ({email})
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                PIN de 4 dígitos
              </label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                maxLength={4}
                className="text-center text-3xl tracking-widest h-16"
                autoFocus
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full localiza-gradient hover:opacity-90 transition-opacity h-12"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onBackToEmailLogin}
              className="w-full"
            >
              Cambiar Usuario
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PinLogin;

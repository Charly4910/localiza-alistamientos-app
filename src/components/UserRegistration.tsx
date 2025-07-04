
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/vehicle';

interface UserRegistrationProps {
  email: string;
  name: string;
  onUserRegistered: (user: User) => void;
  existingUsers: User[];
}

const UserRegistration = ({ email, name, onUserRegistered, existingUsers }: UserRegistrationProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast({
        title: "PIN inválido",
        description: "El PIN debe tener exactamente 4 dígitos",
        variant: "destructive",
      });
      return;
    }

    if (pin !== confirmPin) {
      toast({
        title: "PINs no coinciden",
        description: "Los PINs ingresados no son iguales",
        variant: "destructive",
      });
      return;
    }

    // Verificar si el PIN ya existe
    if (existingUsers.some(user => user.pin === pin)) {
      toast({
        title: "PIN ya existe",
        description: "Este PIN ya está en uso, elige otro",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      pin,
      isAdmin: false,
      createdAt: new Date()
    };

    setTimeout(() => {
      onUserRegistered(newUser);
      toast({
        title: "Usuario registrado",
        description: "Tu PIN ha sido creado exitosamente",
      });
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
            Crear PIN Personal
          </CardTitle>
          <p className="text-sm text-gray-600">
            Bienvenido/a {name}
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
                placeholder="0000"
                maxLength={4}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar PIN
              </label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                maxLength={4}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full localiza-gradient hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? 'Creando PIN...' : 'Crear PIN Personal'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegistration;

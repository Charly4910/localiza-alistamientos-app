
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Agency, DEFAULT_AGENCIES } from '@/types/vehicle';

interface UserRegistrationProps {
  email: string;
  name: string;
  onUserRegistered: (user: User) => void;
  existingUsers: User[];
  agencies?: Agency[];
}

const UserRegistration = ({ email, name, onUserRegistered, existingUsers, agencies = DEFAULT_AGENCIES }: UserRegistrationProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
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

    if (!selectedAgency) {
      toast({
        title: "Agencia requerida",
        description: "Por favor selecciona tu agencia",
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
      department: selectedAgency,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-3">
      <Card className="w-full max-w-sm border-green-200/50 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mb-3 mx-auto">
            <img 
              src="/lovable-uploads/8a6198c5-9438-452d-9133-4cb2bd965c0d.png" 
              alt="Localiza Logo" 
              className="h-12 w-auto mx-auto"
            />
          </div>
          <CardTitle className="text-lg font-bold text-green-800">
            Crear PIN Personal
          </CardTitle>
          <p className="text-xs text-gray-600">
            Bienvenido/a {name}
          </p>
        </CardHeader>
        <CardContent className="px-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="agency" className="block text-xs font-medium text-gray-700 mb-1">
                Agencia
              </label>
              <Select value={selectedAgency} onValueChange={setSelectedAgency} required>
                <SelectTrigger className="text-sm h-10">
                  <SelectValue placeholder="Selecciona tu agencia" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {agencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.name} className="text-sm">
                      {agency.name} ({agency.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="pin" className="block text-xs font-medium text-gray-700 mb-1">
                PIN de 4 dígitos
              </label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                maxLength={4}
                className="text-center text-lg tracking-widest h-10"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPin" className="block text-xs font-medium text-gray-700 mb-1">
                Confirmar PIN
              </label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                maxLength={4}
                className="text-center text-lg tracking-widest h-10"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full localiza-gradient hover:opacity-90 transition-opacity h-10 text-sm"
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

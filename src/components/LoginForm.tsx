
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (email: string, name: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Permitir usuario administrador
    if (email === 'admin@rentingcolombia.com') {
      setIsLoading(true);
      setTimeout(() => {
        onLogin(email, 'Administrador');
        setIsLoading(false);
      }, 1000);
      return;
    }

    if (!email.endsWith('@rentingcolombia.com')) {
      toast({
        title: "Error de autenticación",
        description: "Solo se permiten correos corporativos @rentingcolombia.com",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor ingresa tu nombre completo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido/a ${name}`,
      });
      onLogin(email, name);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="localiza-gradient text-white p-4 rounded-lg mb-4 mx-auto w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold">L</span>
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Alistamientos Localiza
            </CardTitle>
            <CardDescription>
              Inicia sesión con tu correo corporativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico Corporativo
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.nombre@rentingcolombia.com"
                  required
                  className="w-full"
                />
              </div>
              
              {email !== 'admin@rentingcolombia.com' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    required
                    className="w-full"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full localiza-gradient hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Continuar'}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Solo se permiten correos @rentingcolombia.com</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Aplicación creada por<br />
            <span className="font-semibold text-green-700">Charly Hernando Avendaño</span><br />
            <span className="text-green-600">Ingeniero de Sistemas</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

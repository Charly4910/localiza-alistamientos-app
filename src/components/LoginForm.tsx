
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-3">
      <div className="w-full max-w-sm">
        <Card className="border-green-200/50 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 mx-auto">
              <img 
                src="/lovable-uploads/8a6198c5-9438-452d-9133-4cb2bd965c0d.png" 
                alt="Localiza Logo" 
                className="h-16 w-auto mx-auto mb-2"
              />
            </div>
            <CardTitle className="text-xl font-bold text-green-800">
              Alistamientos Localiza
            </CardTitle>
            <CardDescription className="text-sm">
              Inicia sesión con tu correo corporativo
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Correo Electrónico Corporativo
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@rentingcolombia.com"
                  required
                  className="w-full text-sm h-10"
                />
              </div>
              
              {email !== 'admin@rentingcolombia.com' && (
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    required
                    className="w-full text-sm h-10"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full localiza-gradient hover:opacity-90 transition-opacity h-10 text-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Continuar'}
              </Button>
            </form>
            
            <div className="mt-3 text-center text-xs text-gray-600">
              <p>Solo se permiten correos @rentingcolombia.com</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center">
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

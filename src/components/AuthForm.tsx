
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Agency } from '@/types/vehicle';

interface AuthFormProps {
  agencies: Agency[];
  onAuthSuccess: () => void;
}

const AuthForm = ({ agencies, onAuthSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'admin@rentingcolombia.com' && password === 'admin2026') {
      // Admin login
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@rentingcolombia.com',
        password: 'admin2026'
      });

      if (error) {
        // If admin doesn't exist, create it
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'admin@rentingcolombia.com',
          password: 'admin2026',
          options: {
            data: {
              name: 'Administrador',
              pin: '2026',
              is_admin: true,
              department: 'Administración'
            }
          }
        });

        if (signUpError) {
          toast({
            title: "Error de autenticación",
            description: signUpError.message,
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Bienvenido Administrador",
        description: "Has iniciado sesión exitosamente",
      });
      onAuthSuccess();
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

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "Email o contraseña incorrectos",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta",
      });
      onAuthSuccess();
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith('@rentingcolombia.com')) {
      toast({
        title: "Error de registro",
        description: "Solo se permiten correos corporativos @rentingcolombia.com",
        variant: "destructive",
      });
      return;
    }

    if (pin.length !== 4) {
      toast({
        title: "PIN inválido",
        description: "El PIN debe tener exactamente 4 dígitos",
        variant: "destructive",
      });
      return;
    }

    if (!department) {
      toast({
        title: "Departamento requerido",
        description: "Por favor selecciona tu departamento",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          pin,
          is_admin: false,
          department
        }
      }
    });

    if (error) {
      toast({
        title: "Error de registro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. Puedes iniciar sesión ahora.",
      });
      setActiveTab('login');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 mx-auto">
            <img 
              src="/lovable-uploads/8a6198c5-9438-452d-9133-4cb2bd965c0d.png" 
              alt="Localiza Logo" 
              className="h-16 w-auto mx-auto mb-2"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Alistamientos Localiza
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@rentingcolombia.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña (PIN de 4 dígitos)
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full localiza-gradient"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@rentingcolombia.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-department" className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <Select value={department} onValueChange={setDepartment} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu departamento" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.name}>
                          {agency.name} ({agency.abbreviation})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="signup-pin" className="block text-sm font-medium text-gray-700 mb-1">
                    PIN de 4 dígitos
                  </label>
                  <Input
                    id="signup-pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="0000"
                    maxLength={4}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar PIN (Contraseña)
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full localiza-gradient"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;

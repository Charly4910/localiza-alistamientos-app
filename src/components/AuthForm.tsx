
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyId, setAgencyId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { agencies } = useSupabaseData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, agencyId || undefined);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md border-green-200/50 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mb-4 mx-auto">
            <img 
              src="/lovable-uploads/8a6198c5-9438-452d-9133-4cb2bd965c0d.png" 
              alt="Localiza Logo" 
              className="h-16 w-auto mx-auto mb-2"
            />
          </div>
          <CardTitle className="text-xl font-bold text-green-800">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@rentingcolombia.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                className="w-full"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">
                    Agencia (Opcional)
                  </label>
                  <Select value={agencyId} onValueChange={setAgencyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una agencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {agencies.map((agency) => (
                        <SelectItem key={agency.id} value={agency.id}>
                          {agency.name} ({agency.abbreviation})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full localiza-gradient hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          <div className="text-center text-xs text-gray-600">
            <p>Usuario admin: admin@rentingcolombia.com / admin2026</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;

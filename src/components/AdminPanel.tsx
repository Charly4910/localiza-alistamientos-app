
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, User, Key } from 'lucide-react';
import { User as UserType } from '@/types/vehicle';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  users: UserType[];
  onUpdateUsers: (users: UserType[]) => void;
}

const AdminPanel = ({ users, onUpdateUsers }: AdminPanelProps) => {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    onUpdateUsers(updatedUsers);
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
  };

  const handleUpdatePin = (userId: string) => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      toast({
        title: "PIN inválido",
        description: "El PIN debe tener exactamente 4 dígitos",
        variant: "destructive",
      });
      return;
    }

    if (users.some(user => user.id !== userId && user.pin === newPin)) {
      toast({
        title: "PIN ya existe",
        description: "Este PIN ya está en uso por otro usuario",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, pin: newPin } : user
    );
    
    onUpdateUsers(updatedUsers);
    setEditingUser(null);
    setNewPin('');
    
    toast({
      title: "PIN actualizado",
      description: "El PIN del usuario ha sido cambiado exitosamente",
    });
  };

  const regularUsers = users.filter(user => !user.isAdmin);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-green-600" />
            <span>Panel de Administración - Gestión de Usuarios</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {regularUsers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No hay usuarios registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {regularUsers.map((user) => (
            <Card key={user.id} className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-green-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Registrado: {formatDate(user.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-sm font-mono">PIN: ••••</span>
                    </div>
                    
                    <Button
                      onClick={() => {
                        setEditingUser(user.id);
                        setNewPin('');
                      }}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Cambiar PIN
                    </Button>
                    
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>

                {editingUser === user.id && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Cambiar PIN para {user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="Nuevo PIN"
                        maxLength={4}
                        className="w-32 text-center text-lg tracking-widest"
                      />
                      <Button
                        onClick={() => handleUpdatePin(user.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Guardar
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingUser(null);
                          setNewPin('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

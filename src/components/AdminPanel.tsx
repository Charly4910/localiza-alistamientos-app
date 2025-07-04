
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, User, Key, FileText, Calendar } from 'lucide-react';
import { User as UserType, VehicleInspection } from '@/types/vehicle';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  users: UserType[];
  inspections: VehicleInspection[];
  onUpdateUsers: (users: UserType[]) => void;
}

const AdminPanel = ({ users, inspections, onUpdateUsers }: AdminPanelProps) => {
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
            <span>Panel de Administración - Gestión del Sistema</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Usuarios ({regularUsers.length})</TabsTrigger>
          <TabsTrigger value="inspections">Alistamientos ({inspections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {regularUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No hay usuarios registrados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {regularUsers.map((user) => (
                <Card key={user.id} className="border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-green-800 dark:text-green-400">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Registrado: {formatDate(user.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                          <span className="text-sm font-mono">PIN: ••••</span>
                        </div>
                        
                        <Button
                          onClick={() => {
                            setEditingUser(user.id);
                            setNewPin('');
                          }}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Cambiar PIN
                        </Button>
                        
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>

                    {editingUser === user.id && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-400">Cambiar PIN para {user.name}</span>
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
        </TabsContent>

        <TabsContent value="inspections">
          {inspections.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No hay alistamientos registrados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inspections.map((inspection) => (
                <Card key={inspection.id} className="border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-800 dark:text-green-400">
                            Placa: {inspection.placa}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Inspector: {inspection.inspector.name} ({inspection.inspector.email})
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(inspection.timestamp)}</span>
                        </div>
                        {inspection.fechaVencimientoExtintor && (
                          <p className="text-sm text-orange-600 dark:text-orange-400">
                            Extintor vence: {inspection.fechaVencimientoExtintor}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium">{inspection.photos.length} fotos</span>
                        </div>
                      </div>
                    </div>
                    {inspection.observaciones && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Observaciones:</strong> {inspection.observaciones}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, User, Key, FileText, Calendar } from 'lucide-react';
import { User as UserType, VehicleInspection, Department, DEFAULT_DEPARTMENTS } from '@/types/vehicle';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  users: UserType[];
  inspections: VehicleInspection[];
  onUpdateUsers: (users: UserType[]) => void;
}

const AdminPanel = ({ users, inspections, onUpdateUsers }: AdminPanelProps) => {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
  const [newDepartment, setNewDepartment] = useState({ name: '', abbreviation: '' });
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
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
    // No permitir eliminar al administrador original
    const user = users.find(u => u.id === userId);
    if (user?.email === 'admin@rentingcolombia.com') {
      toast({
        title: "No se puede eliminar",
        description: "El administrador original no se puede eliminar",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    onUpdateUsers(updatedUsers);
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
  };

  const handleToggleAdmin = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.email === 'admin@rentingcolombia.com') {
      toast({
        title: "No se puede modificar",
        description: "El administrador original no se puede modificar",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
    );
    
    onUpdateUsers(updatedUsers);
    toast({
      title: "Usuario actualizado",
      description: "Los permisos del usuario han sido actualizados",
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

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim() || !newDepartment.abbreviation.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Complete el nombre y la abreviatura",
        variant: "destructive",
      });
      return;
    }

    if (departments.some(d => d.abbreviation === newDepartment.abbreviation.toUpperCase())) {
      toast({
        title: "Abreviatura existe",
        description: "Ya existe un departamento con esa abreviatura",
        variant: "destructive",
      });
      return;
    }

    const newDept: Department = {
      id: `dept_${Date.now()}`,
      name: newDepartment.name.trim(),
      abbreviation: newDepartment.abbreviation.toUpperCase().trim()
    };

    setDepartments([...departments, newDept]);
    setNewDepartment({ name: '', abbreviation: '' });
    
    toast({
      title: "Departamento agregado",
      description: "El departamento ha sido creado exitosamente",
    });
  };

  const regularUsers = users.filter(user => user.email !== 'admin@rentingcolombia.com');

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <User className="w-5 h-5 text-green-600" />
            <span>Panel de Administración</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="users" className="space-y-3">
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="users" className="text-xs">Usuarios ({regularUsers.length})</TabsTrigger>
          <TabsTrigger value="inspections" className="text-xs">Alistamientos ({inspections.length})</TabsTrigger>
          <TabsTrigger value="departments" className="text-xs">Departamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-3">
          {regularUsers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No hay usuarios registrados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {regularUsers.map((user) => (
                <Card key={user.id} className="border-green-200 dark:border-green-800">
                  <CardContent className="p-3">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-green-800 dark:text-green-400 text-sm">{user.name}</h3>
                            {user.isAdmin && (
                              <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{user.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Departamento: {user.department || 'No asignado'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Registrado: {formatDate(user.createdAt)}
                          </p>
                        </div>
                        
                        <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full text-center">
                          <span className="text-xs font-mono">PIN: ••••</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleToggleAdmin(user.id)}
                          variant="outline"
                          size="sm"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 text-xs h-8"
                        >
                          {user.isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
                        </Button>
                        
                        <Button
                          onClick={() => {
                            setEditingUser(user.id);
                            setNewPin('');
                          }}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 text-xs h-8"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Cambiar PIN
                        </Button>
                        
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 text-xs h-8"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Eliminar
                        </Button>
                      </div>

                      {editingUser === user.id && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-medium text-blue-800 dark:text-blue-400">Cambiar PIN</span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              type="password"
                              value={newPin}
                              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="Nuevo PIN"
                              maxLength={4}
                              className="text-center text-lg tracking-widest h-8 flex-1"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleUpdatePin(user.id)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
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
                                className="text-xs h-8"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inspections" className="space-y-3">
          {inspections.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No hay alistamientos registrados</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {inspections.map((inspection) => (
                <Card key={inspection.id} className="border-green-200 dark:border-green-800">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <h3 className="font-semibold text-green-800 dark:text-green-400 text-sm truncate">
                              #{inspection.consecutiveNumber?.toString().padStart(4, '0')} - {inspection.placa}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                            Inspector: {inspection.inspector.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Departamento: {inspection.department}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{formatDate(inspection.timestamp)}</span>
                          </div>
                          {inspection.fechaVencimientoExtintor && (
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                              Extintor vence: {inspection.fechaVencimientoExtintor}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium">{inspection.photos.length} fotos</span>
                          </div>
                        </div>
                      </div>
                      {inspection.observaciones && (
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            <strong>Observaciones:</strong> {inspection.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="departments" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Agregar Departamento</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="space-y-2">
                <Input
                  placeholder="Nombre del departamento"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  className="text-sm h-8"
                />
                <Input
                  placeholder="Abreviatura (ej: BOG)"
                  value={newDepartment.abbreviation}
                  onChange={(e) => setNewDepartment({ ...newDepartment, abbreviation: e.target.value.toUpperCase() })}
                  maxLength={5}
                  className="text-sm h-8"
                />
                <Button onClick={handleAddDepartment} className="w-full text-xs h-8">
                  Agregar Departamento
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {departments.map((dept) => (
              <Card key={dept.id} className="border-green-200 dark:border-green-800">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{dept.name}</h3>
                      <p className="text-xs text-gray-500">Abreviatura: {dept.abbreviation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;

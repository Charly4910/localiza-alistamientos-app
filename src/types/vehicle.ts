
export interface VehiclePhoto {
  id: string;
  type: PhotoType;
  url: string;
  timestamp: Date;
}

export type PhotoType = 
  | 'frontal'
  | 'panoramico'
  | 'izquierda'
  | 'llanta_p1'
  | 'llanta_p3'
  | 'panoramico_interno'
  | 'interior_delantera'
  | 'interior_trasera'
  | 'interior_techo'
  | 'kit_carretera'
  | 'repuesto_gata'
  | 'trasera'
  | 'llanta_p4'
  | 'llanta_p2'
  | 'derecha';

export interface Agency {
  id: string;
  name: string;
  abbreviation: string;
}

export interface VehicleInspection {
  id: string;
  consecutiveNumber: number;
  placa: string;
  photos: VehiclePhoto[];
  observaciones: string;
  fechaVencimientoExtintor?: string;
  inspector: {
    email: string;
    name: string;
    userId: string;
  };
  department: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  pin: string;
  isAdmin: boolean;
  department?: string;
  createdAt: Date;
}

export const PHOTO_LABELS: Record<PhotoType, string> = {
  frontal: 'Foto Frontal',
  panoramico: 'Foto Panorámica',
  izquierda: 'Foto Parte Izquierda',
  llanta_p1: 'Foto Llanta P1',
  llanta_p3: 'Foto Llanta P3',
  panoramico_interno: 'Foto Panorámica Interna',
  interior_delantera: 'Foto Interior Delantera',
  interior_trasera: 'Foto Interior Trasera',
  interior_techo: 'Foto Techo Interior',
  kit_carretera: 'Foto Kit Carretera',
  repuesto_gata: 'Foto Repuesto y Llave Pernos',
  trasera: 'Foto Trasera',
  llanta_p4: 'Foto Llanta P4',
  llanta_p2: 'Foto Llanta P2',
  derecha: 'Foto Parte Derecha'
};

export const DEFAULT_AGENCIES: Agency[] = [
  { id: '1', name: 'Amazonas', abbreviation: 'AMA' },
  { id: '2', name: 'Antioquia', abbreviation: 'ANT' },
  { id: '3', name: 'Arauca', abbreviation: 'ARA' },
  { id: '4', name: 'Atlántico', abbreviation: 'ATL' },
  { id: '5', name: 'Bolívar', abbreviation: 'BOL' },
  { id: '6', name: 'Boyacá', abbreviation: 'BOY' },
  { id: '7', name: 'Caldas', abbreviation: 'CAL' },
  { id: '8', name: 'Caquetá', abbreviation: 'CAQ' },
  { id: '9', name: 'Casanare', abbreviation: 'CAS' },
  { id: '10', name: 'Cauca', abbreviation: 'CAU' },
  { id: '11', name: 'Cesar', abbreviation: 'CES' },
  { id: '12', name: 'Chocó', abbreviation: 'CHO' },
  { id: '13', name: 'Córdoba', abbreviation: 'COR' },
  { id: '14', name: 'Cundinamarca', abbreviation: 'CUN' },
  { id: '15', name: 'Guainía', abbreviation: 'GUA' },
  { id: '16', name: 'Guaviare', abbreviation: 'GUV' },
  { id: '17', name: 'Huila', abbreviation: 'HUI' },
  { id: '18', name: 'La Guajira', abbreviation: 'LAG' },
  { id: '19', name: 'Magdalena', abbreviation: 'MAG' },
  { id: '20', name: 'Meta', abbreviation: 'MET' },
  { id: '21', name: 'Nariño', abbreviation: 'NAR' },
  { id: '22', name: 'Norte de Santander', abbreviation: 'NSA' },
  { id: '23', name: 'Putumayo', abbreviation: 'PUT' },
  { id: '24', name: 'Quindío', abbreviation: 'QUI' },
  { id: '25', name: 'Risaralda', abbreviation: 'RIS' },
  { id: '26', name: 'San Andrés y Providencia', abbreviation: 'SAP' },
  { id: '27', name: 'Santander', abbreviation: 'SAN' },
  { id: '28', name: 'Sucre', abbreviation: 'SUC' },
  { id: '29', name: 'Tolima', abbreviation: 'TOL' },
  { id: '30', name: 'Valle del Cauca', abbreviation: 'VAL' },
  { id: '31', name: 'Vaupés', abbreviation: 'VAU' },
  { id: '32', name: 'Vichada', abbreviation: 'VIC' }
];

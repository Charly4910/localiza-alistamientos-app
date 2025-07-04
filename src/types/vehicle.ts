
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

export interface VehicleInspection {
  id: string;
  placa: string;
  photos: VehiclePhoto[];
  observaciones: string;
  fechaVencimientoExtintor?: string;
  inspector: {
    email: string;
    name: string;
    userId: string;
  };
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  pin: string;
  isAdmin: boolean;
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

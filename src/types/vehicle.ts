
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
  | 'panoramico_interno'
  | 'interior_delantero'
  | 'interior_trasero'
  | 'interior_techo'
  | 'llanta_p1'
  | 'llanta_p2'
  | 'trasera'
  | 'kit_carretera'
  | 'repuesto_gata'
  | 'derecha'
  | 'llanta_p3'
  | 'llanta_p4';

export interface VehicleInspection {
  id: string;
  placa: string;
  photos: VehiclePhoto[];
  observaciones: string;
  inspector: {
    email: string;
    name: string;
  };
  timestamp: Date;
}

export const PHOTO_LABELS: Record<PhotoType, string> = {
  frontal: 'Foto Frontal del Vehículo',
  panoramico: 'Foto Panorámica',
  izquierda: 'Foto Parte Izquierda',
  panoramico_interno: 'Foto Panorámica Interna',
  interior_delantero: 'Interior Parte Delantera',
  interior_trasero: 'Interior Parte Trasera',
  interior_techo: 'Interior Techo',
  llanta_p1: 'Foto Llanta P1',
  llanta_p2: 'Foto Llanta P2',
  trasera: 'Foto Parte Trasera',
  kit_carretera: 'Foto Kit Carretera',
  repuesto_gata: 'Repuesto y Gata con Llave',
  derecha: 'Foto Parte Derecha',
  llanta_p3: 'Foto Llanta P3',
  llanta_p4: 'Foto Llanta P4'
};

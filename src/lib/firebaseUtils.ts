import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from './firebase'; // Asegúrate de tener firebase.ts bien configurado
import { PhotoType, VehicleInspection } from '@/types/vehicle'; // Ajusta si tu ruta es diferente

// Inicializa Firebase services
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

/**
 * Sube una foto a Firebase Storage y devuelve su URL de descarga.
 */
export const uploadPhotoToFirebase = async (
  file: File,
  placa: string,
  photoType: PhotoType
): Promise<string> => {
  const timestamp = Date.now();
  const path = `inspecciones/${placa}/${timestamp}-${photoType}.jpg`;
  const storageRef = ref(storage, path);

  console.log(`📤 Subiendo archivo a: ${path}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  console.log(`✅ Foto subida: ${downloadURL}`);

  return downloadURL;
};

/**
 * Guarda una inspección de vehículo en Firestore.
 */
export const saveInspectionToFirestore = async (
  inspection: VehicleInspection
): Promise<void> => {
  const inspectionsRef = collection(db, 'inspecciones');

  console.log('📝 Guardando inspección en Firestore...');
  await addDoc(inspectionsRef, {
    ...inspection,
    timestamp: inspection.timestamp.toISOString(),
    photos: inspection.photos.map((photo) => ({
      ...photo,
      timestamp: photo.timestamp.toISOString(),
    })),
  });
  console.log('✅ Inspección guardada en Firestore');
};

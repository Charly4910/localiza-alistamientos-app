// src/lib/firebaseUtils.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from './firebase'; // Asegúrate de que esta ruta sea correcta para tu archivo firebase.ts
import { PhotoType, VehicleInspection } from '@/types/vehicle'; // Asegúrate de que esta ruta y tipos sean correctos

// Inicializa los servicios de Firebase
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

/**
 * Sube una foto a Firebase Storage.
 * @param file El archivo de imagen a subir (un objeto File).
 * @param photoType El tipo de foto (por ejemplo, 'frontal', 'trasera').
 * @param placa La placa del vehículo, usada para organizar las fotos.
 * @returns Una Promise que resuelve con la URL de descarga de la foto subida.
 */
export const uploadPhotoToFirebase = async (file: File, photoType: PhotoType, placa: string): Promise<string> => {
  const timestamp = Date.now();
  // Define la ruta en Storage: inspecciones/PLACA/TIMESTAMP-TIPOFOTO.jpg
  const path = `inspecciones/${placa}/${timestamp}-${photoType}.jpg`;
  const storageRef = ref(storage, path);

  console.log(`Subiendo archivo a: ${path}`);
  await uploadBytes(storageRef, file); // Sube el archivo
  console.log('Archivo subido con éxito.');

  const downloadURL = await getDownloadURL(storageRef); // Obtiene la URL de descarga
  console.log(`URL de descarga: ${downloadURL}`);
  return downloadURL;
};

/**
 * Guarda los datos de una inspección de vehículo en Firestore.
 * @param inspection Un objeto VehicleInspection con los detalles de la inspección.
 * @returns Una Promise que resuelve cuando la inspección ha sido guardada.
 */
export const saveInspectionToFirestore = async (inspection: VehicleInspection) => {
  const inspectionsRef = collection(db, 'inspecciones'); // Referencia a la colección 'inspecciones'

  console.log('Guardando inspección en Firestore...');
  await addDoc(inspectionsRef, {
    ...inspection,
    // Convierte los objetos Date a strings ISO para guardarlos en Firestore
    timestamp: inspection.timestamp.toISOString(),
    photos: inspection.photos.map(photo => ({
      ...photo,
      timestamp: photo.timestamp.toISOString()
    }))
  });
  console.log('Inspección guardada con éxito.');
};

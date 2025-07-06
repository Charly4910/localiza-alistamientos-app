// lib/firebaseUtils.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp } from './firebase';
import { PhotoType, VehicleInspection } from '@/types/vehicle';

const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

export const uploadPhotoToFirebase = async (file: File, photoType: PhotoType, placa: string): Promise<string> => {
  const timestamp = Date.now();
  const path = `inspecciones/${placa}/${timestamp}-${photoType}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const saveInspectionToFirestore = async (inspection: VehicleInspection) => {
  const inspectionsRef = collection(db, 'inspecciones');
  await addDoc(inspectionsRef, {
    ...inspection,
    timestamp: inspection.timestamp.toISOString(),
    photos: inspection.photos.map(photo => ({
      ...photo,
      timestamp: photo.timestamp.toISOString()
    }))
  });
};

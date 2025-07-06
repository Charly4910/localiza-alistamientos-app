import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { VehicleInspection } from '@/types/vehicle';

export async function saveInspectionToFirestore(data: VehicleInspection) {
  const docRef = await addDoc(collection(db, 'inspecciones'), data);
  return docRef.id;
}

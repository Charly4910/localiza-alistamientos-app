import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadPhotoToFirebase = async (
  file: File,
  placa: string,
  type: string
): Promise<string> => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `alistamientos/${placa}/${type}-${timestamp}.jpg`);
  
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};

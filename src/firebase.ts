import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzcZgC5TpJEzz2xDpgYMJp3yCJjzRcA",
  authDomain: "localiza-alistamientos-6a6b9.firebaseapp.com",
  projectId: "localiza-alistamientos-6a6b9",
  storageBucket: "localiza-alistamientos-6a6b9.appspot.com",
  messagingSenderId: "504938867763",
  appId: "1:504938867763:web:bd4b8e2fd7f9a70ebfc746"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

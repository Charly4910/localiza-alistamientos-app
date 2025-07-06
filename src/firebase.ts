import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAzcZgC5TpJEzz2xDpgYMJp3ycJj7izRcA",
  authDomain: "localiza-alistamientos-6a6b9.firebaseapp.com",
  projectId: "localiza-alistamientos-6a6b9",
  storageBucket: "localiza-alistamientos-6a6b9.appspot.com", // 🔧 importante que diga .app**spot**.com
  messagingSenderId: "504938867763",
  appId: "1:504938867763:web:7718feb7f5964583bfc746",
  measurementId: "G-3ZNXPES7S1"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// 🔥 EXPORTA Firestore y Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

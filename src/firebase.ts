// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzcZgC5TpJEzz2xDpgYMJp3ycJj7izRcA",
  authDomain: "localiza-alistamientos-6a6b9.firebaseapp.com",
  projectId: "localiza-alistamientos-6a6b9",
  storageBucket: "localiza-alistamientos-6a6b9.firebasestorage.app",
  messagingSenderId: "504938867763",
  appId: "1:504938867763:web:7718feb7f5964583bfc746",
  measurementId: "G-3ZNXPES7S1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// src/lib/firebase.js (versión corregida)

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ✅ Configuración CORRECTA del bucket (aunque no lo usaremos)
const firebaseConfig = {
  apiKey: "AIzaSyC2-AEYxI3TI1YH4dJHnmKPUxvN-b_cXMs",
  authDomain: "sustancias-test.firebaseapp.com",
  projectId: "sustancias-test",
  storageBucket: "sustancias-test.appspot.com", // ✅ Bucket real de Firebase
  messagingSenderId: "854007119421",
  appId: "1:854007119421:web:186d761129ee3febc47454",
  measurementId: "G-F45J1ZYR72"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

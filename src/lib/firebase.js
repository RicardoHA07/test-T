// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2-AEYxI3TI1YH4dJHnmKPUxvN-b_cXMs",
  authDomain: "sustancias-test.firebaseapp.com",
  projectId: "sustancias-test",
  storageBucket: "sustancias-test.firebasestorage.app",
  messagingSenderId: "854007119421",
  appId: "1:854007119421:web:186d761129ee3febc47454",
  measurementId: "G-F45J1ZYR72"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
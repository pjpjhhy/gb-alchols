import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "alcohol-3de01.firebaseapp.com",
  projectId: "alcohol-3de01",
  storageBucket: "alcohol-3de01.appspot.com",
  messagingSenderId: "593544683759",
  appId: "1:593544683759:web:5583f902930335588dbb1a",
  measurementId: "G-KNVLB27X24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
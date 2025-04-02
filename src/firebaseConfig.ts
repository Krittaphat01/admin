import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJL5Q3g6ShJbrGT83zCQtPqjXikSbhGn8",
  authDomain: "prooo-80c69.firebaseapp.com",
  projectId: "prooo-80c69",
  storageBucket: "prooo-80c69.firebasestorage.app",
  messagingSenderId: "675136428321",
  appId: "1:675136428321:web:a4417811f6a92799d94660",
  measurementId: "G-NCD8ETNDP5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
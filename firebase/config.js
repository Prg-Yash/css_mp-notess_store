import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAWvHe5z-ttoeZu_KXVcJMU7ZB-YIiqPEI",
  authDomain: "navkar-academy.firebaseapp.com",
  databaseURL:
    "https://navkar-academy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "navkar-academy",
  storageBucket: "navkar-academy.appspot.com",
  messagingSenderId: "782515928134",
  appId: "1:782515928134:web:de951a73fc49122c211e47",
  measurementId: "G-6BW8K994T5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };

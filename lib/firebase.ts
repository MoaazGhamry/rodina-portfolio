import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "rodina-portfolio-admin-f0b1c",
  appId: "1:12852122331:web:ca2f105016fb7efa2372fe",
  storageBucket: "rodina-portfolio-admin-f0b1c.firebasestorage.app",
  apiKey: "AIzaSyB1gJWBenGiA2QjSzxYBlHyCpWB6k_nGwc",
  authDomain: "rodina-portfolio-admin-f0b1c.firebaseapp.com",
  messagingSenderId: "12852122331",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

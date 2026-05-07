import { db } from "./firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";

const heroImages = [
  "/6044320691735170420_121.jpg",
  "/6044320691735170421_121.jpg",
  "/6044320691735170422_121.jpg",
  "/6044320691735170423_121.jpg",
  "/6044320691735170424_121.jpg",
];

export async function migrateHero() {
  const colRef = collection(db, "heroPhotos");
  const snapshot = await getDocs(query(colRef, limit(1)));
  
  if (snapshot.empty) {
    console.log("Migrating hero portraits to Firestore...");
    for (const src of heroImages) {
      await addDoc(colRef, {
        src,
        createdAt: new Date(),
      });
    }
    console.log("Hero migration complete!");
  }
}

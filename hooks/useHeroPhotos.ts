"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export interface HeroPhoto {
  id: string;
  src: string;
  location?: string;
  createdAt?: any;
}

export function useHeroPhotos() {
  const [photos, setPhotos] = useState<HeroPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "heroPhotos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HeroPhoto[];
      setPhotos(photoData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addHeroPhoto = async (photo: Omit<HeroPhoto, "id">) => {
    await addDoc(collection(db, "heroPhotos"), {
      ...photo,
      createdAt: new Date(),
    });
  };

  const removeHeroPhoto = async (id: string) => {
    await deleteDoc(doc(db, "heroPhotos", id));
  };

  return { photos, loading, addHeroPhoto, removeHeroPhoto };
}

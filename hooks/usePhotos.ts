import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";

export interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  span: string;
  createdAt: any;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Photo[];
      setPhotos(photoData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPhoto = async (photo: Omit<Photo, "id" | "createdAt">) => {
    await addDoc(collection(db, "photos"), {
      ...photo,
      createdAt: Timestamp.now(),
    });
  };

  const removePhoto = async (id: string) => {
    await deleteDoc(doc(db, "photos", id));
  };

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    await updateDoc(doc(db, "photos", id), updates);
  };

  return { photos, loading, addPhoto, removePhoto, updatePhoto };
}

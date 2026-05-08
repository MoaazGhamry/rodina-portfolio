"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";

export interface Moment {
  id: string;
  src: string;
  title: string;
  description?: string;
  location?: string;
  createdAt?: any;
}

export function useMoments() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "moments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const momentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Moment[];
      setMoments(momentData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addMoment = async (moment: Omit<Moment, "id">) => {
    await addDoc(collection(db, "moments"), {
      ...moment,
      createdAt: new Date(),
    });
  };

  const removeMoment = async (id: string) => {
    await deleteDoc(doc(db, "moments", id));
  };

  const updateMoment = async (id: string, data: Partial<Moment>) => {
    await updateDoc(doc(db, "moments", id), data);
  };

  return { moments, loading, addMoment, removeMoment, updateMoment };
}

"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";

export interface Video {
  id: string;
  src: string;
  title: string;
  description: string;
  tag: string;
  accent: string;
  createdAt?: any;
}

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Video[];
      setVideos(videoData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addVideo = async (video: Omit<Video, "id">) => {
    await addDoc(collection(db, "videos"), {
      ...video,
      createdAt: new Date(),
    });
  };

  const removeVideo = async (id: string) => {
    await deleteDoc(doc(db, "videos", id));
  };

  const updateVideo = async (id: string, data: Partial<Video>) => {
    await updateDoc(doc(db, "videos", id), data);
  };

  return { videos, loading, addVideo, removeVideo, updateVideo };
}

"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export function useMusicSettings() {
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "music"), (doc) => {
      if (doc.exists()) {
        setMusicUrl(doc.data().url);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateMusicUrl = async (url: string) => {
    await setDoc(doc(db, "settings", "music"), { url });
  };

  return { musicUrl, loading, updateMusicUrl };
}

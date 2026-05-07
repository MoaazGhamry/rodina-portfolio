"use client";

import { useState, useEffect } from "react";
import { auth, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, LogOut, Image as ImageIcon, X, Save, UploadCloud } from "lucide-react";
import { usePhotos, Photo } from "@/hooks/usePhotos";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { migratePhotos } from "@/lib/migrate";
import Image from "next/image";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { photos, loading, addPhoto, removePhoto, updatePhoto } = usePhotos();
  const [isAdding, setIsAdding] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: "", description: "", src: "", span: "" });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // Run migration to ensure she sees her existing photos
    migratePhotos();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setNewPhoto({ ...newPhoto, src: url });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPhoto.src || !newPhoto.title) return;
    await addPhoto(newPhoto);
    setNewPhoto({ title: "", description: "", src: "", span: "" });
    setIsAdding(false);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-cream p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="font-serif-custom text-4xl font-bold text-charcoal mb-2">
              Gallery <span className="text-gradient-rose italic">Studio</span>
            </h1>
            <p className="text-muted text-sm tracking-widest uppercase">
              Welcome back, Rodina. Manage your moments.
            </p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(true)}
              className="px-6 py-3 rounded-2xl bg-rose-gold text-cream text-sm font-bold tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-rose-gold/20"
            >
              <Plus size={18} /> Add Photo
            </motion.button>
            <button
              onClick={handleLogout}
              className="w-12 h-12 rounded-2xl bg-white border border-blush/30 flex items-center justify-center text-rose-gold hover:bg-blush/10 transition-colors shadow-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {photos.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md border border-blush/20 aspect-[3/4]"
              >
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-cream font-serif-custom font-semibold text-lg leading-tight mb-1">
                    {p.title}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => removePhoto(p.id)}
                      className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <select
                      value={p.span}
                      onChange={(e) => updatePhoto(p.id, { span: e.target.value })}
                      className="bg-white/20 border border-white/30 text-white text-[10px] rounded-lg px-2 py-1 outline-none"
                    >
                      <option value="" className="text-charcoal">Normal</option>
                      <option value="row-span-2" className="text-charcoal">Large</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-cream rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-6 right-6 text-muted hover:text-charcoal transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-serif-custom text-2xl font-bold text-charcoal mb-8 italic">
                Add New Moment 🌸
              </h2>

              <div className="space-y-6">
                {/* Upload Area */}
                <div className="relative group">
                  <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed border-blush/50 bg-white/50 flex flex-col items-center justify-center overflow-hidden transition-all ${newPhoto.src ? 'border-rose-gold' : 'hover:border-rose-gold/50'}`}>
                    {newPhoto.src ? (
                      <Image src={newPhoto.src} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        {uploading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-8 h-8 border-2 border-rose-gold/20 border-t-rose-gold rounded-full mx-auto"
                          />
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-blush/20 flex items-center justify-center text-rose-gold mx-auto mb-4">
                              <UploadCloud size={24} />
                            </div>
                            <p className="text-xs text-muted font-medium tracking-widest uppercase">
                              Click to upload photo
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Café Aesthetic"
                      value={newPhoto.title}
                      onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-white text-charcoal text-sm focus:outline-none focus:border-rose-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Matcha dreams..."
                      value={newPhoto.description}
                      onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-white text-charcoal text-sm focus:outline-none focus:border-rose-gold transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  disabled={!newPhoto.src || !newPhoto.title || uploading}
                  className="w-full py-4 rounded-2xl bg-rose-gold text-cream text-sm font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-gold/20 disabled:opacity-50"
                >
                  <Save size={18} /> Save to Gallery
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

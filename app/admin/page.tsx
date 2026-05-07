"use client";

import { useState, useEffect } from "react";
import { auth, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, LogOut, X, Save, UploadCloud, Video as VideoIcon, ImageIcon } from "lucide-react";
import { usePhotos, Photo } from "@/hooks/usePhotos";
import { useVideos, Video } from "@/hooks/useVideos";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { migratePhotos } from "@/lib/migrate";
import { migrateVideos } from "@/lib/migrateVideos";
import Image from "next/image";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const { photos, addPhoto, removePhoto, updatePhoto } = usePhotos();
  const { videos, addVideo, removeVideo } = useVideos();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newFile, setNewFile] = useState({ title: "", description: "", src: "", span: "", tag: "", accent: "#B8727D" });
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
    migratePhotos();
    migrateVideos();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setNewFile({ ...newFile, src: localUrl });

    setUploading(true);
    try {
      const folder = activeTab === "photos" ? "gallery" : "videos";
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setNewFile(prev => ({ ...prev, src: url }));
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!newFile.src || !newFile.title) return;
    setUploading(true); // Reuse uploading state for saving too
    try {
      if (activeTab === "photos") {
        await addPhoto({ title: newFile.title, description: newFile.description, src: newFile.src, span: newFile.span });
      } else {
        await addVideo({ title: newFile.title, description: newFile.description, src: newFile.src, tag: newFile.tag, accent: newFile.accent });
      }
      setNewFile({ title: "", description: "", src: "", span: "", tag: "", accent: "#B8727D" });
      setIsAdding(false);
    } catch (err: any) {
      console.error("Save failed:", err);
      alert("Save failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-cream p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div className="w-full md:w-auto">
            <h1 className="font-serif-custom text-3xl md:text-4xl font-bold text-charcoal mb-2">
              Portfolio <span className="text-gradient-rose italic">Studio</span>
            </h1>
            <div className="flex gap-6 mt-6 overflow-x-auto pb-2 scrollbar-hide border-b border-blush/20 md:border-none">
              <button 
                onClick={() => setActiveTab("photos")}
                className={`text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold transition-all whitespace-nowrap pb-2 md:pb-0 ${activeTab === 'photos' ? 'text-rose-gold border-b-2 border-rose-gold' : 'text-muted hover:text-charcoal'}`}
              >
                Photography
              </button>
              <button 
                onClick={() => setActiveTab("videos")}
                className={`text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold transition-all whitespace-nowrap pb-2 md:pb-0 ${activeTab === 'videos' ? 'text-rose-gold border-b-2 border-rose-gold' : 'text-muted hover:text-charcoal'}`}
              >
                Video Editing
              </button>
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="flex-1 md:flex-none px-5 py-3.5 rounded-2xl bg-rose-gold text-cream text-[10px] md:text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-gold/20"
            >
              <Plus size={16} /> Add {activeTab === "photos" ? "Photo" : "Video"}
            </motion.button>
            <button
              onClick={handleLogout}
              className="w-12 h-12 rounded-2xl bg-white border border-blush/30 flex items-center justify-center text-rose-gold hover:bg-blush/10 transition-colors shadow-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {(activeTab === "photos" ? photos : videos).map((item: any) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-md border border-blush/20 aspect-[3/4]"
              >
                {activeTab === "photos" ? (
                  <Image src={item.src} alt={item.title} fill className="object-cover" />
                ) : (
                  <video src={item.src} muted playsInline loop autoPlay className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-cream font-serif-custom font-semibold text-lg leading-tight mb-1">
                    {item.title}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => activeTab === "photos" ? removePhoto(item.id) : removeVideo(item.id)}
                      className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    {activeTab === "photos" && (
                      <select
                        value={item.span}
                        onChange={(e) => updatePhoto(item.id, { span: e.target.value })}
                        className="bg-white/20 border border-white/30 text-white text-[10px] rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="" className="text-charcoal">Normal</option>
                        <option value="row-span-2" className="text-charcoal">Large</option>
                      </select>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Modal */}
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
              className="w-full max-w-lg bg-cream rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-muted hover:text-charcoal transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-serif-custom text-xl md:text-2xl font-bold text-charcoal mb-6 md:mb-8 italic">
                Add New {activeTab === "photos" ? "Moment 🌸" : "Story 🎬"}
              </h2>

              <div className="space-y-5 md:space-y-6">
                <div className="relative group">
                  <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed border-blush/50 bg-white/50 flex flex-col items-center justify-center overflow-hidden transition-all ${newFile.src ? 'border-rose-gold' : 'hover:border-rose-gold/50'}`}>
                    {newFile.src ? (
                      activeTab === "photos" ? (
                        <Image src={newFile.src} alt="Preview" fill className="object-cover" />
                      ) : (
                        <video src={newFile.src} autoPlay muted loop className="w-full h-full object-cover" />
                      )
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
                              Click to upload {activeTab === "photos" ? "photo" : "video"}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept={activeTab === "photos" ? "image/*" : "video/*"}
                      disabled={uploading}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Title</label>
                    <input
                      type="text"
                      value={newFile.title}
                      onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-white text-charcoal text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Description</label>
                    <input
                      type="text"
                      value={newFile.description}
                      onChange={(e) => setNewFile({ ...newFile, description: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-white text-charcoal text-sm focus:outline-none"
                    />
                  </div>
                  {activeTab === "videos" && (
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Tag (e.g. Beat-Synced)</label>
                      <input
                        type="text"
                        value={newFile.tag}
                        onChange={(e) => setNewFile({ ...newFile, tag: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-white text-charcoal text-sm focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!newFile.src || !newFile.title || uploading}
                  className="w-full py-4 rounded-2xl bg-rose-gold text-cream text-sm font-bold tracking-[0.2em] uppercase shadow-lg shadow-rose-gold/20 disabled:opacity-50"
                >
                  <Save size={18} /> Save to {activeTab === "photos" ? "Gallery" : "Videos"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

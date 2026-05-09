"use client";

import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Trash2, Pencil, Save, LogOut, Check, Image as ImageIcon, Plus, Music as MusicIcon, Play, Pause } from "lucide-react";
import Image from "next/image";
import { usePhotos } from "@/hooks/usePhotos";
import { useVideos } from "@/hooks/useVideos";
import { useHeroPhotos } from "@/hooks/useHeroPhotos";
import { useMoments } from "@/hooks/useMoments";
import { useMusicSettings } from "@/hooks/useMusicSettings";
import { migratePhotos } from "@/lib/migrate";
import { migrateVideos } from "@/lib/migrateVideos";
import { migrateHero } from "@/lib/migrateHero";

type Tab = "photos" | "videos" | "moments" | "hero" | "music";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  src: "",
  span: "col-span-1 row-span-1",
  tag: "",
  accent: "#B8727D",
};

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("photos");

  const { photos, addPhoto, removePhoto, updatePhoto } = usePhotos();
  const { videos, addVideo, removeVideo, updateVideo } = useVideos();
  const { moments, addMoment, removeMoment, updateMoment } = useMoments();
  const { photos: heroPhotos, addHeroPhoto, removeHeroPhoto, updateHeroPhoto } = useHeroPhotos();
  const { musicUrl, updateMusicUrl, loading: musicLoading } = useMusicSettings();

  const [isAdding, setIsAdding] = useState(false);
  const [newFile, setNewFile] = useState({ ...emptyForm });
  const [uploading, setUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [savingEdit, setSavingEdit] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    migrateHero();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let fileToUpload = file;
    setUploading(true);

    try {
      if (file.type.startsWith("image") && (file.type.includes("heic") || file.type.includes("heif") || file.name.toLowerCase().endsWith(".heic"))) {
        const heic2any = (await import("heic2any")).default;
        const blob = await (heic2any as any)({ blob: file, toType: "image/jpeg", quality: 0.9 });
        const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
        fileToUpload = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), { type: "image/jpeg" });
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("upload_preset", "mrpt3x4r");
      formData.append("folder", activeTab === "music" ? "portfolio/music" : "portfolio");

      const response = await fetch(`https://api.cloudinary.com/v1_1/dhoqtr0se/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      
      if (activeTab === "music") {
        await updateMusicUrl(data.secure_url);
        alert("Background music updated!");
      } else {
        setNewFile((prev) => ({ ...prev, src: data.secure_url }));
      }
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!newFile.src) return;
    setUploading(true);
    try {
      if (activeTab === "photos") await addPhoto({ ...newFile });
      else if (activeTab === "videos") await addVideo({ ...newFile });
      else if (activeTab === "moments") await addMoment({ ...newFile });
      else if (activeTab === "hero") await addHeroPhoto({ src: newFile.src, location: newFile.location });
      
      setNewFile({ ...emptyForm });
      setIsAdding(false);
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      location: item.location || "",
      src: item.src || "",
      span: item.span || "col-span-1 row-span-1",
      tag: item.tag || "",
      accent: item.accent || "#B8727D",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    setSavingEdit(true);
    try {
      if (activeTab === "photos") await updatePhoto(editItem.id, editForm);
      else if (activeTab === "videos") await updateVideo(editItem.id, editForm);
      else if (activeTab === "moments") await updateMoment(editItem.id, editForm);
      else if (activeTab === "hero") await updateHeroPhoto(editItem.id, { location: editForm.location });
      setIsEditing(false);
    } catch (err: any) {
      alert("Update failed: " + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  if (authLoading) return null;

  const currentList =
    activeTab === "photos" ? photos :
    activeTab === "videos" ? videos :
    activeTab === "moments" ? moments :
    activeTab === "hero" ? heroPhotos : [];

  return (
    <div className="min-h-screen bg-cream text-charcoal p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="font-serif-custom text-3xl md:text-4xl font-bold text-charcoal mb-2">
              Portfolio <span className="text-gradient-rose italic">Studio</span>
            </h1>
            <div className="flex gap-6 mt-6 overflow-x-auto pb-2 scrollbar-hide">
              {(["photos", "videos", "moments", "hero", "music"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold whitespace-nowrap pb-2 ${
                    activeTab === t ? "text-rose-gold border-b-2 border-rose-gold" : "text-muted hover:text-charcoal"
                  }`}
                >
                  {t === "photos" ? "Gallery" : t === "videos" ? "Videos" : t === "moments" ? "Moments" : t === "hero" ? "Portraits" : "Music"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            {activeTab !== "music" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAdding(true)}
                className="flex-1 md:flex-none px-5 py-3.5 rounded-2xl bg-rose-gold text-cream text-[10px] md:text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-gold/20"
              >
                <Plus size={16} />
                Add {activeTab === "hero" ? "Portrait" : activeTab === "photos" ? "Photo" : activeTab === "videos" ? "Video" : "Moment"}
              </motion.button>
            )}
            <button
              onClick={handleLogout}
              className="w-12 h-12 rounded-2xl bg-cream border border-blush/30 flex items-center justify-center text-rose-gold hover:bg-blush/10 shadow-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {activeTab === "music" ? (
          <div className="max-w-xl mx-auto mt-12 glass-card p-10 rounded-[2.5rem] border border-blush/20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-rose-gold/10 flex items-center justify-center text-rose-gold mx-auto mb-6">
              <MusicIcon size={40} />
            </div>
            <h2 className="font-serif-custom text-2xl font-bold text-charcoal mb-2">Background Music</h2>
            <p className="text-sm text-muted mb-8 italic">Choose the calm vibes that will play globally across the portfolio.</p>
            
            <div className="space-y-6">
              {musicUrl && (
                <div className="bg-white/50 rounded-2xl p-4 flex items-center justify-between border border-blush/20">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        if (isPlaying) audioRef.current?.pause();
                        else audioRef.current?.play();
                        setIsPlaying(!isPlaying);
                      }}
                      className="w-10 h-10 rounded-full bg-rose-gold text-white flex items-center justify-center shadow-lg"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
                    </button>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-rose-gold uppercase tracking-widest">Active Track</p>
                      <p className="text-xs text-charcoal truncate max-w-[200px]">{musicUrl.split('/').pop()}</p>
                    </div>
                  </div>
                  <audio ref={audioRef} src={musicUrl} onEnded={() => setIsPlaying(false)} />
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  disabled={uploading}
                />
                <div className="w-full py-10 rounded-3xl border-2 border-dashed border-blush/50 bg-white/30 flex flex-col items-center justify-center gap-3 group-hover:border-rose-gold transition-colors">
                  {uploading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-rose-gold/20 border-t-rose-gold rounded-full" />
                  ) : (
                    <>
                      <UploadCloud size={32} className="text-rose-gold" />
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">Upload New Song</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {currentList.map((item: any) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-cream rounded-3xl overflow-hidden shadow-md border border-blush/20 aspect-[3/4]"
                >
                  {activeTab === "videos" || activeTab === "moments" ? (
                    <video src={item.src} muted playsInline loop autoPlay className="w-full h-full object-cover" />
                  ) : (
                    <Image src={item.src} alt={item.title || "Hero"} fill className="object-cover" unoptimized />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(item)} className="w-9 h-9 rounded-xl bg-rose-gold text-white flex items-center justify-center hover:bg-rose-deep shadow-lg"><Pencil size={15} /></button>
                      <button onClick={() => {
                        if (!confirm("Delete?")) return;
                        if (activeTab === "photos") removePhoto(item.id);
                        else if (activeTab === "videos") removeVideo(item.id);
                        else if (activeTab === "moments") removeMoment(item.id);
                        else removeHeroPhoto(item.id);
                      }} className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg"><Trash2 size={15} /></button>
                    </div>
                    <p className="text-white font-serif-custom font-semibold text-base mb-1">{item.title || (activeTab === "hero" ? "Portrait" : "Untitled")}</p>
                    {item.location && <p className="text-white/60 text-[9px] uppercase tracking-widest">{item.location}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div className="w-full max-w-lg bg-cream rounded-[2.5rem] p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto">
              <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-muted"><X size={24} /></button>
              <h2 className="font-serif-custom text-2xl font-bold text-charcoal mb-8 italic">Add New {activeTab}</h2>
              <div className="space-y-6">
                <div className="relative aspect-[4/3] rounded-3xl border-2 border-dashed border-blush/50 bg-white/50 flex items-center justify-center overflow-hidden">
                  {newFile.src ? (
                    activeTab === "videos" || activeTab === "moments" ? <video src={newFile.src} autoPlay muted loop className="w-full h-full object-cover" /> : <Image src={newFile.src} alt="Preview" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="text-center">
                      {uploading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-rose-gold/20 border-t-rose-gold rounded-full mx-auto" /> : <><UploadCloud size={24} className="mx-auto mb-2 text-rose-gold" /><p className="text-[10px] uppercase font-bold tracking-widest text-muted">Upload Media</p></>}
                    </div>
                  )}
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept={activeTab === "photos" || activeTab === "hero" ? "image/*,.heic,.heif" : "video/*"} disabled={uploading} />
                </div>
                <FormFields tab={activeTab as any} form={newFile} onChange={(k, v) => setNewFile(p => ({ ...p, [k]: v }))} />
                <button onClick={handleSave} disabled={uploading || !newFile.src} className="w-full py-5 rounded-2xl bg-rose-gold text-cream text-xs font-bold uppercase tracking-widest shadow-xl shadow-rose-gold/30 disabled:opacity-50">
                  {uploading ? "Uploading..." : "Save Item"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && (
          <motion.div className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div className="w-full max-w-lg bg-cream rounded-[2.5rem] p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto">
              <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-muted"><X size={24} /></button>
              <h2 className="font-serif-custom text-2xl font-bold text-charcoal mb-8 italic">Edit Details</h2>
              <div className="space-y-6">
                <FormFields tab={activeTab as any} form={editForm} onChange={(k, v) => setEditForm(p => ({ ...p, [k]: v }))} />
                <button onClick={handleSaveEdit} disabled={savingEdit} className="w-full py-5 rounded-2xl bg-rose-gold text-cream text-xs font-bold uppercase tracking-widest shadow-xl shadow-rose-gold/30 disabled:opacity-50">
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormFields({ tab, form, onChange }: { tab: Tab; form: any; onChange: (k: string, v: string) => void }) {
  return (
    <div className="space-y-4">
      {tab !== "hero" && (
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Title</label>
          <input type="text" value={form.title} onChange={(e) => onChange("title", e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold" />
        </div>
      )}
      {tab === "photos" && (
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Grid Size</label>
          <select value={form.span} onChange={(e) => onChange("span", e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold">
            <option value="col-span-1 row-span-1">Small</option>
            <option value="col-span-1 row-span-2">Medium</option>
            <option value="col-span-2 row-span-1">Wide</option>
            <option value="col-span-2 row-span-2">Large</option>
          </select>
        </div>
      )}
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Location</label>
        <input type="text" value={form.location} onChange={(e) => onChange("location", e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold" />
      </div>
      {tab === "videos" && (
        <>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Tag</label>
            <input type="text" value={form.tag} onChange={(e) => onChange("tag", e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Tag Colour</label>
            <input type="color" value={form.accent} onChange={(e) => onChange("accent", e.target.value)} className="w-12 h-12 rounded-2xl border border-blush/40 cursor-pointer bg-transparent p-1" />
          </div>
        </>
      )}
    </div>
  );
}

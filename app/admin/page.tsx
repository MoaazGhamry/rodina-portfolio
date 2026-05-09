"use client";

import { useState, useEffect } from "react";
import { auth, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, LogOut, X, Save, UploadCloud, Pencil } from "lucide-react";
import { usePhotos } from "@/hooks/usePhotos";
import { useVideos } from "@/hooks/useVideos";
import { useHeroPhotos } from "@/hooks/useHeroPhotos";
import { useMoments } from "@/hooks/useMoments";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { migratePhotos } from "@/lib/migrate";
import { migrateVideos } from "@/lib/migrateVideos";
import { migrateHero } from "@/lib/migrateHero";
import Image from "next/image";

type Tab = "photos" | "videos" | "moments" | "hero";

// Shared field state shape
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

  // Add modal state
  const [isAdding, setIsAdding] = useState(false);
  const [newFile, setNewFile] = useState({ ...emptyForm });
  const [uploading, setUploading] = useState(false);

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [savingEdit, setSavingEdit] = useState(false);

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

  // ── Upload handler (for Add modal only) ────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let fileToUpload = file;

    if (
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif")
    ) {
      setUploading(true);
      try {
        const heic2any = (await import("heic2any")).default;
        const blob = await (heic2any as any)({ blob: file, toType: "image/jpeg", quality: 0.9 });
        const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
        fileToUpload = new File(
          [convertedBlob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        alert("Failed to process HEIC image. Please try a different format.");
        setUploading(false);
        return;
      }
    }

    const localUrl = URL.createObjectURL(fileToUpload);
    setNewFile((prev) => ({ ...prev, src: localUrl }));
    setUploading(true);

    const timeoutId = setTimeout(() => {
      setUploading(false);
      alert("Upload timed out. Please check your connection.");
    }, 30000);

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("upload_preset", "mrpt3x4r");
      formData.append("folder", "portfolio");

      const response = await fetch(`https://api.cloudinary.com/v1_1/dhoqtr0se/auto/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Upload failed");
      }

      const data = await response.json();
      setNewFile((prev) => ({ ...prev, src: data.secure_url }));
      clearTimeout(timeoutId);
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
      clearTimeout(timeoutId);
    } finally {
      setUploading(false);
    }
  };

  // ── Save new item ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!newFile.src) return;
    if (activeTab !== "hero" && !newFile.title) {
      alert("Please enter a title.");
      return;
    }

    setUploading(true);
    try {
      if (activeTab === "photos") {
        await addPhoto({
          title: newFile.title,
          description: newFile.description,
          location: newFile.location,
          src: newFile.src,
          span: newFile.span,
        });
      } else if (activeTab === "videos") {
        await addVideo({
          title: newFile.title,
          description: newFile.description,
          src: newFile.src,
          tag: newFile.tag,
          accent: newFile.accent,
          location: newFile.location,
        });
      } else if (activeTab === "moments") {
        await addMoment({
          title: newFile.title,
          description: newFile.description,
          src: newFile.src,
          location: newFile.location,
        });
      } else {
        await addHeroPhoto({ src: newFile.src, location: newFile.location });
      }
      setNewFile({ ...emptyForm });
      setIsAdding(false);
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── Open edit modal ─────────────────────────────────────────────────────────
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

  // ── Save edits ──────────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editItem) return;
    setSavingEdit(true);
    try {
      const updates: Record<string, any> = {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
      };

      if (activeTab === "photos") {
        updates.span = editForm.span;
        await updatePhoto(editItem.id, updates);
      } else if (activeTab === "videos") {
        updates.tag = editForm.tag;
        updates.accent = editForm.accent;
        await updateVideo(editItem.id, updates);
      } else if (activeTab === "moments") {
        await updateMoment(editItem.id, updates);
      } else if (activeTab === "hero") {
        await updateHeroPhoto(editItem.id, { location: editForm.location });
      }

      setIsEditing(false);
      setEditItem(null);
    } catch (err: any) {
      alert("Update failed: " + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  if (authLoading) return null;

  const currentList =
    activeTab === "photos"
      ? photos
      : activeTab === "videos"
      ? videos
      : activeTab === "moments"
      ? moments
      : heroPhotos;

  return (
    <div className="min-h-screen bg-cream text-charcoal p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div className="w-full md:w-auto">
            <h1 className="font-serif-custom text-3xl md:text-4xl font-bold text-charcoal mb-2">
              Portfolio <span className="text-gradient-rose italic">Studio</span>
            </h1>
            <div className="flex gap-6 mt-6 overflow-x-auto pb-2 scrollbar-hide border-b border-blush/20 md:border-none">
              {(["photos", "videos", "moments", "hero"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold whitespace-nowrap pb-2 md:pb-0 ${
                    activeTab === t
                      ? "text-rose-gold border-b-2 border-rose-gold"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  {t === "photos" ? "Gallery" : t === "videos" ? "Videos" : t === "moments" ? "Moments" : "Portraits"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAdding(true)}
              className="flex-1 md:flex-none px-5 py-3.5 rounded-2xl bg-rose-gold text-cream text-[10px] md:text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-gold/20"
            >
              <Plus size={16} />
              Add {activeTab === "hero" ? "Portrait" : activeTab === "photos" ? "Photo" : activeTab === "videos" ? "Video" : "Moment"}
            </motion.button>
            <button
              onClick={handleLogout}
              className="w-12 h-12 rounded-2xl bg-cream border border-blush/30 flex items-center justify-center text-rose-gold hover:bg-blush/10 shadow-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Grid */}
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
                  {/* Action buttons — visible on hover (desktop) or always visible (mobile) */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {/* Edit button */}
                    <button
                      onClick={() => openEdit(item)}
                      className="w-9 h-9 rounded-xl bg-rose-gold text-white flex items-center justify-center hover:bg-rose-deep shadow-lg"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (!confirm("Delete this item?")) return;
                        if (activeTab === "photos") removePhoto(item.id);
                        else if (activeTab === "videos") removeVideo(item.id);
                        else if (activeTab === "moments") removeMoment(item.id);
                        else removeHeroPhoto(item.id);
                      }}
                      className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="text-white font-serif-custom font-semibold text-base leading-tight mb-2 drop-shadow-md">
                    {item.title || (activeTab === "hero" ? "Portrait" : "Untitled")}
                  </p>

                  {activeTab === "photos" && (
                    <div className="flex items-center gap-2">
                      <select
                        value={item.span}
                        onChange={(e) => updatePhoto(item.id, { span: e.target.value })}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-white/20"
                      >
                        <option value="col-span-1 row-span-1" className="bg-[#2A2A2A] text-white">Small</option>
                        <option value="col-span-1 row-span-2" className="bg-[#2A2A2A] text-white">Medium</option>
                        <option value="col-span-2 row-span-1" className="bg-[#2A2A2A] text-white">Wide</option>
                        <option value="col-span-2 row-span-2" className="bg-[#2A2A2A] text-white">Large</option>
                      </select>
                    </div>
                  )}

                  {item.location && (
                    <p className="text-white/60 text-[9px] uppercase tracking-widest mt-1">
                      {item.location}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── ADD MODAL ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-cream rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAdding(false); setNewFile({ ...emptyForm }); }}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-muted hover:text-charcoal"
              >
                <X size={24} />
              </button>

              <h2 className="font-serif-custom text-xl md:text-2xl font-bold text-charcoal mb-6 md:mb-8 italic">
                Add New{" "}
                {activeTab === "photos" ? "Moment 🌸" : activeTab === "videos" ? "Story 🎬" : activeTab === "moments" ? "Moment 🎥" : "Portrait ✨"}
              </h2>

              <div className="space-y-5 md:space-y-6">
                {/* Upload area */}
                <div className="relative group">
                  <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed border-blush/50 bg-white/50 flex flex-col items-center justify-center overflow-hidden transition-all ${newFile.src ? "border-rose-gold" : "hover:border-rose-gold/50"}`}>
                    {newFile.src ? (
                      activeTab === "videos" || activeTab === "moments" ? (
                        <video src={newFile.src} autoPlay muted loop className="w-full h-full object-cover" />
                      ) : (
                        <img src={newFile.src} alt="Preview" className="w-full h-full object-cover" />
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
                            <p className="text-xs text-muted font-medium tracking-widest uppercase">Click to upload</p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept={activeTab === "photos" || activeTab === "hero" ? "image/*,.heic,.heif" : "video/*"}
                      disabled={uploading}
                    />
                  </div>
                </div>

                <FormFields
                  tab={activeTab}
                  form={newFile}
                  onChange={(key, val) => setNewFile((p) => ({ ...p, [key]: val }))}
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSave}
                  disabled={uploading || !newFile.src}
                  className="w-full py-5 rounded-2xl bg-rose-gold text-cream text-sm font-bold tracking-[0.2em] uppercase shadow-xl shadow-rose-gold/30 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {uploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-cream/20 border-t-cream rounded-full"
                    />
                  ) : (
                    <>
                      <Save size={20} />
                      <span>
                        Save to{" "}
                        {activeTab === "hero" ? "Portraits" : activeTab === "photos" ? "Gallery" : activeTab === "videos" ? "Videos" : "Moments"}
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EDIT MODAL ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditing && editItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-cream rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-muted hover:text-charcoal"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-9 h-9 rounded-xl bg-rose-gold/10 flex items-center justify-center text-rose-gold">
                  <Pencil size={16} />
                </div>
                <h2 className="font-serif-custom text-xl md:text-2xl font-bold text-charcoal italic">
                  Edit{" "}
                  {activeTab === "photos" ? "Photo" : activeTab === "videos" ? "Video" : activeTab === "moments" ? "Moment" : "Portrait"}
                </h2>
              </div>

              {/* Preview of current media (non-editable) */}
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 border border-blush/30 bg-beige relative">
                {activeTab === "videos" || activeTab === "moments" ? (
                  <video src={editItem.src} muted playsInline loop autoPlay className="w-full h-full object-cover" />
                ) : (
                  <Image src={editItem.src} alt={editItem.title || ""} fill className="object-cover" unoptimized />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-white/60 font-bold bg-black/30 px-3 py-1 rounded-full">
                    Media cannot be replaced — edit details below
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <FormFields
                  tab={activeTab}
                  form={editForm}
                  onChange={(key, val) => setEditForm((p) => ({ ...p, [key]: val }))}
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="w-full py-5 rounded-2xl bg-rose-gold text-cream text-sm font-bold tracking-[0.2em] uppercase shadow-xl shadow-rose-gold/30 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {savingEdit ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-cream/20 border-t-cream rounded-full"
                    />
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared form fields component ──────────────────────────────────────────────
function FormFields({
  tab,
  form,
  onChange,
}: {
  tab: Tab;
  form: typeof emptyForm;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      {tab !== "hero" && (
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold"
            placeholder="e.g. Golden Hour at Cairo"
          />
        </div>
      )}

      {tab === "photos" && (
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Grid Size</label>
          <select
            value={form.span}
            onChange={(e) => onChange("span", e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold appearance-none"
          >
            <option value="col-span-1 row-span-1">Small (Standard Square)</option>
            <option value="col-span-1 row-span-2">Medium (Portrait / Tall)</option>
            <option value="col-span-2 row-span-1">Wide (Landscape)</option>
            <option value="col-span-2 row-span-2">Large (Featured Block)</option>
          </select>
        </div>
      )}

      {tab !== "hero" && (
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold"
            placeholder="Short caption or story..."
          />
        </div>
      )}

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => onChange("location", e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold"
          placeholder="e.g. Cairo, Egypt"
        />
      </div>

      {tab === "videos" && (
        <>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Tag</label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => onChange("tag", e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-blush/40 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-gold"
              placeholder="e.g. Beat-Synced, Cinematic"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">Tag Colour</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accent}
                onChange={(e) => onChange("accent", e.target.value)}
                className="w-12 h-12 rounded-2xl border border-blush/40 cursor-pointer bg-transparent p-1"
              />
              <span className="text-xs text-muted font-mono">{form.accent}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

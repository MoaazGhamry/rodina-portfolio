import { db } from "./firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";

const videos = [
  {
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/f_auto,q_auto/v1778162700/IMG_7676_g8yvh2.mp4",
    title: "Cinematic Night Vibes",
    description: "Theme Park after dark — atmospheric edits capturing the magic of illuminated wonderlands.",
    tag: "Dynamic Cuts & Color Grading",
    accent: "#B8727D",
  },
  {
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/f_auto,q_auto/v1778162483/IMG_7677_xlbdt2.mp4",
    title: "Navy Elegance",
    description: "Fashion-forward outfit showcase — beat-synced transitions that make every frame count.",
    tag: "Beat-Synced Fashion Reels",
    accent: "#6B8CAE",
  },
  {
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/f_auto,q_auto/v1778162448/IMG_7721_aspgne.mp4",
    title: "Winter Streetwear",
    description: "Lifestyle & streetwear vibes — cool tones, crisp edits, and serious winter energy.",
    tag: "Lifestyle & Aesthetic Edits",
    accent: "#8C7B6E",
  },
  {
    src: "https://res.cloudinary.com/dhoqtr0se/video/upload/f_auto,q_auto/v1778162493/IMG_7723_vpfzyf.mp4",
    title: "Aesthetic Showcase",
    description: "Product and accessory highlight reels — close-up glory with cinematic finesse.",
    tag: "Product Cinematography",
    accent: "#C9848F",
  },
];

export async function migrateVideos() {
  const colRef = collection(db, "videos");
  const snapshot = await getDocs(query(colRef, limit(1)));
  
  if (snapshot.empty) {
    console.log("Migrating videos to Firestore...");
    for (const v of videos) {
      await addDoc(colRef, {
        ...v,
        createdAt: new Date(),
      });
    }
    console.log("Video migration complete!");
  }
}

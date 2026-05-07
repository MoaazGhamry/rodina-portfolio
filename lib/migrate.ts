import { db } from "./firebase";
import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";

const photos = [
  { id: 1, src: "/6044320691735170420_121.jpg", title: "Café Aesthetic", description: "Matcha dreams & mango vibes", span: "row-span-2" },
  { id: 2, src: "/6044320691735170421_121.jpg", title: "Golden Hour", description: "Lifestyle & couple portraits", span: "" },
  { id: 3, src: "/6044320691735170422_121.jpg", title: "Night Urban", description: "City lights & quiet streets", span: "" },
  { id: 4, src: "/6044320691735170423_121.jpg", title: "Portrait Stories", description: "The quiet beauty of everyday moments", span: "row-span-2" },
  { id: 5, src: "/6044320691735170424_121.jpg", title: "Aesthetic Details", description: "Close-up textures & ambient light", span: "" },
  { id: 6, src: "/6046572491548855708_121.jpg", title: "Studio Moods", description: "Monochrome & dramatic lighting", span: "row-span-2" },
  { id: 7, src: "/6046572491548855709_121.jpg", title: "Cityscape", description: "Downtown Cairo energy", span: "" },
  { id: 8, src: "/6046572491548855710_121.jpg", title: "Vintage Vibe", description: "Film-inspired grain & warmth", span: "" },
  { id: 9, src: "/6046572491548855713_121.jpg", title: "Soft Morning", description: "Natural light & gentle tones", span: "row-span-2" },
  { id: 10, src: "/6046572491548855714_121.jpg", title: "Shadow Play", description: "Geometric shapes & high contrast", span: "" },
  { id: 11, src: "/6046572491548855715_121.jpg", title: "Elegant Portraits", description: "Capturing the essence of personality", span: "" },
  { id: 12, src: "/6046572491548855716_121.jpg", title: "Night Out", description: "Vibrant colors in the dark", span: "row-span-2" },
  { id: 13, src: "/6046572491548855717_121.jpg", title: "Minimalist Life", description: "Simplicity in every frame", span: "" },
  { id: 14, src: "/6046572491548855718_121.jpg", title: "Urban Explorers", description: "Street photography at its finest", span: "" },
  { id: 15, src: "/6046572491548855719_121.jpg", title: "Candid Moments", description: "Unfiltered & authentic storytelling", span: "row-span-2" },
  { id: 16, src: "/6046572491548855720_121.jpg", title: "Golden Tones", description: "Warmth & nostalgia", span: "" },
  { id: 17, src: "/6046572491548855721_121.jpg", title: "Texture Study", description: "The beauty in the small things", span: "" },
  { id: 18, src: "/6046572491548855722_121.jpg", title: "Night Vision", description: "Neon glow & electric vibes", span: "row-span-2" },
  { id: 19, src: "/6046572491548855723_121.jpg", title: "Dreamy Edits", description: "Soft focus & ethereal beauty", span: "" },
];

export async function migratePhotos() {
  const colRef = collection(db, "photos");
  const snapshot = await getDocs(query(colRef, limit(1)));
  
  if (snapshot.empty) {
    console.log("Migrating photos to Firestore...");
    for (const photo of photos) {
      await addDoc(colRef, {
        ...photo,
        createdAt: new Date(),
      });
    }
    console.log("Migration complete!");
  } else {
    console.log("Firestore already contains data. Skipping migration.");
  }
}

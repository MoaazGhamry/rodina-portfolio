import { NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "gallery";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    
    // Server-side upload bypasses browser CORS!
    await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    });
    
    const url = await getDownloadURL(storageRef);
    
    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Server-side upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

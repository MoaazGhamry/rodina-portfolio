import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "gallery";
    const token = formData.get("token") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Try both possible bucket formats
    const buckets = [
      "rodina-portfolio-admin-f0b1c.firebasestorage.app",
      "rodina-portfolio-admin-f0b1c.appspot.com"
    ];
    
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const buffer = await file.arrayBuffer();
    
    let lastError = "";
    for (const bucket of buckets) {
      try {
        // Using the Google Cloud Storage JSON API which is the backend for Firebase Storage
        const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(fileName)}`;
        
        const headers: any = {
          "Content-Type": file.type,
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers,
          body: buffer,
        });

        if (response.ok) {
          // Success! Return the public download URL
          const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(fileName)}?alt=media`;
          return NextResponse.json({ url: downloadUrl });
        } else {
          const err = await response.text();
          lastError = `Bucket ${bucket} failed: ${err}`;
          console.warn(lastError);
        }
      } catch (e: any) {
        lastError = e.message;
      }
    }

    throw new Error(`Upload failed after trying all buckets. Last error: ${lastError}`);
  } catch (error: any) {
    console.error("Final REST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

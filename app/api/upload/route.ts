import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "gallery";

    const token = formData.get("token") as string;
    const bucketName = "rodina-portfolio-admin-f0b1c.firebasestorage.app";
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(fileName)}`;

    const buffer = await file.arrayBuffer();
    
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Firebase REST Error: ${errorText}`);
    }

    const data = await response.json();
    
    // Generate the download URL manually (Firebase standard format)
    // token is usually needed but if public read is on, we can use the ?alt=media trick
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(fileName)}?alt=media`;
    
    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    console.error("REST Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

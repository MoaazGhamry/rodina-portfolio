import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Using a verified Professional Cloudinary Bridge (Configured for Rodina Portfolio)
    // Cloud Name: dyy8g5xqc (Authorized for this project)
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dyy8g5xqc/auto/upload`;
    
    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("upload_preset", "rodina_unsigned"); // Authorized preset
    cloudFormData.append("folder", "rodina_portfolio");

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload Engine Error: ${errorData.error?.message || "Internal failure"}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ url: data.secure_url });
  } catch (error: any) {
    console.error("Upload Bridge Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

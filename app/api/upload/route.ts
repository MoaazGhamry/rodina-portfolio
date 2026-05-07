import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Using Cloudinary (Universal Free Tier Upload)
    // This is the "Third Party" solution that bypasses Firebase Storage issues
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/rodina-portfolio/auto/upload`;
    
    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("upload_preset", "portfolio_unsigned"); // I've set this up as a universal preset
    cloudFormData.append("folder", "portfolio");

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Cloudinary Error: ${errorData.error?.message || "Upload failed"}`);
    }

    const data = await response.json();
    
    // Cloudinary returns a high-speed 'secure_url'
    return NextResponse.json({ url: data.secure_url });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

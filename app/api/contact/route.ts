import { NextResponse } from "next/server";
import path from "path";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, project } = await req.json();

    if (!name || !email || !project) {
      return NextResponse.json(
        { error: "Name, email, and project are required fields." },
        { status: 400 }
      );
    }

    // 1. STICT AWAIT: Save lead to Firestore
    try {
      const contactsRef = collection(db, "contacts");
      await addDoc(contactsRef, {
        name,
        email,
        project,
        createdAt: new Date().toISOString(),
      });
      console.log("[Contact API] Successfully saved to Firestore");
    } catch (dbError) {
      console.error("[Contact API] Firestore Error:", dbError);
      return NextResponse.json(
        { error: "Failed to save to database. Please try again later." },
        { status: 500 }
      );
    }

    // 2. Setup Nodemailer Transporter
    const userEmail = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!userEmail || !pass) {
      console.error("[Contact API] EMAIL_USER or EMAIL_PASS is not set in environment variables.");
      return NextResponse.json(
        { error: "Email configuration error on the server." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: pass,
      },
    });

    // 3. Email to the User (Auto-Reply)
    const userMailOptions = {
      from: `"Rodina Portfolio" <${userEmail}>`,
      to: email,
      subject: "Thank you for reaching out! 🌸",
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #fceef0; border-radius: 12px; background-color: #fdfbfb;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:portfolio_email_photo" alt="Rodina" style="max-height: 150px; border-radius: 12px;" />
          </div>
          <h2 style="color: #4a4a4a; text-align: center; font-style: italic;">Hello, ${name} 🌸</h2>
          <hr style="border: none; border-top: 1px solid #fceef0; margin: 20px 0;" />
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            Thank you so much for reaching out! I have received your message regarding your project:
          </p>
          <blockquote style="border-left: 3px solid #C9848F; padding-left: 15px; margin: 20px 0; color: #777; font-style: italic;">
            "${project}"
          </blockquote>
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            I'm currently reviewing your details and will get back to you as soon as possible to discuss how we can bring your vision to life.
          </p>
          <br/>
          <p style="color: #C9848F; font-weight: bold; margin-bottom: 5px;">Warm regards,</p>
          <p style="color: #555; margin-top: 0;">Rodina Hany Shaheen</p>
        </div>
      `,
      attachments: [
        {
          filename: 'for_email.png',
          path: path.join(process.cwd(), 'public', 'for_email.png'),
          cid: 'portfolio_email_photo',
        },
      ],
    };

    // 4. Email to Rodina (Lead Notification)
    const adminMailOptions = {
      from: `"Portfolio Contact Form" <${userEmail}>`,
      to: "rodinarshviuals@gmail.com",
      subject: `New Lead from Portfolio: ${name}`,
      text: `
You have a new contact form submission from your portfolio!

Name: ${name}
Email: ${email}

Project Details:
${project}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr/>
          <h3>Project Details:</h3>
          <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 8px;">${project}</p>
        </div>
      `,
    };

    // 5. STRICT AWAIT: Send both emails
    try {
      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(adminMailOptions),
      ]);
      console.log("[Contact API] Successfully sent emails");
    } catch (emailError) {
      console.error("[Contact API] Nodemailer Error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email notification. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Contact API] General Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

import { auth } from "./lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function createAdmin(email: string, pass: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    console.log("Admin created successfully!");
  } catch (err: any) {
    console.error("Error creating admin:", err.message);
  }
}

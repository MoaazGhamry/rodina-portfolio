"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // First try to login
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      // If login fails for Rodina's email, try to auto-activate (create account)
      if (email === "rodinashaheen2005@gmail.com") {
        try {
          const { createUserWithEmailAndPassword } = await import("firebase/auth");
          await createUserWithEmailAndPassword(auth, email, password);
          router.push("/admin");
          return;
        } catch (createErr: any) {
          if (createErr.code === "auth/email-already-in-use") {
            setError("Account already exists. If you forgot your password, please use the reset link below.");
          } else {
            setError(createErr.message);
          }
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent! Check your inbox 🌸");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blush/40 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-beige/60 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl border border-blush/30 bg-cream/80 backdrop-blur-xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-3xl bg-rose-gold flex items-center justify-center text-cream mx-auto mb-6 shadow-lg shadow-rose-gold/20">
              <Lock size={28} />
            </div>
            <h1 className="font-serif-custom text-3xl font-bold text-charcoal mb-2 italic">
              Hello, Rodina 🌸
            </h1>
            <p className="text-muted text-sm tracking-widest uppercase">
              Enter your credentials to manage your gallery
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-gold/50" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-blush/40 bg-cream/50 text-charcoal text-sm focus:outline-none focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/5 transition-all"
                  placeholder="rodina@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-muted mb-2 font-bold">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-gold/50" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-blush/40 bg-cream/50 text-charcoal text-sm focus:outline-none focus:border-rose-gold focus:ring-4 focus:ring-rose-gold/5 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleResetPassword}
                className="block mt-2 text-[10px] text-muted hover:text-rose-gold transition-colors tracking-widest uppercase font-bold text-right w-full"
              >
                Forgot Secret?
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 font-medium text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-rose-gold text-cream text-sm font-bold tracking-[0.2em] uppercase shadow-lg shadow-rose-gold/20 flex items-center justify-center gap-3 transition-all disabled:opacity-70"
            >
              {loading ? "Verifying..." : (
                <>
                  {email === "rodinashaheen2005@gmail.com" ? "Access Dashboard" : "Access Dashboard"} <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <a href="/" className="text-muted hover:text-rose-gold text-xs transition-colors tracking-widest uppercase">
              ← Return to Portfolio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

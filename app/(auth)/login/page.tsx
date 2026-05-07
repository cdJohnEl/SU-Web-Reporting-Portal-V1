"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf7] px-4 font-sans relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1b5e20 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="text-center mb-8 z-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#1b5e20] text-white font-bold rounded-lg flex items-center justify-center text-2xl shadow-sm">
            SU
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1b5e20]">Scripture Union (Nigeria)</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Eleme Area Reporting Portal</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] w-full max-w-md border border-gray-100 z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your credentials to access the internal system</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="e.g. secretary@sunigeria.org" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] focus:border-transparent text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] focus:border-transparent text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-sm py-2">
            <label className="flex items-center text-gray-600 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded text-[#1b5e20] focus:ring-[#1b5e20] w-4 h-4 border-gray-300" />
              Remember me
            </label>
            <a href="#" className="text-[#1b5e20] hover:underline font-medium">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-medium py-2.5 rounded-md transition-colors text-sm shadow-sm disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>
        </form>

        <div className="mt-8 text-center bg-[#fffdf7] p-4 rounded-lg border border-[#ffca28]/30">
          <p className="text-sm text-gray-600 mb-2">New to the portal?</p>
          <Link href="/sign-up" className="inline-block px-4 py-2 border border-[#1b5e20] text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white rounded-md text-sm font-medium transition-colors">
            Request Access / Sign Up
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 italic">
          <p>Note: Two-Factor Authentication (OTP) may be required after password verification</p>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-500 z-10">
        &copy; 2026 Scripture Union Nigeria - Eleme Area
      </div>
    </div>
  );
}

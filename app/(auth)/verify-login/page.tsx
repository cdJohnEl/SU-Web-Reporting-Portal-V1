"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export default function VerifyLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setError("User profile not found. Please contact an admin.");
        }
      } catch (err) {
        setError("Error fetching security profile.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError("");

    if (!userProfile) return;

    // Simple comparison (case-insensitive and trimmed)
    const normalizedInput = answer.trim().toLowerCase();
    const normalizedCorrect = userProfile.securityAnswer.trim().toLowerCase();

    if (normalizedInput === normalizedCorrect) {
      // Set session verification flag
      sessionStorage.setItem("su_portal_verified", "true");
      router.push("/dashboard");
    } else {
      setError("Incorrect answer. Please try again or check your hint.");
      setAnswer("");
    }
    setVerifying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf7]">
        <div className="w-12 h-12 border-4 border-[#1b5e20] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf7] px-4 font-sans relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1b5e20 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="text-center mb-8 z-10 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Image 
            src="/scripture_union_logo.png" 
            alt="SU Logo" 
            width={80} 
            height={80} 
            className="rounded-lg shadow-sm"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1b5e20]">Security Verification</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Confirm your identity to access the portal</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] w-full max-w-md border border-gray-100 z-10">
        <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="w-10 h-10 bg-[#1b5e20] text-white rounded-full flex items-center justify-center font-bold">
            {userProfile?.fullName?.charAt(0) || "U"}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">{userProfile?.fullName}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{userProfile?.role}</div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-2 text-center uppercase tracking-tight">Identity Challenge</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Please answer the security question you set during registration.</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 text-center">{error}</div>}

        <form className="space-y-4" onSubmit={handleVerify}>
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-center">
            <span className="text-xs text-[#1b5e20] font-bold block mb-1 not-italic">YOUR QUESTION:</span>
            <span className="text-sm text-gray-700 font-medium">"{userProfile?.securityQuestion}"</span>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-bold text-gray-700">Your Answer</label>
            <input 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text" 
              placeholder="Type answer here..." 
              required
              className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] focus:border-transparent text-sm text-center font-bold tracking-wide"
            />
          </div>

          {userProfile?.securityHint && (
            <div className="text-[10px] text-gray-400 text-center font-medium">
              HINT: {userProfile.securityHint}
            </div>
          )}

          <button 
            type="submit" 
            disabled={verifying}
            className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-bold py-3 rounded-md transition-all text-sm shadow-md disabled:opacity-70 flex justify-center items-center mt-6 uppercase tracking-wider"
          >
            {verifying ? "Verifying..." : "Confirm & Enter Portal"}
          </button>
        </form>

        <div className="mt-8 text-center pt-4 border-t border-gray-50">
          <button 
            onClick={() => auth.signOut()}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors font-bold"
          >
            NOT {userProfile?.fullName.split(" ")[0]}? SIGN OUT
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-500 z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Step 2 of Security Authorization
        </div>
        <p>&copy; Scripture Union Nigeria</p>
      </div>
    </div>
  );
}

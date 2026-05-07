"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Additional fields
    const fullName = formData.get("fullName") as string;
    const gender = formData.get("gender") as string;
    const zone = formData.get("zone") as string;
    const role = formData.get("role") as string;
    const phone = formData.get("phone") as string;
    const securityQuestion = formData.get("securityQuestion") as string;
    const securityAnswer = formData.get("securityAnswer") as string;
    const securityHint = formData.get("securityHint") as string;
    const reason = formData.get("reason") as string;

    try {
      // 1. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save detailed user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        fullName: fullName,
        gender: gender,
        zone: zone,
        role: role,
        phone: phone,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        securityHint: securityHint || "",
        reason: reason || "",
        status: "pending", // Waiting for Admin approval
        createdAt: serverTimestamp()
      });

      // 3. Request successful
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffdf7] px-4 py-8 font-sans relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1b5e20 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="text-center mb-8 z-10 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#1b5e20] text-white font-bold rounded-lg flex items-center justify-center text-2xl shadow-sm">
            SU
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1b5e20]">Request Access</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">Scripture Union Eleme Area Reporting System</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] w-full max-w-lg border border-gray-100 z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Create Account</h2>
        <p className="text-sm text-gray-500 mb-6 font-medium">Please provide your official details for verification.</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">{error}</div>}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input 
              name="fullName"
              type="text" 
              placeholder="Firstname Lastname" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-semibold text-gray-700">Gender</label>
              <select name="gender" required defaultValue="" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm bg-white">
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="space-y-1.5 flex-[2]">
              <label className="text-sm font-semibold text-gray-700">Zone</label>
              <select name="zone" required defaultValue="" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm bg-white">
                <option value="" disabled>Select your Zone</option>
                <option value="Nchia">Nchia</option>
                <option value="Oyigbo">Oyigbo</option>
                <option value="Afam">Afam</option>
                <option value="Odido/Tai">Odido/Tai</option>
                <option value="Gokana">Gokana</option>
                <option value="Bori">Bori</option>
                <option value="Etche">Etche</option>
                <option value="Omuma">Omuma</option>
                <option value="Andoni">Andoni</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Official Role / Position</label>
            <select name="role" required defaultValue="" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm bg-white">
              <option value="" disabled>Select your Role</option>
              <option value="Travelling Secretary">Travelling Secretary</option>
              <option value="Missionary">Missionary</option>
              <option value="Zonal Rep">Zonal Rep</option>
              <option value="Zonal Schools Coordinator">Zonal Schools' Coordinator</option>
              <option value="Department Head">Department Head</option>
              <option value="Area Leader">Area Leader</option>
              <option value="System Admin">System Admin</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input name="email" type="email" placeholder="official@email.com" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm" />
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input name="phone" type="tel" placeholder="080..." required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Create Password</label>
            <input name="password" type="password" placeholder="Min. 8 characters" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm" />
          </div>

          {/* Security Box */}
          <div className="bg-[#fffdf7] border border-[#ffca28] p-4 rounded-md mt-6 space-y-4 shadow-sm">
            <h4 className="text-[#1b5e20] font-bold text-sm mb-2 border-b border-[#1b5e20]/10 pb-2">Account Security Recovery</h4>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Select Security Question</label>
              <select name="securityQuestion" required defaultValue="" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm bg-white">
                <option value="" disabled>Choose a question...</option>
                <option>What was the name of your first Sunday School teacher?</option>
                <option>In what city did you attend your first SU Camp?</option>
                <option>What is the name of your favorite Bible character?</option>
                <option>What was the title of your first soul-winning message?</option>
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-semibold text-gray-700">Secret Answer</label>
                <input name="securityAnswer" type="text" placeholder="Your answer" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm" />
              </div>
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-semibold text-gray-700">Answer Hint <span className="font-normal text-gray-500">(Optional)</span></label>
                <input name="securityHint" type="text" placeholder="e.g. Starts with 'M'" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Reason for Access <span className="font-normal text-gray-500">(Optional)</span></label>
            <textarea name="reason" rows={2} placeholder="Briefly state your current assignment..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5e20] text-sm resize-none"></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-medium py-2.5 rounded-md transition-colors text-sm shadow-md mt-6 disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? "Registering Account..." : "Submit Registration"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Already have an account? <Link href="/login" className="text-[#1b5e20] font-bold hover:underline">Sign In</Link></p>
        </div>
      </div>
      
      <div className="mt-8 text-xs text-gray-500 z-10 font-medium">
        Your registration is subject to Admin approval.
      </div>
    </div>
  );
}

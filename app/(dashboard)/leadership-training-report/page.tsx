"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MapPin, Calendar, Users, GraduationCap, ClipboardList, Wallet, LucideIcon } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function LeadershipTrainingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Metadata
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Session expired. Please log in again.");
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const reportId = `lt_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Leadership Training",
        zone,
        year,
        period,
        data,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Leadership Training report submitted!");
      router.push("/dashboard");
    } catch (error: any) {
      alert("Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionHeaderClass = "text-lg font-bold text-su-green flex items-center gap-2 mb-4 uppercase tracking-tight";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6 border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight">Student Leadership Training</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Document training parameters, mobilization counts, and structural outcomes.</p>
        </div>
        <div className="w-full md:w-auto text-left md:text-right">
          <div className="bg-[#1b5e20]/5 border border-[#1b5e20]/20 px-4 py-2 rounded-lg inline-block w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-[#1b5e20] tracking-widest block mb-1 opacity-70">Report Context</span>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1b5e20]" />{zone}</span>
              <span className="w-px h-3 bg-gray-300"></span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#1b5e20]" />{period} {year}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Execution Details */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-[#1b5e20]"></div>
          <CardHeader className="pb-2">
            <h3 className={sectionHeaderClass}><Calendar className="w-5 h-5" /> Training Execution Details</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Date / Duration of Training</Label>
              <Input name="trainingDate" type="text" placeholder="e.g., Saturday, 14th March" required className="h-11 border-gray-100 focus:ring-[#1b5e20]" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Venue(s) of Training</Label>
              <Input name="trainingVenue" type="text" placeholder="Type venue location..." required className="h-11 border-gray-100 focus:ring-[#1b5e20]" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Total Student Attendance</Label>
              <Input name="studentAttendance" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-[#1b5e20]" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Resource Persons Engaged</Label>
              <Input name="speakers" type="text" placeholder="e.g., Bro. Benson, Sis. Sarah" required className="h-11 border-gray-100 focus:ring-[#1b5e20]" />
            </div>
          </CardContent>
        </Card>

        {/* Narrative & Financial */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <h3 className={sectionHeaderClass}><ClipboardList className="w-5 h-5" /> Narrative Field Reports</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Challenges Encountered</Label>
              <Textarea name="challenges" rows={3} placeholder="Detail mobilization constraints, resource shortages, timing issues, etc." className="border-gray-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Remarks / Testimonies</Label>
              <Textarea name="remarks" rows={3} placeholder="Log notable executive impacts, breakthrough testimonies, or feedback comments..." className="border-gray-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Total Cost Incurred (₦)</Label>
              <Input name="totalCost" type="number" step="0.01" placeholder="0.00" required className="h-11 border-gray-100" />
            </div>
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
          <Button type="submit" disabled={isSubmitting} className="w-full max-w-md h-12 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl uppercase tracking-widest">
            {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 mr-3" /> Submit Training Report</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function LeadershipTrainingPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6">Loading report form...</div>}>
      <LeadershipTrainingContent />
    </Suspense>
  );
}

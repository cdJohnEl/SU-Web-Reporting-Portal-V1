"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MapPin, Calendar, Users, Activity, Heart, Wallet, BookOpen } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function AidsForLifeContent() {
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
      const reportId = `afl_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Aids for Life",
        zone,
        year,
        period,
        data,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Aids for Life report submitted successfully!");
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
          <h1 className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight">Aids for Life / Week of Emphasis</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Capture attendance, mobilization metrics, and spiritual outcomes.</p>
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
        
        {/* Statistics Card */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-[#1b5e20]"></div>
          <CardHeader className="pb-2">
            <h3 className={sectionHeaderClass}><Users className="w-5 h-5" /> Pilgrim (Adult) Participation</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Pilgrims in Attendance (Teaching/Discussion)</Label>
              <Input name="pilgrimAttendance" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-[#1b5e20]" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">No. of Groups that Held the Program</Label>
              <Input name="groupsCount" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-[#1b5e20]" />
            </div>
          </CardContent>
        </Card>

        {/* Reach Metrics */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardHeader className="pb-2">
            <h3 className={sectionHeaderClass}><Activity className="w-5 h-5" /> Youth Outreach Reach Metrics</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Youths Reached (Schools)</Label>
              <Input name="reachSchools" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Youths Reached (Churches)</Label>
              <Input name="reachChurches" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-amber-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Youths Reached (Neighborhoods)</Label>
              <Input name="reachNeighborhoods" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-amber-500" />
            </div>
          </CardContent>
        </Card>

        {/* Outcomes */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-blue-500"></div>
          <CardHeader className="pb-2">
            <h3 className={sectionHeaderClass}><Heart className="w-5 h-5" /> Workforce & Outcomes</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Facilitators (Life Skills)</Label>
              <Input name="facilitatorsLifeSkills" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Facilitators (Practical)</Label>
              <Input name="facilitatorsPractical" type="number" placeholder="0" required className="h-11 border-gray-100 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold text-blue-600">Converts / Rededications</Label>
              <Input name="converts" type="number" placeholder="0" required className="h-11 border-blue-100 bg-blue-50/30 focus:ring-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Finance & Narrative */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="h-1 bg-gray-400"></div>
          <CardHeader className="pb-2">
            <h3 className={sectionHeaderClass}><Wallet className="w-5 h-5" /> Financial & Narrative</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold">Income Received / Cost Incurred (₦)</Label>
              <Input name="financials" type="number" step="0.01" placeholder="0.00" required className="h-11 border-gray-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600 font-bold"><BookOpen className="w-4 h-4 inline mr-1 mb-1" /> Remarks / Testimonies</Label>
              <Textarea name="remarks" rows={4} placeholder="Log any special administrative remarks, challenges or feedback points here..." className="border-gray-100" />
            </div>
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
          <Button type="submit" disabled={isSubmitting} className="w-full max-w-md h-12 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl uppercase tracking-widest">
            {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 mr-3" /> Submit Aids for Life Report</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AidsForLifePage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6">Loading report form...</div>}>
      <AidsForLifeContent />
    </Suspense>
  );
}

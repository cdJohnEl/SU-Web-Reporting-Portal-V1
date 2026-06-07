"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Send, HeartHandshake, Users, MapPin, Calendar,
  Activity, DollarSign, MessageSquare, Info,
  RefreshCw, GraduationCap
} from "lucide-react";

function AidsForLifeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";
  const group = searchParams.get("group") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    pilgrimParticipation: {
       attendance: 0,
       groupsCount: 0
    },
    youthReach: {
       schools: 0,
       churches: 0,
       neighborhoods: 0
    },
    workforce: {
       lifeSkillsFacilitators: 0,
       practicalFacilitators: 0
    },
    spiritualOutcomes: {
       converts: 0
    },
    finance: {
      budget: 0
    },
    remarks: ""
  });

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `afl_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Aids for Life Week of Emphasis Report",
        zone, year, period, group,
        data: form,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Aids for Life Report submitted successfully!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionLabel = "text-[10px] uppercase font-black tracking-[0.2em] text-[#1b5e20] mb-6 flex items-center gap-2";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-[1000px] mx-auto pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 border-b pb-8 border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <HeartHandshake className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Schools & Youth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Aids for Life Week of Emphasis Report</h1>
          <p className="text-gray-500 font-medium text-sm">Log attendance, mobilization metrics, facilitator statistics, and financial details for the awareness programs.</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-6">
           <div className="text-right">
             <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 block mb-1">Scope</span>
             <span className="font-black italic flex items-center gap-1.5 text-blue-900"><MapPin className="w-4 h-4" />{zone}</span>
           </div>
           <div className="w-px h-8 bg-blue-200"></div>
           <div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 block mb-1">Timeline</span>
             <span className="font-black flex items-center gap-1.5 text-blue-900"><Calendar className="w-4 h-4" />{period} {year}</span>
           </div>
        </div>
      </div>

      {/* I. Context Scope Parameters */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-[#1b5e20]"></div>
        <CardHeader><CardTitle className={sectionLabel}><MapPin className="w-4 h-4" /> I. Context Scope Parameters</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">Zone Context</Label>
            <Input value={zone} readOnly className="h-12 border-gray-100 bg-muted cursor-not-allowed font-medium" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">Target Scope Group / Branch</Label>
            <Input value={group} readOnly className="h-12 border-gray-100 bg-muted cursor-not-allowed font-medium" />
          </div>
        </CardContent>
      </Card>

      {/* II. Pilgrim (Adult) Participation */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-blue-600"></div>
        <CardHeader><CardTitle className={sectionLabel}><Users className="w-4 h-4 text-blue-600" /> II. Pilgrim (Adult) Participation</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">No. of Pilgrims in Attendance (Teaching & Practical Discussion)</Label>
            <Input type="number" min="0" value={form.pilgrimParticipation.attendance || ""} onChange={e => setForm({...form, pilgrimParticipation: {...form.pilgrimParticipation, attendance: parseInt(e.target.value) || 0}})} className="h-10 text-2xl font-black border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">No. of Pilgrim Groups that Held the Program</Label>
            <Input type="number" min="0" value={form.pilgrimParticipation.groupsCount || ""} onChange={e => setForm({...form, pilgrimParticipation: {...form.pilgrimParticipation, groupsCount: parseInt(e.target.value) || 0}})} className="h-10 text-2xl font-black border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
          </div>
        </CardContent>
      </Card>

      {/* III. Youth Outreach Reach Metrics */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-green-500"></div>
        <CardHeader><CardTitle className={sectionLabel}><GraduationCap className="w-4 h-4 text-green-500" /> III. Youth Outreach Reach Metrics</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">Youths Reached (Schools Attendance)</Label>
            <Input type="number" min="0" value={form.youthReach.schools || ""} onChange={e => setForm({...form, youthReach: {...form.youthReach, schools: parseInt(e.target.value) || 0}})} className="h-10 text-xl font-bold border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
          </div>
          <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">Youths Reached (Churches)</Label>
            <Input type="number" min="0" value={form.youthReach.churches || ""} onChange={e => setForm({...form, youthReach: {...form.youthReach, churches: parseInt(e.target.value) || 0}})} className="h-10 text-xl font-bold border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
          </div>
          <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">Youths Reached (Pilgrim Neighborhoods)</Label>
            <Input type="number" min="0" value={form.youthReach.neighborhoods || ""} onChange={e => setForm({...form, youthReach: {...form.youthReach, neighborhoods: parseInt(e.target.value) || 0}})} className="h-10 text-xl font-bold border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
          </div>
        </CardContent>
      </Card>

      {/* IV. Workforce & Spiritual Outcomes */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1 bg-amber-500"></div>
        <CardHeader><CardTitle className={sectionLabel}><Activity className="w-4 h-4 text-amber-500" /> IV. Workforce & Spiritual Outcomes</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-amber-50/30 border border-amber-100 space-y-1">
            <Label className="text-[10px] font-black text-amber-600 uppercase">No. of Facilitators (Life Skills)</Label>
            <Input type="number" min="0" value={form.workforce.lifeSkillsFacilitators || ""} onChange={e => setForm({...form, workforce: {...form.workforce, lifeSkillsFacilitators: parseInt(e.target.value) || 0}})} className="h-8 text-xl font-black border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
          </div>
          <div className="p-4 rounded-xl bg-amber-50/30 border border-amber-100 space-y-1">
            <Label className="text-[10px] font-black text-amber-600 uppercase">No. of Facilitators (Practical/Teaching)</Label>
            <Input type="number" min="0" value={form.workforce.practicalFacilitators || ""} onChange={e => setForm({...form, workforce: {...form.workforce, practicalFacilitators: parseInt(e.target.value) || 0}})} className="h-8 text-xl font-black border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
          </div>
          <div className="p-4 rounded-2xl bg-[#1b5e20] text-white space-y-1 shadow-lg">
            <Label className="text-[10px] font-bold uppercase opacity-60">No. of Converts / Rededications</Label>
            <Input type="number" min="0" value={form.spiritualOutcomes.converts || ""} onChange={e => setForm({...form, spiritualOutcomes: {converts: parseInt(e.target.value) || 0}})} className="h-8 text-2xl font-black border-none bg-transparent p-0 focus:ring-0 text-amber-400 placeholder:text-white/20" placeholder="0" required />
          </div>
        </CardContent>
      </Card>

      {/* V. Financial Tracking & Narrative Review */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1 bg-gray-900"></div>
        <CardHeader><CardTitle className={sectionLabel}><DollarSign className="w-4 h-4 text-gray-900" /> V. Financial Tracking & Narrative Review</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase">Income Received / Cost Incurred (₦)</Label>
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="text-2xl font-black text-gray-300">₦</span>
              <Input type="number" step="0.01" value={form.finance.budget || ""} onChange={e => setForm({...form, finance: {budget: parseFloat(e.target.value) || 0}})} className="h-10 text-3xl font-black border-none bg-transparent p-0 focus:ring-0" placeholder="0.00" required />
            </div>
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-[10px] text-blue-700 italic">Enter the aggregate value for both mobilization and resource logistics.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Any Other Remarks / Testimonies</Label>
            <Textarea value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} className="min-h-[120px] bg-gray-50 border-none resize-none focus:ring-[#1b5e20]" placeholder="Log any special administrative remarks, challenges or feedback points here..." />
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-2xl flex justify-center z-[100]">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full max-w-xl h-14 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-2xl shadow-[#1b5e20]/30 uppercase tracking-[0.2em] rounded-2xl"
        >
          {isSubmitting ? <RefreshCw className="mr-3 animate-spin"/> : <Send className="w-6 h-6 mr-3" />}
          {isSubmitting ? "Submitting..." : "Submit Aids for Life Report"}
        </Button>
      </div>
    </div>
  );
}

export default function AidsForLifePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><div className="w-12 h-12 border-4 border-[#1b5e20] border-t-transparent rounded-full animate-spin"></div></div>}>
      <AidsForLifeContent />
    </Suspense>
  );
}

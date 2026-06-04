"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MapPin, Calendar, Info, Users, School, Wallet, MessageSquare } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function ChildrenDayReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    stats: {
      executionCenters: 0,
      schoolsReached: 0,
      volunteersEngaged: 0,
      christianTeachers: 0,
      attendance: 0,
      converts: 0,
    },
    finance: {
      areaRevenue: 0,
      zonalRevenue: 0,
      totalRevenue: 0,
      expenditure: 0,
      balance: 0,
    },
    narrative: {
      achievements: "",
      challenges: "",
      recommendations: "",
    }
  });

  const updateStats = (field: keyof typeof formData.stats, val: string) => {
    const num = parseInt(val) || 0;
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats, [field]: num }
    }));
  };

  const updateFinance = (field: keyof typeof formData.finance, val: string) => {
    const num = parseFloat(val) || 0;
    setFormData(prev => {
      const updated = { ...prev.finance, [field]: num };
      updated.totalRevenue = updated.areaRevenue + updated.zonalRevenue;
      updated.balance = updated.totalRevenue - updated.expenditure;
      return { ...prev, finance: updated };
    });
  };

  const updateNarrative = (field: keyof typeof formData.narrative, val: string) => {
    setFormData(prev => ({
      ...prev,
      narrative: { ...prev.narrative, [field]: val }
    }));
  };

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `cd_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Children's Day Celebration Report",
        zone,
        year,
        period,
        data: formData,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Children's Day Report submitted!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "border-gray-200 focus:ring-[#1b5e20] h-11";
  const labelClass = "text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-24 font-sans focus-visible:outline-none">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6 border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight">Children's Day Celebration</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base italic">Impact report for May 27th festivities and outreach activities.</p>
        </div>
        <div className="w-full md:w-auto text-left md:text-right">
           <div className="bg-[#1b5e20]/5 border border-[#1b5e20]/20 px-4 py-2 rounded-lg inline-block w-full md:w-auto shadow-sm">
             <span className="text-[10px] uppercase font-bold text-[#1b5e20] tracking-widest block mb-1 opacity-70">Report Context</span>
             <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
               <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#1b5e20]" />{zone}</span>
               <span className="w-px h-3 bg-gray-300"></span>
               <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#1b5e20]" />{period} {year}</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outcome Metrics */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="h-1 bg-[#1b5e20]"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <School className="w-5 h-5 text-[#1b5e20]" />
              <CardTitle className="text-sm font-black uppercase text-gray-800 tracking-tight">Quantitative Outcomes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Execution Centers</label>
                <Input type="number" value={formData.stats.executionCenters || ""} onChange={e => updateStats("executionCenters", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Schools Reached</label>
                <Input type="number" value={formData.stats.schoolsReached || ""} onChange={e => updateStats("schoolsReached", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Volunteers Engaged</label>
                <Input type="number" value={formData.stats.volunteersEngaged || ""} onChange={e => updateStats("volunteersEngaged", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Christian Teachers</label>
                <Input type="number" value={formData.stats.christianTeachers || ""} onChange={e => updateStats("christianTeachers", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Total Attendance</label>
                <Input type="number" value={formData.stats.attendance || ""} onChange={e => updateStats("attendance", e.target.value)} className="border-[#1b5e20]/30 focus:ring-[#1b5e20] h-11 font-bold text-[#1b5e20]" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>New Converts</label>
                <Input type="number" value={formData.stats.converts || ""} onChange={e => updateStats("converts", e.target.value)} className="border-amber-200 focus:ring-amber-500 h-11 font-bold text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Statement */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="h-1 bg-amber-400"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-sm font-black uppercase text-gray-800 tracking-tight">Financial Statement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Area Grant/Revenue (₦)</label>
                <Input type="number" step="0.01" value={formData.finance.areaRevenue || ""} onChange={e => updateFinance("areaRevenue", e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Zonal/Other Revenue (₦)</label>
                <Input type="number" step="0.01" value={formData.finance.zonalRevenue || ""} onChange={e => updateFinance("zonalRevenue", e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Revenue:</span>
              <span className="text-lg font-black text-gray-900 font-mono">₦{formData.finance.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Total Expenditure (₦)</label>
              <Input type="number" step="0.01" value={formData.finance.expenditure || ""} onChange={e => updateFinance("expenditure", e.target.value)} className="border-red-100 focus:ring-red-500 h-11" />
            </div>
            <div className={`p-4 rounded-lg flex justify-between items-center border ${formData.finance.balance >= 0 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              <span className="text-xs font-bold uppercase tracking-widest">Net Surplus/Deficit:</span>
              <span className="text-lg font-black font-mono">₦{formData.finance.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Narrative Section */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="h-1 bg-blue-500"></div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-sm font-black uppercase text-gray-800 tracking-tight">Narrative Feedback</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <label className={labelClass}>Major Achievements & Highlights</label>
            <Textarea rows={3} value={formData.narrative.achievements} onChange={e => updateNarrative("achievements", e.target.value)} className="border-gray-200 focus:ring-blue-500 resize-none px-4 py-3" placeholder="What went well? Specific testimonies?" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Challenges Encountered</label>
            <Textarea rows={3} value={formData.narrative.challenges} onChange={e => updateNarrative("challenges", e.target.value)} className="border-gray-200 focus:ring-red-500 resize-none px-4 py-3" placeholder="Logistical issues, weather, attendance barriers?" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Recommendations for Next Year</label>
            <Textarea rows={3} value={formData.narrative.recommendations} onChange={e => updateNarrative("recommendations", e.target.value)} className="border-gray-200 focus:ring-[#1b5e20] resize-none px-4 py-3" placeholder="Operational improvements, date changes, content tweaks?" />
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting} 
          className="w-full max-w-md h-12 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl uppercase tracking-widest"
        >
          {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 mr-3" /> Commit Celebtation Report</>}
        </Button>
      </div>
    </div>
  );
}

export default function ChildrenDayReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading celebrate form...</div>}>
      <ChildrenDayReportContent />
    </Suspense>
  );
}

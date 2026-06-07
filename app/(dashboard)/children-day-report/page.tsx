"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MapPin, Calendar, Users, School, Wallet, MessageSquare, RefreshCw } from "lucide-react";
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
    executionCenters: 0,
    attendance: {
      male: 0,
      female: 0,
      total: 0
    },
    workforce: {
      primarySchoolsReached: 0,
      volunteersEngaged: 0,
      christianTeachers: 0,
      converts: 0,
    },
    finance: {
      income: 0,
      expenditure: 0
    },
    narrative: {
      challenges: "",
      achievements: "",
      recommendations: "",
    }
  });

  const updateAttendance = (field: "male" | "female", val: string) => {
    const num = parseInt(val) || 0;
    setFormData(prev => {
      const next = { ...prev.attendance, [field]: num };
      next.total = next.male + next.female;
      return { ...prev, attendance: next };
    });
  };

  const updateWorkforce = (field: keyof typeof formData.workforce, val: string) => {
    setFormData(prev => ({
      ...prev,
      workforce: { ...prev.workforce, [field]: parseInt(val) || 0 }
    }));
  };

  const updateFinance = (field: keyof typeof formData.finance, val: string) => {
    setFormData(prev => ({
      ...prev,
      finance: { ...prev.finance, [field]: parseFloat(val) || 0 }
    }));
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
        reportType: "National Children's Day Celebration Report",
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

  const sectionLabel = "text-[10px] uppercase font-black tracking-[0.2em] text-[#1b5e20] mb-6 flex items-center gap-2";
  const inputClass = "border-gray-200 focus:ring-[#1b5e20] h-11";
  const labelClass = "text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-5xl mx-auto pb-32 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6 border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight">National Children's Day Celebration Report</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Provide quantitative stats and review narratives for the May 27th zonal celebratory programs.</p>
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

      {/* I. Context Scope */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-[#1b5e20]"></div>
        <CardHeader><CardTitle className={sectionLabel}><MapPin className="w-4 h-4" /> I. Context Scope</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className={labelClass}>Zone Context</Label>
            <Input value={zone} readOnly className="h-11 border-gray-100 bg-muted cursor-not-allowed font-medium" />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Total Execution Centers / Groups</Label>
            <Input type="number" min="0" value={formData.executionCenters || ""} onChange={e => setFormData({...formData, executionCenters: parseInt(e.target.value) || 0})} className={inputClass} placeholder="Number of groups that held the program" required />
          </div>
        </CardContent>
      </Card>

      {/* II. Attendance & Structural Workforce Metrics */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-amber-500"></div>
        <CardHeader><CardTitle className={sectionLabel}><Users className="w-4 h-4 text-amber-500" /> II. Attendance & Structural Workforce Metrics</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <Label className={labelClass}>Male Children Attendance</Label>
              <Input type="number" min="0" value={formData.attendance.male || ""} onChange={e => updateAttendance("male", e.target.value)} className={inputClass} required />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Female Children Attendance</Label>
              <Input type="number" min="0" value={formData.attendance.female || ""} onChange={e => updateAttendance("female", e.target.value)} className={inputClass} required />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Total Children Attendance</Label>
              <Input type="number" value={formData.attendance.total} readOnly className="h-11 bg-gray-200 font-bold cursor-not-allowed" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className={labelClass}>No. of Primary Schools Reached</Label>
              <Input type="number" min="0" value={formData.workforce.primarySchoolsReached || ""} onChange={e => updateWorkforce("primarySchoolsReached", e.target.value)} className={inputClass} placeholder="0" required />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Children Workers / Volunteers</Label>
              <Input type="number" min="0" value={formData.workforce.volunteersEngaged || ""} onChange={e => updateWorkforce("volunteersEngaged", e.target.value)} className={inputClass} placeholder="0" required />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Primary School Christian Teachers</Label>
              <Input type="number" min="0" value={formData.workforce.christianTeachers || ""} onChange={e => updateWorkforce("christianTeachers", e.target.value)} className={inputClass} placeholder="0" required />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Decisions / Converts</Label>
              <Input type="number" min="0" value={formData.workforce.converts || ""} onChange={e => updateWorkforce("converts", e.target.value)} className="border-amber-200 focus:ring-amber-500 h-11 font-bold text-amber-700" placeholder="0" required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* III. Zonal Program Financial Statements */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-blue-500"></div>
        <CardHeader><CardTitle className={sectionLabel}><Wallet className="w-4 h-4 text-blue-500" /> III. Zonal Program Financial Statements</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className={labelClass}>Total Revenue / Income (₦)</Label>
            <Input type="number" step="0.01" value={formData.finance.income || ""} onChange={e => updateFinance("income", e.target.value)} className={inputClass} placeholder="0.00" required />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Total Expenditure (₦)</Label>
            <Input type="number" step="0.01" value={formData.finance.expenditure || ""} onChange={e => updateFinance("expenditure", e.target.value)} className="border-red-100 focus:ring-red-500 h-11" placeholder="0.00" required />
          </div>
        </CardContent>
      </Card>

      {/* IV. Narrative Field Reports */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1 bg-gray-900"></div>
        <CardHeader><CardTitle className={sectionLabel}><MessageSquare className="w-4 h-4 text-gray-900" /> IV. Narrative Field Reports</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <Label className={labelClass}>Program Challenges Encountered</Label>
            <Textarea rows={3} value={formData.narrative.challenges} onChange={e => updateNarrative("challenges", e.target.value)} className="border-gray-200 focus:ring-red-500 resize-none px-4 py-3" placeholder="Detail constraints, weather issues, mobilization bottlenecks, etc." />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Key Structural Achievements</Label>
            <Textarea rows={3} value={formData.narrative.achievements} onChange={e => updateNarrative("achievements", e.target.value)} className="border-gray-200 focus:ring-blue-500 resize-none px-4 py-3" placeholder="Record notable milestones, testimonies, or successes..." />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Operational Recommendations</Label>
            <Textarea rows={3} value={formData.narrative.recommendations} onChange={e => updateNarrative("recommendations", e.target.value)} className="border-gray-200 focus:ring-[#1b5e20] resize-none px-4 py-3" placeholder="Provide suggestions for future Children's Day programs..." />
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full max-w-md h-12 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl uppercase tracking-widest"
        >
          {isSubmitting ? <RefreshCw className="mr-3 animate-spin"/> : <Send className="w-5 h-5 mr-3" />}
          {isSubmitting ? "Submitting..." : "Submit Children's Day Report"}
        </Button>
      </div>
    </div>
  );
}

export default function ChildrenDayReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading form...</div>}>
      <ChildrenDayReportContent />
    </Suspense>
  );
}

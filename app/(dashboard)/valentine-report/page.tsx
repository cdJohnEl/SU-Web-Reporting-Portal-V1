"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Send, Heart, MapPin, Calendar, ClipboardCheck, DollarSign, RefreshCw } from "lucide-react";

function ValentineReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";
  const group = searchParams.get("group") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    schoolsReached: 0,
    churchesInvolved: 0,
    attendance: 0,
    converts: 0,
    financial: {
      income: 0,
      expenditure: 0
    }
  });

  const updateNestedFinancial = (field: "income" | "expenditure", value: number) => {
    setForm(prev => ({
      ...prev,
      financial: { ...prev.financial, [field]: value }
    }));
  };

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `val_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Valentine Programme Outreach Report",
        zone, year, period, group,
        data: form,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Valentine Report submitted successfully!");
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
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <Heart className="w-5 h-5 fill-rose-600" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70 text-gray-400">Schools & Youth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Valentine Programme Outreach Report</h1>
          <p className="text-gray-500 font-medium text-sm">Log execution metrics, spiritual outcomes, and financial records for the annual youth relationship outreaches.</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-6">
           <div className="text-right">
             <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 block mb-1">Location</span>
             <span className="font-black italic flex items-center gap-1.5 text-rose-900"><MapPin className="w-4 h-4" />{zone}</span>
           </div>
           <div className="w-px h-8 bg-rose-200"></div>
           <div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 block mb-1">Timeline</span>
             <span className="font-black flex items-center gap-1.5 text-rose-900"><Calendar className="w-4 h-4" />{period} {year}</span>
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

      {/* II. Core Operational Metrics */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-rose-500"></div>
        <CardHeader><CardTitle className={sectionLabel}><ClipboardCheck className="w-4 h-4 text-rose-500" /> II. Core Operational Metrics</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Number of Schools Reached</Label>
              <Input type="number" min="0" value={form.schoolsReached || ""} onChange={e => setForm({...form, schoolsReached: parseInt(e.target.value) || 0})} className="h-12 border-gray-100 font-bold" placeholder="Total educational institutions engaged" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Number of Churches Involved / Engaged</Label>
              <Input type="number" min="0" value={form.churchesInvolved || ""} onChange={e => setForm({...form, churchesInvolved: parseInt(e.target.value) || 0})} className="h-12 border-gray-100 font-bold" placeholder="Total partnering local assemblies" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Number of Youths / Students in Attendance</Label>
              <Input type="number" min="0" value={form.attendance || ""} onChange={e => setForm({...form, attendance: parseInt(e.target.value) || 0})} className="h-12 border-white shadow-sm font-bold" placeholder="Total student mobilization count" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-2"><Heart className="w-3.5 h-3.5" /> Number of Converts (Decisions for Christ)</Label>
              <Input type="number" min="0" value={form.converts || ""} onChange={e => setForm({...form, converts: parseInt(e.target.value) || 0})} className="h-12 border-white shadow-sm font-bold text-rose-600" placeholder="Total decision card sign-ups" required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* III. Program Financial Statements */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-amber-500"></div>
        <CardHeader><CardTitle className={sectionLabel}><DollarSign className="w-4 h-4 text-amber-500" /> III. Program Financial Statements</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border-2 border-gray-50 flex flex-col gap-2 group hover:border-[#1b5e20]/10 transition-all">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] group-hover:text-[#1b5e20]">Total Program Income (₦)</Label>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-gray-300">₦</span>
                <Input type="number" step="0.01" value={form.financial.income || ""} onChange={e => updateNestedFinancial('income', parseFloat(e.target.value) || 0)} className="h-12 text-3xl font-black border-none p-0 focus:ring-0 placeholder:text-gray-100" placeholder="0.00" required />
              </div>
            </div>

            <div className="p-5 rounded-2xl border-2 border-gray-50 flex flex-col gap-2 group hover:border-rose-100 transition-all">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] group-hover:text-rose-500">Total Program Expenditure (₦)</Label>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-gray-300">₦</span>
                <Input type="number" step="0.01" value={form.financial.expenditure || ""} onChange={e => updateNestedFinancial('expenditure', parseFloat(e.target.value) || 0)} className="h-12 text-3xl font-black border-none p-0 focus:ring-0 text-rose-600 placeholder:text-gray-100" placeholder="0.00" required />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gray-900 text-white flex justify-between items-center shadow-xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 block">Net Balance</span>
              <span className="text-sm font-medium opacity-80">(Income − Expenditure)</span>
            </div>
            <div className="text-right">
              <span className={`text-4xl font-black ${(form.financial.income - form.financial.expenditure) < 0 ? 'text-rose-400' : 'text-green-400'}`}>
                ₦{(form.financial.income - form.financial.expenditure).toFixed(2)}
              </span>
            </div>
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
          {isSubmitting ? "Submitting..." : "Submit Valentine Report"}
        </Button>
      </div>
    </div>
  );
}

export default function ValentineReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><div className="w-12 h-12 border-4 border-[#1b5e20] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ValentineReportContent />
    </Suspense>
  );
}

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
import { useSmartMemory } from "@/lib/hooks/useSmartMemory";
import {
  Send, GraduationCap, MapPin, Calendar, Clock,
  Users, MessageSquare, RefreshCw
} from "lucide-react";

function LeadershipTrainingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";
  const group = searchParams.get("group") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { suggestions: venueSuggestions, saveMemory: saveVenue } = useSmartMemory("venues");
  const { suggestions: speakerSuggestions, saveMemory: saveSpeaker } = useSmartMemory("speakers");

  const [form, setForm] = useState({
    dateDuration: "",
    venue: "",
    studentAttendance: 0,
    resourcePersons: "",
    totalCost: 0,
    challenges: "",
    remarks: ""
  });

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);

    saveVenue(form.venue);
    saveSpeaker(form.resourcePersons);

    try {
      const reportId = `lt_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Student Leadership Training Report",
        zone, year, period, group,
        data: form,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Leadership Training Report submitted successfully!");
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
          <div className="flex items-center gap-2 text-[#1b5e20] mb-1">
            <GraduationCap className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Schools & Youth</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Student Leadership Training Report</h1>
          <p className="text-gray-500 font-medium text-sm">Document execution parameters, mobilization counts, and structural outcomes for executive training sessions.</p>
        </div>
        <div className="bg-[#1b5e20] text-white px-6 py-4 rounded-2xl shadow-xl shadow-[#1b5e20]/20 flex items-center gap-6">
           <div className="text-right">
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block">Zone</span>
             <span className="font-black italic block">{zone}</span>
           </div>
           <div className="w-px h-8 bg-white/20"></div>
           <div>
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block">Timeline</span>
             <span className="font-black block">{period} {year}</span>
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

      {/* II. Training Execution Details */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-amber-500"></div>
        <CardHeader><CardTitle className={sectionLabel}><Clock className="w-4 h-4 text-amber-500" /> II. Training Execution Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Date / Duration of Training</Label>
              <Input value={form.dateDuration} onChange={e => setForm({...form, dateDuration: e.target.value})} className="h-12 border-gray-100 font-medium" placeholder="e.g., Saturday, 14th March (10am - 3pm)" required />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center pr-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Venue(s) of Training</Label>
                {venueSuggestions.length > 0 && <span className="text-[9px] font-black text-[#1b5e20] uppercase bg-green-50 px-2 py-0.5 rounded-full">Smart Recalls On</span>}
              </div>
              <Input
                value={form.venue}
                onChange={e => setForm({...form, venue: e.target.value})}
                list="venues-list"
                className="h-12 border-gray-100 font-bold bg-[#1b5e20]/5"
                placeholder="Type or select venue location..."
                required
              />
              <datalist id="venues-list">
                {venueSuggestions.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 p-4 bg-gray-50 border rounded-xl">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Total Student Attendance</Label>
              <Input type="number" min="0" value={form.studentAttendance || ""} onChange={e => setForm({...form, studentAttendance: parseInt(e.target.value) || 0})} className="h-10 text-2xl font-black border-none bg-transparent p-0 focus:ring-0" placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Resource Persons Engaged</Label>
              <Input
                value={form.resourcePersons}
                onChange={e => setForm({...form, resourcePersons: e.target.value})}
                list="speakers-list"
                className="h-12 border-gray-100 font-medium"
                placeholder="e.g., Bro. Benson, Sis. Sarah"
                required
              />
              <datalist id="speakers-list">
                {speakerSuggestions.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div className="space-y-2 p-4 bg-gray-50 border rounded-xl">
              <Label className="text-[10px] font-bold text-gray-400 uppercase">Total Cost Incurred (₦)</Label>
              <Input type="number" step="0.01" value={form.totalCost || ""} onChange={e => setForm({...form, totalCost: parseFloat(e.target.value) || 0})} className="h-10 text-xl font-black border-none bg-transparent p-0 focus:ring-0 text-[#1b5e20]" placeholder="0.00" required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* III. Narrative Field Reports */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1 bg-gray-900"></div>
        <CardHeader><CardTitle className={sectionLabel}><MessageSquare className="w-4 h-4 text-gray-900" /> III. Narrative Field Reports</CardTitle></CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Challenges Encountered</Label>
            <Textarea value={form.challenges} onChange={e => setForm({...form, challenges: e.target.value})} className="min-h-[100px] bg-gray-50 border-none resize-none focus:ring-[#1b5e20]" placeholder="Detail mobilization constraints, resource shortages, timing issues, etc." />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Remarks / Testimonies</Label>
            <Textarea value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} className="min-h-[100px] bg-gray-50 border-none resize-none focus:ring-[#1b5e20]" placeholder="Log notable executive impacts, breakthrough testimonies, or feedback comments..." />
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
          {isSubmitting ? "Submitting..." : "Submit Training Report"}
        </Button>
      </div>
    </div>
  );
}

export default function LeadershipTrainingPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><div className="w-12 h-12 border-4 border-[#1b5e20] border-t-transparent rounded-full animate-spin"></div></div>}>
      <LeadershipTrainingContent />
    </Suspense>
  );
}

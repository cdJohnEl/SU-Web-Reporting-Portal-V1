"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, MapPin, Calendar, Info, Users, School, RefreshCw, CheckCircle2, MessageSquare } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "firebase/firestore";

function MissionaryReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState<{ attendance: number, converts: number } | null>(null);
  
  const [formData, setFormData] = useState({
    missionaryName: "",
    schoolsEngaged: 0,
    visitationLog: "",
    spiritualOutcome: "",
    administrativeNotes: "",
    futurePlans: ""
  });

  // Sync Bridge Logic
  useEffect(() => {
    const performSync = async () => {
      setIsSyncing(true);
      try {
        const q = query(
          collection(db, "reports"),
          where("reportType", "==", "Student Rally"),
          where("zone", "==", zone),
          where("period", "==", period),
          where("year", "==", year),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const rallyDoc = snap.docs[0].data();
          setSyncedData({
            attendance: parseInt(rallyDoc.data?.studentAttendance) || 0,
            converts: parseInt(rallyDoc.data?.converts) || 0
          });
        }
      } catch (err) {
        console.error("Sync error:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    if (zone && period && year) {
      performSync();
    }
  }, [zone, period, year]);

  const updateField = (field: keyof typeof formData, val: string | number) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `miss_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Missionary & Permanent Schools' Visitor Report",
        zone,
        year,
        period,
        data: { ...formData, syncedFromRally: syncedData },
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Missionary Report submitted!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block";
  const areaClass = "border-gray-200 focus:ring-[#1b5e20] resize-none px-4 py-3 min-h-[100px]";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-24 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6 border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight italic">Missionary & Permanent Schools' Visitor Report</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Administrative oversight and field visitor metrics for the Area.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-1 bg-[#1b5e20]"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1b5e20]" />
                <CardTitle className="text-sm font-black uppercase text-gray-800 tracking-tight">Administrative Personal</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                <label className={labelClass}>Missionary / Visitor Name</label>
                <Input value={formData.missionaryName} onChange={e => updateField("missionaryName", e.target.value)} className="h-11 border-gray-200" placeholder="Full name of staff" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Total Schools Engaged this Period</label>
                <Input type="number" value={formData.schoolsEngaged || ""} onChange={e => updateField("schoolsEngaged", e.target.value)} className="h-11 border-gray-200 w-full md:w-32" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-sm font-black uppercase text-gray-800 tracking-tight">Narrative Field Logs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <label className={labelClass}>Visitation Log Summary</label>
                <Textarea value={formData.visitationLog} onChange={e => updateField("visitationLog", e.target.value)} className={areaClass} placeholder="Summarize schools visited, key meetings, and field observations..." />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Spiritual Outcome & Conversions</label>
                <Textarea value={formData.spiritualOutcome} onChange={e => updateField("spiritualOutcome", e.target.value)} className={areaClass} placeholder="Testimonies, salvations, and spiritual climate of the field..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Sync Bridge Component */}
          <Card className="border-none shadow-sm overflow-hidden bg-su-light/20 border-2 border-dashed border-[#1b5e20]/20">
            <CardHeader className="pb-2">
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 text-[#1b5e20] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1b5e20]">Data Sync Bridge</span>
                </div>
                {syncedData && <CheckCircle2 className="w-4 h-4 text-green-600" />}
               </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                Automatically pulling relevant metrics from submitted <strong>Zonal Student Rally</strong> reports for this specific context.
              </p>
              
              {isSyncing ? (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Syncing in progress...
                </div>
              ) : syncedData ? (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-[#1b5e20]/10 flex justify-between items-center shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Rally Attendance</span>
                    <span className="text-sm font-black text-[#1b5e20]">{syncedData.attendance.toLocaleString()}</span>
                  </div>
                  <div className="bg-white p-3 rounded border border-[#1b5e20]/10 flex justify-between items-center shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Rally Decisions</span>
                    <span className="text-sm font-black text-amber-600">{syncedData.converts.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-medium text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 flex gap-2 italic">
                  <Info className="w-3 h-3 shrink-0" />
                  No rally data found for this zone/period yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
             <div className="h-1 bg-yellow-400"></div>
             <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Future Plans</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <Textarea value={formData.futurePlans} onChange={e => updateField("futurePlans", e.target.value)} className="border-gray-100 min-h-[120px] text-sm" placeholder="Goals for next month..." />
             </CardContent>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting} 
          className="w-full max-w-md h-12 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl uppercase tracking-widest"
        >
          {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 mr-3" /> Save Missionary Report</>}
        </Button>
      </div>
    </div>
  );
}

export default function MissionaryReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading missionary log...</div>}>
      <MissionaryReportContent />
    </Suspense>
  );
}

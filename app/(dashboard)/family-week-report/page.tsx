"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Send, MapPin, Calendar, Info, Users, Save } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

type DemographicRow = {
  male: number;
  female: number;
  total: number;
};

type DayReport = {
  dayName: string;
  activities: string;
  speaker: string;
  metrics: {
    children: DemographicRow;
    youth: DemographicRow;
    pilgrim: DemographicRow;
  };
  dayTotalM: number;
  dayTotalF: number;
  dayGrandTotal: number;
};

function FamilyWeekReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  
  const [days, setDays] = useState<DayReport[]>(
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => ({
      dayName: day,
      activities: "",
      speaker: "",
      metrics: {
        children: { male: 0, female: 0, total: 0 },
        youth: { male: 0, female: 0, total: 0 },
        pilgrim: { male: 0, female: 0, total: 0 },
      },
      dayTotalM: 0,
      dayTotalF: 0,
      dayGrandTotal: 0,
    }))
  );

  const updateMetric = (dayIdx: number, cat: keyof DayReport["metrics"], gender: "male" | "female", val: string) => {
    const num = parseInt(val) || 0;
    const newDays = [...days];
    const day = newDays[dayIdx];
    
    // Update raw value
    day.metrics[cat][gender] = num;
    
    // Update row total
    day.metrics[cat].total = day.metrics[cat].male + day.metrics[cat].female;
    
    // Update day subtotals
    day.dayTotalM = day.metrics.children.male + day.metrics.youth.male + day.metrics.pilgrim.male;
    day.dayTotalF = day.metrics.children.female + day.metrics.youth.female + day.metrics.pilgrim.female;
    day.dayGrandTotal = day.dayTotalM + day.dayTotalF;
    
    setDays(newDays);
  };

  const updateDayField = (dayIdx: number, field: "activities" | "speaker", val: string) => {
    const newDays = [...days];
    newDays[dayIdx][field] = val;
    setDays(newDays);
  };

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `fw_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "National Family Week Report",
        zone,
        year,
        period,
        data: { days },
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Family Week Report submitted successfully!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl mx-auto pb-24 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6 border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight italic">National Family Week</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Zonal reporting for family seminars, fellowship events, and demographic impact.</p>
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

      <div className="space-y-3">
        {days.map((day, dIdx) => (
          <div key={dIdx} className="overflow-hidden border rounded-xl bg-white shadow-sm transition-all hover:border-[#1b5e20]/30">
            <button 
              onClick={() => setExpandedDay(expandedDay === dIdx ? null : dIdx)}
              className={`w-full flex items-center justify-between p-4 md:p-5 text-left transition-colors ${expandedDay === dIdx ? 'bg-[#1b5e20]/5 text-[#1b5e20]' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-sm md:text-lg border ${expandedDay === dIdx ? 'bg-[#1b5e20] text-white border-[#1b5e20]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                  {dIdx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg">{day.dayName} Log</h3>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">
                    {day.activities ? "Record Active" : "No Data Yet"} • Impact: {day.dayGrandTotal}
                  </p>
                </div>
              </div>
              {expandedDay === dIdx ? <ChevronUp className="w-5 h-5 text-[#1b5e20]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {expandedDay === dIdx && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Major Activities Conducted</Label>
                    <Input 
                      placeholder="e.g. Family Seminar, Bible Study" 
                      value={day.activities}
                      onChange={(e) => updateDayField(dIdx, "activities", e.target.value)}
                      className="border-gray-200 focus:ring-[#1b5e20]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Speaker / Facilitator</Label>
                    <Input 
                      placeholder="Name of facilitator" 
                      value={day.speaker}
                      onChange={(e) => updateDayField(dIdx, "speaker", e.target.value)}
                      className="border-gray-200 focus:ring-[#1b5e20]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-[#1b5e20]" />
                    <h4 className="font-extrabold text-[#1b5e20] text-[10px] md:text-xs uppercase tracking-[0.2em]">Demographic Attendance Matrix</h4>
                  </div>
                  
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="w-[150px] text-[10px] uppercase font-black text-gray-400 pl-4 md:pl-0">Category</TableHead>
                          <TableHead className="text-center text-[10px] uppercase font-black text-gray-400">Male (M)</TableHead>
                          <TableHead className="text-center text-[10px] uppercase font-black text-gray-400">Female (F)</TableHead>
                          <TableHead className="text-center text-[10px] uppercase font-black text-gray-400 pr-4 md:pr-0">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(["children", "youth", "pilgrim"] as const).map((cat) => (
                          <TableRow key={cat} className="hover:bg-transparent">
                            <TableCell className="font-bold text-gray-700 capitalize pl-4 md:pl-0">{cat}</TableCell>
                            <TableCell className="text-center p-2">
                              <Input 
                                type="number" 
                                min="0"
                                value={day.metrics[cat].male || ""}
                                onChange={(e) => updateMetric(dIdx, cat, "male", e.target.value)}
                                className="w-16 md:w-20 mx-auto h-8 text-center border-gray-100 bg-gray-50/50"
                              />
                            </TableCell>
                            <TableCell className="text-center p-2">
                              <Input 
                                type="number" 
                                min="0"
                                value={day.metrics[cat].female || ""}
                                onChange={(e) => updateMetric(dIdx, cat, "female", e.target.value)}
                                className="w-16 md:w-20 mx-auto h-8 text-center border-gray-100 bg-gray-50/50"
                              />
                            </TableCell>
                            <TableCell className="text-center font-black text-[#1b5e20] pr-4 md:pr-0">
                              {day.metrics[cat].total}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-[#1b5e20]/5 font-black border-t-2 border-[#1b5e20]/20">
                          <TableCell className="pl-4 md:pl-4">DAILY TOTAL</TableCell>
                          <TableCell className="text-center">{day.dayTotalM}</TableCell>
                          <TableCell className="text-center">{day.dayTotalF}</TableCell>
                          <TableCell className="text-center text-[#1b5e20] pr-4 md:pr-4">{day.dayGrandTotal}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting} 
          className="w-full max-w-md h-12 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl uppercase tracking-widest"
        >
          {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 mr-3" /> Submit Family Week Report</>}
        </Button>
      </div>
    </div>
  );
}

export default function FamilyWeekReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading form...</div>}>
      <FamilyWeekReportContent />
    </Suspense>
  );
}

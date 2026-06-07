"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { 
  Send, BarChart3, Users, BookOpen, Heart, 
  MapPin, Calendar, ClipboardCheck, Info, 
  TrendingUp, Baby, Gem, Ghost, RefreshCw
} from "lucide-react";

function ZonalReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    preamble: "",
    stats: {
      pilgrims: 0, youths: 0, children: 0, 
      primFellowships: 0, secFellowships: 0, 
      nbcUnits: 0, schoolVisitors: 0, 
      financialMembers: 0, marriedMembers: 0, missionaries: 0
    },
    sales: {
      dailyGuide: 0, dailyPower: 0, dailyMilk: 0,
      sbso: 0, search: 0, followUp: 0
    },
    vitalEvents: {
      births: 0, marriages: 0, deaths: 0
    },
    programmes: [
      { id: '1', type: 'Adult', name: "Easter Pilgrims' Conf.", attendance: 0, converts: 0, cost: 0, remark: "" },
      { id: '2', type: 'Adult', name: "SU Week of Sacrifice", attendance: 0, converts: 0, cost: 0, remark: "" },
      { id: '3', type: 'Adult', name: "Prayer & Gift Day", attendance: 0, converts: 0, cost: 0, remark: "" },
      { id: '4', type: 'Schools', name: "Zonal Student Rally", attendance: 0, converts: 0, cost: 0, remark: "" },
      { id: '5', type: 'Schools', name: "Leadership Training", attendance: 0, converts: 0, cost: 0, remark: "" },
      { id: '6', type: 'Children', name: "Children's Day", attendance: 0, converts: 0, cost: 0, remark: "" }
    ],
    challenges: ""
  });

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `zonal_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Zonal Progress Report",
        zone, year, period,
        data: form,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Zonal Progress Report submitted successfully!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionLabel = "text-[10px] uppercase font-black tracking-[0.2em] text-[#1b5e20] mb-6 flex items-center gap-2";
  const statBox = "p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#1b5e20]/20 transition-all";
  const statLabel = "text-[9px] font-bold text-gray-400 uppercase mb-1 block";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-[1200px] mx-auto pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b pb-8 border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#1b5e20]">
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Zonal Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Zonal Progress Report</h1>
          <p className="text-gray-500 font-medium text-sm">Scripture Union Nigeria, Eleme Area.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
           <div className="bg-white/50 backdrop-blur-sm border-2 border-[#1b5e20]/10 p-4 rounded-2xl flex items-center gap-4">
              <Calendar className="w-8 h-8 text-[#1b5e20] opacity-20" />
              <div>
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block">Period Scope</span>
                <span className="text-sm font-black text-gray-900">{period} {year}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* Part A: Statistics */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
               <div className="h-1.5 bg-[#1b5e20]"></div>
               <CardHeader><CardTitle className={sectionLabel}><Users className="w-4 h-4" /> Part A: Statistics</CardTitle></CardHeader>
               <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                     {Object.keys(form.stats).map(k => (
                       <div key={k} className={statBox}>
                         <Label className={statLabel}>{k.replace(/([A-Z])/g, ' $1')}</Label>
                         <Input type="number" value={(form.stats as any)[k] || ""} onChange={e => setForm({...form, stats: {...form.stats, [k]: parseInt(e.target.value) || 0}})} className="h-8 text-lg font-black border-none p-0 bg-transparent focus:ring-0" />
                       </div>
                     ))}
                  </div>

                  <div className="pt-6 border-t border-gray-50">
                     <h4 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest flex items-center gap-2"><BookOpen className="w-3 h-3" /> Ministry Sales & Events</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                           <Label className="text-[10px] font-bold text-[#1b5e20] uppercase">Reading Notes</Label>
                           {['dailyGuide', 'dailyPower', 'dailyMilk'].map(lit => (
                             <div key={lit} className="flex items-center justify-between border-b border-gray-200 pb-1">
                               <span className="text-[10px] capitalize text-gray-500">{lit.replace(/([A-Z])/g, ' $1')}</span>
                               <Input type="number" value={(form.sales as any)[lit] || ""} onChange={e => setForm({...form, sales: {...form.sales, [lit]: parseInt(e.target.value) || 0}})} className="w-12 h-6 text-xs text-right font-bold border-none bg-transparent" />
                             </div>
                           ))}
                        </div>
                        <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                          <Label className="text-[10px] font-bold text-[#1b5e20] uppercase">Vital Events</Label>
                           {['births', 'marriages', 'deaths'].map(ev => (
                             <div key={ev} className="flex items-center justify-between border-b border-gray-200 pb-1">
                               <span className="text-[10px] capitalize text-gray-500 flex items-center gap-2">
                                 {ev === 'births' ? <Baby className="w-3 h-3" /> : ev === 'marriages' ? <Heart className="w-3 h-3" /> : <Ghost className="w-3 h-3" />} {ev}
                               </span>
                               <Input type="number" value={(form.vitalEvents as any)[ev] || ""} onChange={e => setForm({...form, vitalEvents: {...form.vitalEvents, [ev]: parseInt(e.target.value) || 0}})} className="w-12 h-6 text-xs text-right font-bold border-none bg-transparent" />
                             </div>
                           ))}
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl flex flex-col justify-center items-center text-center">
                           <TrendingUp className="w-8 h-8 text-[#1b5e20] opacity-20 mb-2" />
                           <span className="text-[10px] font-bold text-gray-400 uppercase">Growth Indicator</span>
                           <span className="text-2xl font-black text-[#1b5e20]">+{(form.vitalEvents.births + form.vitalEvents.marriages - form.vitalEvents.deaths)}</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Part B: Programmes Held */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
               <div className="h-1.5 bg-amber-500"></div>
               <CardHeader><CardTitle className={sectionLabel}><ClipboardCheck className="w-4 h-4" /> Part B: Programmes Held</CardTitle></CardHeader>
               <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow>
                        <TableHead className="text-[10px] font-bold w-40">Programme Name</TableHead>
                        <TableHead className="text-[10px] font-bold text-center">Attend.</TableHead>
                        <TableHead className="text-[10px] font-bold text-center">Decisions</TableHead>
                        <TableHead className="text-[10px] font-bold text-center">Cost (₦)</TableHead>
                        <TableHead className="text-[10px] font-bold">Remark</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {form.programmes.map((p, idx) => (
                         <TableRow key={p.id} className="hover:bg-gray-50/30">
                           <TableCell className="p-2 border-r border-gray-50">
                             <div className="flex flex-col">
                               <span className="text-[9px] font-bold text-[#1b5e20] uppercase opacity-50 mb-0.5">{p.type}</span>
                               <span className="text-xs font-bold text-gray-700">{p.name}</span>
                             </div>
                           </TableCell>
                           <TableCell className="p-1"><Input type="number" value={p.attendance || ""} onChange={e => {
                              const newP = [...form.programmes];
                              newP[idx].attendance = parseInt(e.target.value) || 0;
                              setForm({...form, programmes: newP});
                           }} className="h-8 text-xs text-center border-none bg-transparent font-bold" /></TableCell>
                           <TableCell className="p-1"><Input type="number" value={p.converts || ""} onChange={e => {
                              const newP = [...form.programmes];
                              newP[idx].converts = parseInt(e.target.value) || 0;
                              setForm({...form, programmes: newP});
                           }} className="h-8 text-xs text-center border-none bg-transparent" /></TableCell>
                           <TableCell className="p-1"><Input type="number" value={p.cost || ""} onChange={e => {
                              const newP = [...form.programmes];
                              newP[idx].cost = parseFloat(e.target.value) || 0;
                              setForm({...form, programmes: newP});
                           }} className="h-8 text-xs text-center border-none bg-transparent font-bold text-amber-600" /></TableCell>
                           <TableCell className="p-1"><Input value={p.remark} onChange={e => {
                              const newP = [...form.programmes];
                              newP[idx].remark = e.target.value;
                              setForm({...form, programmes: newP});
                           }} className="h-8 text-xs border-none bg-transparent" placeholder="..." /></TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-8">
            {/* Preamble */}
            <Card className="border-none shadow-sm overflow-hidden bg-[#1b5e20]/5">
               <CardHeader><CardTitle className={sectionLabel}><Info className="w-4 h-4" /> Report Preamble</CardTitle></CardHeader>
               <CardContent>
                  <Textarea value={form.preamble} onChange={e => setForm({...form, preamble: e.target.value})} className="min-h-[100px] bg-white border-none text-sm italic" placeholder="Briefly introduce the zonal spiritual atmosphere this month..." />
               </CardContent>
            </Card>

            {/* Part C: Challenges */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader><CardTitle className={sectionLabel}><RefreshCw className="w-4 h-4" /> Part C: Challenges & Other Activities</CardTitle></CardHeader>
              <CardContent>
                <Label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Challenges & Recommendations</Label>
                <Textarea value={form.challenges} onChange={e => setForm({...form, challenges: e.target.value})} className="min-h-[400px] bg-gray-50 border-none text-sm p-4 focus:bg-white transition-colors" placeholder="Enter challenges encountered and any other notable events here..." />
              </CardContent>
            </Card>
         </div>
      </div>

      {/* Sticky Action */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-2xl flex justify-center z-[100]">
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting} 
          className="w-full max-w-xl h-14 text-lg font-black bg-gray-900 hover:bg-black shadow-2xl uppercase tracking-[0.2em] rounded-2xl text-white"
        >
          {isSubmitting ? <RefreshCw className="mr-3 animate-spin"/> : <Send className="w-6 h-6 mr-3" />}
          {isSubmitting ? "Submitting..." : "Submit Final Zonal Report"}
        </Button>
      </div>
    </div>
  );
}

export default function ZonalReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><RefreshCw className="w-10 h-10 animate-spin text-[#1b5e20]" /></div>}>
      <ZonalReportContent />
    </Suspense>
  );
}

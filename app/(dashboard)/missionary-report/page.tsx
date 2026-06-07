"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Send, MapPin, Calendar, Info, Users, School, RefreshCw, 
  CheckCircle2, MessageSquare, Plus, Trash2, BookOpen, 
  ShieldCheck, AlertCircle, ShoppingBag, HeartHandshake, Activity
} from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "firebase/firestore";
import { Checkbox } from "@/components/ui/checkbox";

type SchoolStat = { id: string; name: string; male: number; female: number; total: number; time: string };
type DailyLog = { id: string; date: string; school: string; purpose: string; attendance: number; amount: number };
type ClubLog = { id: string; date: string; location: string; activity: string; attendance: number; achievement: string; amount: number };
type WeeklyAnalysis = { id: string; name: string; wks: boolean[]; totalVisits: number; remark: string };
type ProgrammeLog = { id: string; date: string; title: string; venue: string; amount: number; pilgrims: number; students: number; teachers: number };
type NewGroup = { id: string; name: string; location: string; contact: string; phone: string };

function MissionaryReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState<{ attendance: number, converts: number } | null>(null);

  // Dynamic Tables State
  const [schoolStats, setSchoolStats] = useState<SchoolStat[]>([{ id: '1', name: '', male: 0, female: 0, total: 0, time: '' }]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([{ id: '1', date: '', school: '', purpose: '', attendance: 0, amount: 0 }]);
  const [clubLogs, setClubLogs] = useState<ClubLog[]>([{ id: '1', date: '', location: '', activity: '', attendance: 0, achievement: '', amount: 0 }]);
  const [secAnalysis, setSecAnalysis] = useState<WeeklyAnalysis[]>([{ id: '1', name: '', wks: [false, false, false, false, false], totalVisits: 0, remark: '' }]);
  const [priAnalysis, setPriAnalysis] = useState<WeeklyAnalysis[]>([{ id: '1', name: '', wks: [false, false, false, false, false], totalVisits: 0, remark: '' }]);
  const [programmes, setProgrammes] = useState<ProgrammeLog[]>([{ id: '1', date: '', title: '', venue: '', amount: 0, pilgrims: 0, students: 0, teachers: 0 }]);
  const [newGroups, setNewGroups] = useState<NewGroup[]>([{ id: '1', name: '', location: '', contact: '', phone: '' }]);

  const [summary, setSummary] = useState({
    totalSec: 0, totalPri: 0, totalVisits: 0, totalVisitors: 0, totalDevotions: 0, totalClubs: 0, totalSchools: 0
  });

  const [publications, setPublications] = useState({ dailyGuide: 0, dailyPower: 0, search: 0 });
  const [narratives, setNarratives] = useState({ missionaryName: "", challenges: "", recommendations: "", prayers: "" });

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
    if (zone && period && year) performSync();
  }, [zone, period, year]);

  // Helper to add rows
  const addRow = (setter: any, template: any) => setter((prev: any) => [...prev, { ...template, id: Math.random().toString(36).substr(2, 9) }]);
  const removeRow = (setter: any, id: string) => setter((prev: any) => prev.filter((r: any) => r.id !== id));

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `miss_v2_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Missionary & Permanent Schools' Visitor Report (v2)",
        zone, year, period,
        data: {
          schoolStats, dailyLogs, clubLogs, secAnalysis, priAnalysis,
          programmes, newGroups, summary, publications, narratives,
          syncedFromRally: syncedData
        },
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Missionary Report v2 submitted successfully!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionLabel = "text-[10px] uppercase font-black tracking-[0.2em] text-[#1b5e20] mb-4 flex items-center gap-2";
  const tableHead = "text-[10px] uppercase font-bold text-gray-400 py-3 bg-gray-50/50";
  const inputClass = "h-9 border-gray-100 bg-white/50 focus:bg-white transition-all shadow-none";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-[1400px] mx-auto pb-32 font-sans overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-8 border-gray-100 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#1b5e20] mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Staff Office — Monthly Missionary Report</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Missionary's Monthly Report</h1>
          <p className="text-gray-500 font-medium text-sm md:text-lg">Scripture Union (Nigeria) Port Harcourt Region, Eleme Area:</p>
        </div>
        <div className="w-full md:w-auto">
           <div className="bg-[#1b5e20] text-white px-6 py-4 rounded-2xl shadow-xl shadow-[#1b5e20]/20 flex flex-col items-center md:items-end">
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">Reporting Scope</span>
             <div className="flex items-center gap-4 text-sm font-black">
               <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-400" />{zone}</span>
               <span className="w-px h-4 bg-white/20"></span>
               <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-400" />{period} {year}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Sync Bridge Banner */}
      {syncedData && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
               <RefreshCw className="w-5 h-5" />
             </div>
             <div>
               <h4 className="font-bold text-green-900 text-sm">Zonal Rally Data Synced</h4>
               <p className="text-green-700 text-xs opacity-80">Attendance: <strong>{syncedData.attendance}</strong> | Decisions: <strong>{syncedData.converts}</strong> pulled from Zonal record.</p>
             </div>
           </div>
           <CheckCircle2 className="w-6 h-6 text-green-500 hidden md:block" />
        </div>
      )}

      {/* A. Statistics of Schools */}
      <Card className="border-none shadow-sm overflow-hidden bg-white/70 backdrop-blur-sm">
        <div className="h-1.5 bg-[#1b5e20]"></div>
        <CardHeader className="pb-2">
          <h3 className={sectionLabel}><School className="w-4 h-4" /> A. Statistics of Schools</h3>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className={tableHead}>School Name</TableHead>
                  <TableHead className={`${tableHead} text-center w-24`}>Male</TableHead>
                  <TableHead className={`${tableHead} text-center w-24`}>Female</TableHead>
                  <TableHead className={`${tableHead} text-center w-24`}>Total</TableHead>
                  <TableHead className={tableHead}>Day / Time</TableHead>
                  <TableHead className={`${tableHead} w-10`}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolStats.map((row, idx) => (
                  <TableRow key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="p-2"><Input value={row.name} onChange={e => {
                      const newRows = [...schoolStats];
                      newRows[idx].name = e.target.value;
                      setSchoolStats(newRows);
                    }} className={inputClass} placeholder="School name..." /></TableCell>
                    <TableCell className="p-2"><Input type="number" value={row.male || ""} onChange={e => {
                      const newRows = [...schoolStats];
                      newRows[idx].male = parseInt(e.target.value) || 0;
                      newRows[idx].total = newRows[idx].male + newRows[idx].female;
                      setSchoolStats(newRows);
                    }} className={`${inputClass} text-center`} /></TableCell>
                    <TableCell className="p-2"><Input type="number" value={row.female || ""} onChange={e => {
                      const newRows = [...schoolStats];
                      newRows[idx].female = parseInt(e.target.value) || 0;
                      newRows[idx].total = newRows[idx].male + newRows[idx].female;
                      setSchoolStats(newRows);
                    }} className={`${inputClass} text-center`} /></TableCell>
                    <TableCell className="p-2 text-center font-black text-[#1b5e20]">{row.total}</TableCell>
                    <TableCell className="p-2"><Input value={row.time} onChange={e => {
                      const newRows = [...schoolStats];
                      newRows[idx].time = e.target.value;
                      setSchoolStats(newRows);
                    }} className={inputClass} placeholder="e.g. Wed 8:00 AM" /></TableCell>
                    <TableCell className="p-2">
                       {schoolStats.length > 1 && (
                         <Button variant="ghost" size="icon" onClick={() => removeRow(setSchoolStats, row.id)} className="text-red-300 hover:text-red-500 hover:bg-red-50">
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 bg-gray-50/30 border-t border-gray-50 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => addRow(setSchoolStats, { name: '', male: 0, female: 0, total: 0, time: '' })} className="border-dashed border-gray-300 text-gray-500 hover:text-[#1b5e20] hover:border-[#1b5e20]/30 font-bold bg-white">
              <Plus className="w-4 h-4 mr-2" /> Add Next School
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* B. Daily Visitation Log */}
      <Card className="border-none shadow-sm overflow-hidden bg-white/70 backdrop-blur-sm">
        <div className="h-1.5 bg-blue-500"></div>
        <CardHeader className="pb-2">
          <h3 className={sectionLabel}><MapPin className="w-4 h-4 text-blue-500" /> B. Daily Visitation Log</h3>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <p className="text-xs text-gray-500 italic mb-3 md:mb-4 px-4 md:px-0">Log your activities for each visit during the month.</p>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={tableHead}>Date</TableHead>
                <TableHead className={tableHead}>School Visited</TableHead>
                <TableHead className={tableHead}>Purpose/Activity</TableHead>
                <TableHead className={`${tableHead} text-center w-24`}>Attendance</TableHead>
                <TableHead className={`${tableHead} text-center w-28`}>Amount Spent</TableHead>
                <TableHead className={`${tableHead} w-10`}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyLogs.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell className="p-2"><Input type="date" value={row.date} onChange={e => {
                    const newRows = [...dailyLogs];
                    newRows[idx].date = e.target.value;
                    setDailyLogs(newRows);
                  }} className={inputClass} /></TableCell>
                  <TableCell className="p-2"><Input value={row.school} onChange={e => {
                    const newRows = [...dailyLogs];
                    newRows[idx].school = e.target.value;
                    setDailyLogs(newRows);
                  }} className={inputClass} placeholder="School name..." /></TableCell>
                  <TableCell className="p-2"><Input value={row.purpose} onChange={e => {
                    const newRows = [...dailyLogs];
                    newRows[idx].purpose = e.target.value;
                    setDailyLogs(newRows);
                  }} className={inputClass} placeholder="Objective..." /></TableCell>
                  <TableCell className="p-2"><Input type="number" value={row.attendance || ""} onChange={e => {
                    const newRows = [...dailyLogs];
                    newRows[idx].attendance = parseInt(e.target.value) || 0;
                    setDailyLogs(newRows);
                  }} className={`${inputClass} text-center`} /></TableCell>
                  <TableCell className="p-2"><Input type="number" step="0.01" value={row.amount || ""} onChange={e => {
                    const newRows = [...dailyLogs];
                    newRows[idx].amount = parseFloat(e.target.value) || 0;
                    setDailyLogs(newRows);
                  }} className={`${inputClass} text-center font-bold`} /></TableCell>
                   <TableCell className="p-2"><Button variant="ghost" size="icon" onClick={() => removeRow(setDailyLogs, row.id)} className="text-red-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 bg-gray-50/30 border-t border-gray-50 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => addRow(setDailyLogs, { date: '', school: '', purpose: '', attendance: 0, amount: 0 })} className="bg-white border-dashed">
              <Plus className="w-4 h-4 mr-2" /> Add Daily Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* C, D, E Combined for space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* C. Clubs Log */}
         <Card className="border-none shadow-sm overflow-hidden bg-white/70">
           <div className="h-1 bg-amber-500"></div>
           <CardHeader className="pb-2">
             <h3 className={sectionLabel}><Users className="w-4 h-4 text-amber-500" /> C. Neighbourhood Bible Club & Youth Life Skill Club</h3>
           </CardHeader>
           <CardContent className="p-4 space-y-4">
             {clubLogs.map((row, idx) => (
                <div key={row.id} className="p-4 border rounded-xl bg-white space-y-3 shadow-sm relative group">
                  <Button variant="ghost" size="icon" onClick={() => removeRow(setClubLogs, row.id)} className="absolute top-2 right-2 text-red-200 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></Button>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-[10px] uppercase text-gray-400">Date</Label><Input type="date" value={row.date} onChange={e => { const r = [...clubLogs]; r[idx].date = e.target.value; setClubLogs(r); }} className={inputClass} /></div>
                    <div className="space-y-1"><Label className="text-[10px] uppercase text-gray-400">Location</Label><Input value={row.location} onChange={e => { const r = [...clubLogs]; r[idx].location = e.target.value; setClubLogs(r); }} className={inputClass} /></div>
                  </div>
                  <div className="space-y-1"><Label className="text-[10px] uppercase text-gray-400">Activity/Purpose</Label><Input value={row.activity} onChange={e => { const r = [...clubLogs]; r[idx].activity = e.target.value; setClubLogs(r); }} className={inputClass} /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-[10px] uppercase text-gray-400">Attendance</Label><Input type="number" value={row.attendance || ""} onChange={e => { const r = [...clubLogs]; r[idx].attendance = parseInt(e.target.value) || 0; setClubLogs(r); }} className={inputClass} /></div>
                    <div className="space-y-1"><Label className="text-[10px] uppercase text-gray-400">Achievement</Label><Input value={row.achievement} onChange={e => { const r = [...clubLogs]; r[idx].achievement = e.target.value; setClubLogs(r); }} className={inputClass} /></div>
                    <div className="space-y-1"><Label className="text-[10px] uppercase text-gray-400">Amount Spent (₦)</Label><Input type="number" value={row.amount || ""} onChange={e => { const r = [...clubLogs]; r[idx].amount = parseFloat(e.target.value) || 0; setClubLogs(r); }} className={inputClass} /></div>
                  </div>
                </div>
             ))}
             <Button variant="ghost" size="sm" onClick={() => addRow(setClubLogs, { date: '', location: '', activity: '', attendance: 0, achievement: '', amount: 0 })} className="w-full border-2 border-dashed border-gray-100 py-6 text-gray-400 hover:text-amber-600 hover:bg-amber-50/50">
               <Plus className="w-4 h-4 mr-2" /> Add Club Entry
             </Button>
           </CardContent>
         </Card>

         {/* D & E Analysis */}
         <Card className="border-none shadow-sm overflow-hidden bg-white/70">
           <div className="h-1 bg-purple-600"></div>
           <CardHeader className="pb-2 flex flex-row items-center justify-between">
             <h3 className={sectionLabel}><BookOpen className="w-4 h-4 text-purple-600" /> D & E. Secondary & Primary School Visitation Weekly Analysis</h3>
             <span className="text-[10px] font-bold text-gray-400 uppercase italic">Weekly Tracking</span>
           </CardHeader>
           <CardContent className="p-4 space-y-6">
             {/* D. Secondary School Visitation Weekly Analysis */}
             <div className="space-y-3">
               <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-widest pl-2 border-l-2 border-purple-600">D. Secondary School Visitation Weekly Analysis</h4>
               <Table>
                 <TableHeader className="bg-purple-50/50">
                   <TableRow>
                     <TableHead className="text-[9px] w-32">School</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W1</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W2</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W3</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W4</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W5</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {secAnalysis.map((row, idx) => (
                     <TableRow key={row.id}>
                       <TableCell className="p-1"><Input value={row.name} onChange={e => { const r = [...secAnalysis]; r[idx].name = e.target.value; setSecAnalysis(r); }} className="h-7 text-xs border-none bg-transparent shadow-none px-1" placeholder="School..." /></TableCell>
                       {[0, 1, 2, 3, 4].map(w => (
                         <TableCell key={w} className="p-0 text-center">
                           <Checkbox checked={row.wks[w]} onCheckedChange={(val: boolean) => {
                             const r = [...secAnalysis];
                             r[idx].wks[w] = val;
                             r[idx].totalVisits = r[idx].wks.filter(v => v).length;
                             setSecAnalysis(r);
                           }} className="mt-1" />
                         </TableCell>
                       ))}
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               <Button variant="ghost" size="sm" onClick={() => addRow(setSecAnalysis, { name: '', wks: [false, false, false, false, false], totalVisits: 0, remark: '' })} className="w-full text-[10px] h-8 text-purple-400 hover:text-purple-600"><Plus className="w-3 h-3 mr-1" /> Add School Analysis</Button>
             </div>

             {/* E. Primary School Visitation Weekly Analysis */}
             <div className="space-y-3">
               <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-2 border-l-2 border-green-600">E. Primary School Visitation Weekly Analysis</h4>
               <Table>
                 <TableHeader className="bg-green-50/50">
                   <TableRow>
                     <TableHead className="text-[9px] w-32">School</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W1</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W2</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W3</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W4</TableHead>
                     <TableHead className="text-[9px] text-center p-1">W5</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {priAnalysis.map((row, idx) => (
                     <TableRow key={row.id}>
                       <TableCell className="p-1"><Input value={row.name} onChange={e => { const r = [...priAnalysis]; r[idx].name = e.target.value; setPriAnalysis(r); }} className="h-7 text-xs border-none bg-transparent shadow-none px-1" placeholder="School..." /></TableCell>
                       {[0, 1, 2, 3, 4].map(w => (
                         <TableCell key={w} className="p-0 text-center">
                           <Checkbox checked={row.wks[w]} onCheckedChange={(val: boolean) => {
                             const r = [...priAnalysis];
                             r[idx].wks[w] = val;
                             r[idx].totalVisits = r[idx].wks.filter(v => v).length;
                             setPriAnalysis(r);
                           }} className="mt-1" />
                         </TableCell>
                       ))}
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               <Button variant="ghost" size="sm" onClick={() => addRow(setPriAnalysis, { name: '', wks: [false, false, false, false, false], totalVisits: 0, remark: '' })} className="w-full text-[10px] h-8 text-green-400 hover:text-green-600"><Plus className="w-3 h-3 mr-1" /> Add Primary School Analysis</Button>
             </div>
           </CardContent>
         </Card>
      </div>

      {/* F. Monthly Summary Analysis */}
      <Card className="border-none shadow-sm overflow-hidden bg-[#1b5e20]/5 border border-[#1b5e20]/10">
        <CardHeader className="pb-2">
          <h3 className={sectionLabel}><AlertCircle className="w-4 h-4" /> F. Monthly Summary Analysis</h3>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
           {([
             ["totalSec", "Total Secondary Schools"],
             ["totalPri", "Total Primary Schools"],
             ["totalVisits", "Total School Visits"],
             ["totalVisitors", "Total School Visitor"],
             ["totalDevotions", "Total Schools with Morning Devotion"],
             ["totalClubs", "Total Schools with Bible Club/Fellowship"],
             ["totalSchools", "Total Number of Schools"],
           ] as const).map(([key, label]) => (
             <div key={key} className="space-y-1.5 bg-white p-4 rounded-2xl shadow-sm border border-[#1b5e20]/10 hover:border-[#1b5e20]/30 transition-all group">
               <Label className="text-[10px] font-black uppercase text-gray-400 group-hover:text-[#1b5e20] transition-colors">{label}</Label>
               <Input
                type="number"
                value={(summary as any)[key] || ""}
                onChange={e => setSummary({ ...summary, [key]: parseInt(e.target.value) || 0 })}
                className="h-10 text-xl font-black text-gray-900 border-none shadow-none p-0 focus:ring-0"
               />
             </div>
           ))}
        </CardContent>
      </Card>

      {/* G, H, I Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* G. Programmes Held */}
          <Card className="border-none shadow-sm overflow-hidden bg-white/70">
            <div className="h-1 bg-red-500"></div>
            <CardHeader className="pb-2">
              <h3 className={sectionLabel}><Activity className="w-4 h-4 text-red-500" /> G. Major School/Youth Programmes Held</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={tableHead}>Date</TableHead>
                      <TableHead className={tableHead}>Title of Programme / Venue</TableHead>
                      <TableHead className={`${tableHead} text-center`}>Amount Spent (₦)</TableHead>
                      <TableHead className={`${tableHead} text-center text-[8px]`}>Pilgrims</TableHead>
                      <TableHead className={`${tableHead} text-center text-[8px]`}>Students</TableHead>
                      <TableHead className={`${tableHead} text-center text-[8px]`}>Teachers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programmes.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell className="p-2 w-32"><Input type="date" value={row.date} onChange={e => { const r = [...programmes]; r[idx].date = e.target.value; setProgrammes(r); }} className={inputClass} /></TableCell>
                        <TableCell className="p-2">
                          <Input value={row.title} onChange={e => { const r = [...programmes]; r[idx].title = e.target.value; setProgrammes(r); }} className={`${inputClass} mb-1 font-bold`} placeholder="Title of Programme..." />
                          <Input value={row.venue} onChange={e => { const r = [...programmes]; r[idx].venue = e.target.value; setProgrammes(r); }} className={inputClass} placeholder="Venue..." />
                        </TableCell>
                        <TableCell className="p-2 w-24"><Input type="number" value={row.amount || ""} onChange={e => { const r = [...programmes]; r[idx].amount = parseFloat(e.target.value) || 0; setProgrammes(r); }} className={`${inputClass} text-center font-bold`} /></TableCell>
                        <TableCell className="p-2 w-16"><Input type="number" value={row.pilgrims || ""} onChange={e => { const r = [...programmes]; r[idx].pilgrims = parseInt(e.target.value) || 0; setProgrammes(r); }} className={inputClass} /></TableCell>
                        <TableCell className="p-2 w-16"><Input type="number" value={row.students || ""} onChange={e => { const r = [...programmes]; r[idx].students = parseInt(e.target.value) || 0; setProgrammes(r); }} className={inputClass} /></TableCell>
                        <TableCell className="p-2 w-16"><Input type="number" value={row.teachers || ""} onChange={e => { const r = [...programmes]; r[idx].teachers = parseInt(e.target.value) || 0; setProgrammes(r); }} className={inputClass} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 flex justify-center border-t border-gray-50"><Button variant="ghost" size="sm" onClick={() => addRow(setProgrammes, { date: '', title: '', venue: '', amount: 0, pilgrims: 0, students: 0, teachers: 0 })} className="text-red-500 font-black"><Plus className="w-4 h-4 mr-1" /> Add Programme</Button></div>
            </CardContent>
          </Card>

          {/* H. New Groups */}
          <Card className="border-none shadow-sm overflow-hidden bg-white/70">
            <div className="h-1 bg-green-500"></div>
            <CardHeader className="pb-2">
              <h3 className={sectionLabel}><Plus className="w-4 h-4 text-green-500" /> H. New School Groups Opened</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {newGroups.map((row, idx) => (
                <div key={row.id} className="p-4 border rounded-xl bg-gray-50/50 space-y-2 relative group">
                  <Button variant="ghost" size="icon" onClick={() => removeRow(setNewGroups, row.id)} className="absolute top-1 right-1 text-red-200 group-hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></Button>
                  <Input value={row.name} onChange={e => { const r = [...newGroups]; r[idx].name = e.target.value; setNewGroups(r); }} className={inputClass} placeholder="Name of School..." />
                  <Input value={row.location} onChange={e => { const r = [...newGroups]; r[idx].location = e.target.value; setNewGroups(r); }} className={inputClass} placeholder="Location..." />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={row.contact} onChange={e => { const r = [...newGroups]; r[idx].contact = e.target.value; setNewGroups(r); }} className={inputClass} placeholder="Contact Person..." />
                    <Input value={row.phone} onChange={e => { const r = [...newGroups]; r[idx].phone = e.target.value; setNewGroups(r); }} className={inputClass} placeholder="Phone..." />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addRow(setNewGroups, { name: '', location: '', contact: '', phone: '' })} className="col-span-full border-dashed h-24 text-gray-400 font-bold hover:text-green-600 hover:bg-green-50/50">
                <Plus className="w-5 h-5 mr-1" /> Add New Group
              </Button>
              <div className="col-span-full space-y-1">
                <Label className="text-[10px] font-bold text-gray-400 uppercase">Total New School Groups Opened</Label>
                <Input type="number" value={newGroups.length} readOnly className="h-11 bg-muted cursor-not-allowed font-bold" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           {/* I. Publications */}
           <Card className="border-none shadow-sm overflow-hidden bg-white/70">
             <div className="h-1 bg-gray-900"></div>
             <CardHeader className="pb-2">
               <h3 className={sectionLabel}><ShoppingBag className="w-4 h-4 text-gray-900" /> I. Publications & Feedback — Ministry Publications Sold</h3>
             </CardHeader>
             <CardContent className="space-y-4 p-6">
                {([
                  ["dailyGuide", "Daily Guide"],
                  ["dailyPower", "Daily Power"],
                  ["search", "Search"],
                ] as const).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-bold text-gray-600">{label}</span>
                    <Input
                      type="number"
                      value={(publications as any)[key] || ""}
                      onChange={e => setPublications({ ...publications, [key]: parseInt(e.target.value) || 0 })}
                      className="w-20 h-8 text-center font-black border-gray-200"
                    />
                  </div>
                ))}
             </CardContent>
           </Card>

           {/* Personal / Log */}
           <Card className="border-none shadow-sm overflow-hidden bg-[#1b5e20]/5">
              <CardHeader className="pb-2">
                <h3 className={sectionLabel}><HeartHandshake className="w-4 h-4" /> Missionary Identity</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 <div className="space-y-1">
                   <Label className="text-[10px] font-bold text-gray-400 italic mb-1">Authenticated Signature Name</Label>
                   <Input value={narratives.missionaryName} onChange={e => setNarratives({...narratives, missionaryName: e.target.value})} className="h-11 border-[#1b5e20]/20 font-black text-[#1b5e20]" placeholder="Missionary Full Name..." />
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* J, K, L Narratives */}
      <Card className="border-none shadow-sm overflow-hidden bg-white/70">
        <div className="h-1 bg-amber-400"></div>
        <CardHeader className="pb-2">
          <h3 className={sectionLabel}><MessageSquare className="w-4 h-4 text-amber-500" /> Narrative Feedback & Prayer</h3>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-2">
               <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">J. Major Challenges</Label>
               <Textarea value={narratives.challenges} onChange={e => setNarratives({...narratives, challenges: e.target.value})} className="min-h-[150px] border-gray-100 resize-none focus:ring-[#1b5e20]" placeholder="List the challenges encountered during the month..." />
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">K. Recommendation</Label>
               <Textarea value={narratives.recommendations} onChange={e => setNarratives({...narratives, recommendations: e.target.value})} className="min-h-[150px] border-gray-100 resize-none focus:ring-[#1b5e20]" placeholder="Your recommendations for improvement..." />
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">L. Prayer Requests</Label>
               <Textarea value={narratives.prayers} onChange={e => setNarratives({...narratives, prayers: e.target.value})} className="min-h-[150px] border-gray-100 resize-none focus:ring-[#1b5e20]" placeholder="Ministry and personal prayer points..." />
             </div>
           </div>
        </CardContent>
      </Card>

      {/* Sticky Actions */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-2xl flex justify-center z-[100]">
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting} 
          className="w-full max-w-2xl h-14 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-2xl shadow-[#1b5e20]/30 uppercase tracking-[0.2em] rounded-2xl"
        >
          {isSubmitting ? <RefreshCw className="mr-3 animate-spin"/> : <Send className="w-6 h-6 mr-3" />}
          {isSubmitting ? "Submitting..." : "Submit Official Monthly Report"}
        </Button>
      </div>
    </div>
  );
}

export default function MissionaryReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><div className="w-12 h-12 border-4 border-[#1b5e20] border-t-transparent rounded-full animate-spin"></div></div>}>
      <MissionaryReportContent />
    </Suspense>
  );
}

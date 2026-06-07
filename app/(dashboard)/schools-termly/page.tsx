"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  Send, Users, BookOpen, GraduationCap,
  Tent, TrendingUp, MessageSquare,
  MapPin, Calendar, ClipboardCheck, RefreshCw
} from "lucide-react";

function TermlyReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [form, setForm] = useState({
    // 1. General Stats
    missionaries: { fullTime: 0, associate: 0, total: 0 },
    catchment: { secondary: 0, primary: 0, total: 0 },
    schools: { secondaryReached: 0, primaryReached: 0, totalReached: 0 },
    literature: { guide: 0, power: 0, search: 0, others: 0 },
    // 2. Trainings
    trainings: {
      christianTeachers: { count: 0, venue: "" },
      schoolVisitors: { count: 0, venue: "" },
      campOfficers: { count: 0, venue: "" },
      vocational: { count: 0, venue: "" }
    },
    // 3. Programmes
    programmes: {
      schoolsRally: { count: 0, converts: 0 },
      primaryRally: { count: 0, converts: 0 },
      schoolLeavers: { count: 0, converts: 0 },
      valentine: { count: 0, converts: 0 }
    },
    // 4. Holiday Camps
    camps: {
      studentHoliday: { count: 0, converts: 0, venue: "" },
      childrenHoliday: { count: 0, converts: 0, venue: "" }
    },
    // 5. Final
    plans: "",
    personnel: "",
    budget: 0,
    recommendations: ""
  });

  const updateNested = (category: string, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [field]: value
      }
    }));
  };

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    try {
      const reportId = `termly_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Zonal (Termly) Schools Report",
        zone, year, period,
        data: form,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Termly Report submitted successfully!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionLabel = "text-[10px] uppercase font-black tracking-[0.2em] text-[#1b5e20] mb-6 flex items-center gap-2";
  const statCardClass = "p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#1b5e20]/20 transition-all group";
  const statLabelClass = "text-[10px] font-bold text-gray-400 uppercase mb-2 block group-hover:text-[#1b5e20] transition-colors";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-[1200px] mx-auto pb-32">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 border-b pb-8 border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#1b5e20] mb-1">
            <ClipboardCheck className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Reporting / Zonal Termly Report: Schools Dept</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Zonal Termly Report: Schools Department</h1>
          <p className="text-gray-500 font-medium">Termly progress reporting for the Schools Department.</p>
        </div>
        <div className="bg-[#1b5e20] text-white px-6 py-4 rounded-2xl shadow-xl shadow-[#1b5e20]/20 flex items-center gap-6">
           <div className="text-right">
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block">Scope</span>
             <span className="font-black italic flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-400" />{zone}</span>
           </div>
           <div className="w-px h-8 bg-white/20"></div>
           <div>
             <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block">Timeline</span>
             <span className="font-black flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-400" />{period} {year}</span>
           </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto bg-gray-100/50 p-1 mb-8 rounded-xl backdrop-blur-sm">
          <TabsTrigger value="general" className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1b5e20] font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 mr-2 hidden md:block" /> General Stats
          </TabsTrigger>
          <TabsTrigger value="trainings" className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1b5e20] font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 mr-2 hidden md:block" /> Trainings
          </TabsTrigger>
          <TabsTrigger value="programmes" className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1b5e20] font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4 mr-2 hidden md:block" /> Programmes
          </TabsTrigger>
          <TabsTrigger value="camps" className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1b5e20] font-bold text-xs uppercase tracking-wider">
            <Tent className="w-4 h-4 mr-2 hidden md:block" /> Holiday Camps
          </TabsTrigger>
          <TabsTrigger value="final" className="py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1b5e20] font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 mr-2 hidden md:block" /> Final Sections
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: General Stats */}
        <TabsContent value="general" className="animate-in fade-in-50 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm overflow-hidden h-full">
              <div className="h-1.5 bg-[#1b5e20]"></div>
              <CardHeader><CardTitle className={sectionLabel}>Missionary & Catchment Scope</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={statCardClass}>
                    <label className={statLabelClass}>Full-Time Missionaries</label>
                    <Input type="number" value={form.missionaries.fullTime || ""} onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      updateNested('missionaries', 'fullTime', val);
                      updateNested('missionaries', 'total', val + form.missionaries.associate);
                    }} className="h-12 text-2xl font-black border-none shadow-none p-0 focus:ring-0" />
                  </div>
                  <div className={statCardClass}>
                    <label className={statLabelClass}>Associate Missionaries</label>
                    <Input type="number" value={form.missionaries.associate || ""} onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        updateNested('missionaries', 'associate', val);
                        updateNested('missionaries', 'total', val + form.missionaries.fullTime);
                    }} className="h-12 text-2xl font-black border-none shadow-none p-0 focus:ring-0" />
                  </div>
                </div>
                <div className="bg-[#1b5e20]/5 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Active Staff</span>
                  <span className="text-3xl font-black text-[#1b5e20]">{form.missionaries.total}</span>
                </div>
                
                <div className="space-y-4 pt-4">
                   <Label className="text-[10px] font-black uppercase text-gray-400">Catchment Schools in Zone</Label>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <Label className="text-[10px] text-gray-400">Secondary</Label>
                        <Input type="number" value={form.catchment.secondary || ""} onChange={e => updateNested('catchment', 'secondary', parseInt(e.target.value) || 0)} className="h-8 border-none bg-transparent font-bold text-lg" />
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <Label className="text-[10px] text-gray-400">Primary</Label>
                        <Input type="number" value={form.catchment.primary || ""} onChange={e => updateNested('catchment', 'primary', parseInt(e.target.value) || 0)} className="h-8 border-none bg-transparent font-bold text-lg" />
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden h-full">
               <div className="h-1.5 bg-amber-500"></div>
               <CardHeader><CardTitle className={sectionLabel}>Schools Reached & Literature</CardTitle></CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase text-gray-400">Schools Currently Reached</Label>
                    <div className="grid grid-cols-2 gap-4">
                       <div className={statCardClass}>
                         <Label className={statLabelClass}>Secondary</Label>
                         <Input type="number" value={form.schools.secondaryReached || ""} onChange={e => updateNested('schools', 'secondaryReached', parseInt(e.target.value) || 0)} className="h-10 text-xl font-bold border-none shadow-none p-0 focus:ring-0" />
                       </div>
                       <div className={statCardClass}>
                          <Label className={statLabelClass}>Primary</Label>
                          <Input type="number" value={form.schools.primaryReached || ""} onChange={e => updateNested('schools', 'primaryReached', parseInt(e.target.value) || 0)} className="h-10 text-xl font-bold border-none shadow-none p-0 focus:ring-0" />
                       </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <Label className="text-[10px] font-black uppercase text-gray-400">Literature Distribution Logs</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {['guide', 'power', 'search', 'others'].map(lit => (
                        <div key={lit} className="flex flex-col p-3 border rounded-xl bg-gray-50/50">
                          <Label className="text-[10px] text-gray-400 capitalize mb-2">{lit === 'guide' ? 'Daily Guide' : lit === 'power' ? 'Daily Power' : lit === 'search' ? 'Search the Scripture' : 'Others'}</Label>
                          <Input type="number" value={(form.literature as any)[lit] || ""} onChange={e => updateNested('literature', lit, parseInt(e.target.value) || 0)} className="h-8 border-none bg-transparent font-black text-lg" />
                        </div>
                      ))}
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Trainings */}
        <TabsContent value="trainings" className="animate-in slide-in-from-right-4 duration-500">
           <Card className="border-none shadow-sm overflow-hidden">
             <div className="h-1.5 bg-blue-600"></div>
             <CardHeader><CardTitle className={sectionLabel}>Departmental Training Modules</CardTitle></CardHeader>
             <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-gray-100">
                  {Object.entries({
                    christianTeachers: "Christian Teacher's Seminar",
                    schoolVisitors: "School Visitors Training",
                    campOfficers: "Camp Officers Training",
                    vocational: "Vocational Training"
                  }).map(([key, label], idx) => (
                    <div key={key} className={`p-6 space-y-4 border-b md:border-b-0 ${idx < 3 ? 'md:border-r' : ''} border-gray-100 hover:bg-blue-50/20 transition-colors`}>
                       <Label className="text-[10px] font-black uppercase text-gray-400 tracking-wider h-8 block">{label}</Label>
                       <div className="space-y-4">
                          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                             <Label className="text-[9px] font-black text-blue-600 uppercase mb-1 block">Mobilization Count</Label>
                             <Input type="number" value={(form.trainings as any)[key].count || ""} onChange={e => {
                               const newVal = { ...(form.trainings as any)[key], count: parseInt(e.target.value) || 0 };
                               updateNested('trainings', key, newVal);
                             }} className="h-10 text-2xl font-black border-none shadow-none p-0 focus:ring-0" />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-[9px] text-gray-400">Venue(s) of Training</Label>
                             <Input value={(form.trainings as any)[key].venue} onChange={e => {
                               const newVal = { ...(form.trainings as any)[key], venue: e.target.value };
                               updateNested('trainings', key, newVal);
                             }} className="h-9 text-xs border-gray-200" placeholder="Location..." />
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* Tab 3: Programmes */}
        <TabsContent value="programmes" className="animate-in slide-in-from-right-4 duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries({
                schoolsRally: { label: "Schools Rally", color: "bg-purple-600" },
                primaryRally: { label: "Primary Rally", color: "bg-green-600" },
                schoolLeavers: { label: "School Leavers' Workshop", color: "bg-amber-600" },
                valentine: { label: "Valentine's Day", color: "bg-red-600" }
              }).map(([key, cfg]) => (
                <Card key={key} className="border-none shadow-md overflow-hidden hover:scale-105 transition-transform duration-300">
                  <div className={`h-1 ${cfg.color}`}></div>
                  <CardHeader className="pb-2"><span className="text-[11px] font-black uppercase text-gray-400">{cfg.label}</span></CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                           <span className="text-[9px] font-bold text-gray-400 block mb-1">Attendance</span>
                           <Input type="number" value={(form.programmes as any)[key].count || ""} onChange={e => {
                             const newVal = { ...(form.programmes as any)[key], count: parseInt(e.target.value) || 0 };
                             updateNested('programmes', key, newVal);
                           }} className="h-8 text-center font-black border-none bg-transparent" />
                        </div>
                        <div className="p-3 bg-[#1b5e20]/5 rounded-xl text-center">
                           <span className="text-[9px] font-bold text-[#1b5e20] block mb-1">Decision Cards</span>
                           <Input type="number" value={(form.programmes as any)[key].converts || ""} onChange={e => {
                             const newVal = { ...(form.programmes as any)[key], converts: parseInt(e.target.value) || 0 };
                             updateNested('programmes', key, newVal);
                           }} className="h-8 text-center font-black border-none bg-transparent text-[#1b5e20]" />
                        </div>
                     </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

        {/* Tab 4: Holiday Camps */}
        <TabsContent value="camps" className="animate-in slide-in-from-right-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['studentHoliday', 'childrenHoliday'].map(c => (
                <Card key={c} className="border-none shadow-sm overflow-hidden bg-white">
                  <div className={`h-1.5 ${c === 'studentHoliday' ? 'bg-orange-500' : 'bg-cyan-500'}`}></div>
                  <CardHeader><CardTitle className={sectionLabel}>{c === 'studentHoliday' ? 'Students Holiday Camp' : 'Children Holiday Camp'}</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className={statCardClass}>
                          <label className={statLabelClass}>{c === 'studentHoliday' ? 'Total Students' : 'Total Children'}</label>
                          <Input type="number" value={(form.camps as any)[c].count || ""} onChange={e => {
                            const newVal = { ...(form.camps as any)[c], count: parseInt(e.target.value) || 0 };
                            updateNested('camps', c, newVal);
                          }} className="h-10 text-xl font-bold border-none shadow-none p-0 focus:ring-0" />
                       </div>
                       <div className={statCardClass}>
                          <label className={statLabelClass}>Converts</label>
                          <Input type="number" value={(form.camps as any)[c].converts || ""} onChange={e => {
                             const newVal = { ...(form.camps as any)[c], converts: parseInt(e.target.value) || 0 };
                             updateNested('camps', c, newVal);
                          }} className="h-10 text-xl font-bold border-none shadow-none p-0 focus:ring-0" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold text-gray-400 uppercase">Camp Venue / Location</Label>
                       <Input value={(form.camps as any)[c].venue} onChange={e => {
                          const newVal = { ...(form.camps as any)[c], venue: e.target.value };
                          updateNested('camps', c, newVal);
                       }} className="h-12 bg-white border-gray-100 font-medium" placeholder="Location where camp was held..." />
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

        {/* Tab 5: Final Narrative */}
        <TabsContent value="final" className="animate-in slide-in-from-right-4 duration-500 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className={sectionLabel}><MessageSquare className="w-4 h-4" /> V. Plans & VI. Budget</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Textarea value={form.plans} onChange={e => setForm({...form, plans: e.target.value})} className="min-h-[150px] border-gray-100 bg-white" placeholder="Next term plans..." />
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-gray-400">Projected Budget Total (₦)</Label>
                    <Input type="number" value={form.budget || ""} onChange={e => setForm({...form, budget: parseFloat(e.target.value) || 0})} className="h-11 border-gray-100" placeholder="0.00" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader><CardTitle className={sectionLabel}><Users className="w-4 h-4" /> VII. Recommendation</CardTitle></CardHeader>
                <CardContent>
                  <Textarea value={form.recommendations} onChange={e => setForm({...form, recommendations: e.target.value})} className="min-h-[200px] border-gray-100 bg-white" placeholder="Your recommendations..." />
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>

      {/* Persistent Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-2xl flex justify-center z-[100]">
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting} 
          className="w-full max-w-xl h-14 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl shadow-[#1b5e20]/20 rounded-2xl uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
        >
          {isSubmitting ? "Syncing Record..." : <><Send className="mr-3" /> Submit Zonal Termly Report</>}
        </Button>
      </div>
    </div>
  );
}

export default function TermlyReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20 text-[#1b5e20]"><RefreshCw className="w-10 h-10 animate-spin" /></div>}>
      <TermlyReportContent />
    </Suspense>
  );
}

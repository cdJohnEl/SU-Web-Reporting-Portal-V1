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
import { useSmartMemory } from "@/lib/hooks/useSmartMemory";
import { 
  Send, Compass, Plus, Trash2, MapPin, Calendar, 
  Search, ClipboardCheck, Info, RefreshCw 
} from "lucide-react";

function TourReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { suggestions: targetSuggestions, saveMemory: saveTarget } = useSmartMemory("tour_targets");

  const [rows, setRows] = useState([
    { id: '1', date: "", target: "", purpose: "", findings: "", recommendations: "" }
  ]);

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), date: "", target: "", purpose: "", findings: "", recommendations: "" }]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: string, value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);
    
    // Save smart targets
    rows.forEach(r => saveTarget(r.target));

    try {
      const reportId = `tour_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Official Visitation & Tour Report",
        zone, year, period,
        data: { rows },
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Tour Report submitted successfully!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionLabel = "text-[10px] uppercase font-black tracking-[0.2em] text-[#1b5e20] mb-6 flex items-center gap-2";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-[1200px] mx-auto pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b pb-8 border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#1b5e20]">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Operational</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Official Visitation & Tour Report</h1>
          <p className="text-gray-500 font-medium text-sm text-balance">Log details of monitoring visitations, structural inspections, and support tours across the Area.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 px-6 py-4 rounded-2xl flex items-center gap-6">
           <div className="text-right">
             <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 block mb-1">Current Zone</span>
             <span className="font-black italic flex items-center gap-1.5 text-gray-900"><MapPin className="w-4 h-4 text-[#1b5e20]" />{zone}</span>
           </div>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-[#1b5e20]"></div>
        <CardHeader className="flex flex-row justify-between items-center bg-gray-50/50">
          <CardTitle className={sectionLabel}><ClipboardCheck className="w-4 h-4" /> Itinerary Log Matrix</CardTitle>
          <Button onClick={addRow} variant="outline" size="sm" className="bg-white border-[#1b5e20]/20 text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white font-bold h-8 text-[10px] uppercase tracking-widest px-4 rounded-full">
            <Plus className="w-3 h-3 mr-2" /> Add Itinerary
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 w-[140px]">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 w-[240px]">Target Group/Zone</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400">Purpose & Findings</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400">Recommendations</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="align-top py-4">
                      <Input 
                        type="date" 
                        value={row.date} 
                        onChange={e => updateRow(row.id, 'date', e.target.value)} 
                        className="h-9 border-none bg-gray-100/50 focus:bg-white text-xs font-bold"
                      />
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <div className="relative">
                        <Input 
                          value={row.target} 
                          onChange={e => updateRow(row.id, 'target', e.target.value)} 
                          list={`targets-${row.id}`}
                          className="h-9 border-none bg-[#1b5e20]/5 focus:bg-white text-xs font-bold placeholder:font-normal" 
                          placeholder="Name of group/school..." 
                        />
                        <datalist id={`targets-${row.id}`}>
                          {targetSuggestions.map(s => <option key={s} value={s} />)}
                        </datalist>
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-4 space-y-3">
                      <Input 
                        value={row.purpose} 
                        onChange={e => updateRow(row.id, 'purpose', e.target.value)} 
                        className="h-9 border-none bg-gray-100/30 focus:bg-white text-xs font-medium italic" 
                        placeholder="Purpose of visit (e.g. Revival inspection)" 
                      />
                      <Textarea 
                        value={row.findings} 
                        onChange={e => updateRow(row.id, 'findings', e.target.value)} 
                        className="min-h-[80px] border-none bg-gray-100/30 focus:bg-white text-xs resize-none" 
                        placeholder="State current situation / findings..." 
                      />
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <Textarea 
                        value={row.recommendations} 
                        onChange={e => updateRow(row.id, 'recommendations', e.target.value)} 
                        className="min-h-[128px] border-none bg-gray-100/30 focus:bg-white text-xs resize-none" 
                        placeholder="Action needed / Advice given..." 
                      />
                    </TableCell>
                    <TableCell className="align-top py-4">
                      <Button 
                        onClick={() => removeRow(row.id)} 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          {isSubmitting ? "Saving..." : "Save Tour Report"}
        </Button>
      </div>
    </div>
  );
}

export default function TourReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><RefreshCw className="w-10 h-10 animate-spin text-[#1b5e20]" /></div>}>
      <TourReportContent />
    </Suspense>
  );
}

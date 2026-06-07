"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useSmartMemory } from "@/lib/hooks/useSmartMemory";
import { 
  Send, Users2, Plus, Trash2, MapPin, 
  ClipboardList, DollarSign, RefreshCw, Award
} from "lucide-react";

interface TrainingRow {
  id: string;
  description: string;
  venue: string;
  brothers: number;
  sisters: number;
  total: number;
  cost: number;
}

function TrainingsMeetingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { suggestions: trainingTypeSuggestions, saveMemory: saveTrainingType } = useSmartMemory("training_types");
  const { suggestions: venueSuggestions, saveMemory: saveVenue } = useSmartMemory("venues");

  const makeRow = (): TrainingRow => ({
    id: Date.now().toString(),
    description: "", venue: "", brothers: 0, sisters: 0, total: 0, cost: 0
  });

  const [rows, setRows] = useState<TrainingRow[]>([makeRow()]);

  const updateRow = (id: string, field: keyof TrainingRow, value: any) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      // Auto-total brothers + sisters
      if (field === 'brothers' || field === 'sisters') {
        updated.total = (field === 'brothers' ? Number(value) : r.brothers) + (field === 'sisters' ? Number(value) : r.sisters);
      }
      return updated;
    }));
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) setRows(rows.filter(r => r.id !== id));
  };

  const grandTotal = {
    brothers: rows.reduce((s, r) => s + r.brothers, 0),
    sisters: rows.reduce((s, r) => s + r.sisters, 0),
    total: rows.reduce((s, r) => s + r.total, 0),
    cost: rows.reduce((s, r) => s + r.cost, 0),
  };

  const onSubmit = async () => {
    if (!auth.currentUser) return alert("Session expired.");
    setIsSubmitting(true);

    // Persist smart memory from all rows
    rows.forEach(r => {
      saveTrainingType(r.description);
      saveVenue(r.venue);
    });

    try {
      const reportId = `train_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Trainings, Seminars & Committee Meetings Report",
        zone, year, period,
        data: { rows, grandTotal },
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Training Report submitted successfully!");
      router.push("/dashboard");
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-[1200px] mx-auto pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b pb-8 border-gray-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#1b5e20] mb-1">
            <Award className="w-5 h-5" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-70">Operational</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Trainings, Seminars & Committee Meetings</h1>
          <p className="text-gray-500 font-medium text-sm">Track leadership development programs, staff training execution metrics, and attendance indicators.</p>
        </div>
        <div className="bg-[#1b5e20] text-white px-6 py-4 rounded-2xl shadow-xl shadow-[#1b5e20]/20 flex items-center gap-6 text-sm">
          <div><span className="block text-[9px] opacity-60 uppercase font-bold tracking-widest">Zone</span><span className="font-black">{zone}</span></div>
          <div className="w-px h-8 bg-white/20"></div>
          <div><span className="block text-[9px] opacity-60 uppercase font-bold tracking-widest">Period</span><span className="font-black">{period} {year}</span></div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Brothers", value: grandTotal.brothers, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Sisters", value: grandTotal.sisters, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Grand Total", value: grandTotal.total, color: "text-[#1b5e20]", bg: "bg-green-50" },
          { label: "Total Cost (₦)", value: `₦${grandTotal.cost.toLocaleString()}`, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 flex flex-col gap-1`}>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{s.label}</span>
            <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Matrix Table */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="h-1.5 bg-[#1b5e20]"></div>
        <CardHeader className="flex flex-row justify-between items-center bg-gray-50/30 border-b border-gray-100">
          <CardTitle className="text-[10px] uppercase font-black tracking-[0.2em] text-[#1b5e20] flex items-center gap-2">
            <ClipboardList className="w-4 h-4" /> Program Matrix Execution
          </CardTitle>
          <Button onClick={() => setRows(p => [...p, makeRow()])} variant="outline" size="sm" className="bg-white border-[#1b5e20]/20 text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white font-bold h-8 text-[10px] uppercase tracking-widest px-4 rounded-full transition-all">
            <Plus className="w-3 h-3 mr-2" /> Add Row
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/30 hover:bg-gray-50/30">
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 min-w-[220px]">Meeting / Training Description</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 min-w-[160px]">Venue</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 text-center w-20">Brothers</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 text-center w-20">Sisters</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 text-center w-20">Total</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-gray-400 text-center w-28">Cost (₦)</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="p-2">
                      <Input
                        value={row.description}
                        onChange={e => updateRow(row.id, 'description', e.target.value)}
                        list={`training-types-${row.id}`}
                        className="h-9 border-none bg-gray-100/50 focus:bg-white text-xs font-bold placeholder:font-normal"
                        placeholder="e.g. School Visitors Seminar"
                      />
                      <datalist id={`training-types-${row.id}`}>
                        {trainingTypeSuggestions.map(s => <option key={s} value={s} />)}
                      </datalist>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        value={row.venue}
                        onChange={e => updateRow(row.id, 'venue', e.target.value)}
                        list={`venues-${row.id}`}
                        className="h-9 border-none bg-[#1b5e20]/5 focus:bg-white text-xs font-medium placeholder:font-normal"
                        placeholder="Location..."
                      />
                      <datalist id={`venues-${row.id}`}>
                        {venueSuggestions.map(s => <option key={s} value={s} />)}
                      </datalist>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        value={row.brothers || ""}
                        onChange={e => updateRow(row.id, 'brothers', parseInt(e.target.value) || 0)}
                        className="h-9 text-center font-bold border-none bg-blue-50/50 focus:bg-white text-xs"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        value={row.sisters || ""}
                        onChange={e => updateRow(row.id, 'sisters', parseInt(e.target.value) || 0)}
                        className="h-9 text-center font-bold border-none bg-purple-50/50 focus:bg-white text-xs"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="h-9 flex items-center justify-center bg-green-50 rounded-md font-black text-[#1b5e20] text-sm">
                        {row.total}
                      </div>
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        value={row.cost || ""}
                        onChange={e => updateRow(row.id, 'cost', parseFloat(e.target.value) || 0)}
                        className="h-9 text-center font-bold border-none bg-amber-50/50 focus:bg-white text-xs text-amber-700"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Button
                        onClick={() => removeRow(row.id)}
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Grand Total Footer Row */}
                <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
                  <TableCell colSpan={2} className="p-3 text-white font-black text-[10px] uppercase tracking-widest">Grand Totals</TableCell>
                  <TableCell className="p-3 text-center text-blue-400 font-black text-lg">{grandTotal.brothers}</TableCell>
                  <TableCell className="p-3 text-center text-purple-400 font-black text-lg">{grandTotal.sisters}</TableCell>
                  <TableCell className="p-3 text-center text-green-400 font-black text-xl">{grandTotal.total}</TableCell>
                  <TableCell className="p-3 text-center text-amber-400 font-black">₦{grandTotal.cost.toLocaleString()}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Submit */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-2xl flex justify-center z-[100]">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full max-w-xl h-14 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-2xl shadow-[#1b5e20]/30 uppercase tracking-[0.2em] rounded-2xl"
        >
          {isSubmitting ? <RefreshCw className="mr-3 animate-spin" /> : <Send className="w-6 h-6 mr-3" />}
          {isSubmitting ? "Committing Records..." : "Commit Training Records"}
        </Button>
      </div>
    </div>
  );
}

export default function TrainingsMeetingsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center p-20"><RefreshCw className="w-10 h-10 animate-spin text-[#1b5e20]" /></div>}>
      <TrainingsMeetingsContent />
    </Suspense>
  );
}

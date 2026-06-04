"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, MapPin, Calendar, Trash2, Plus, Info } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

type TourRow = {
  date: string;
  target: string;
  purpose: string;
  findings: string;
  recommendations: string;
};

type TourFormValues = {
  tours: TourRow[];
};

function TourReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Metadata
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit } = useForm<TourFormValues>({
    defaultValues: {
      tours: [{ date: "", target: "", purpose: "", findings: "", recommendations: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tours"
  });

  const onSubmit = async (data: TourFormValues) => {
    if (!auth.currentUser) return alert("Session expired. Please log in again.");
    
    setIsSubmitting(true);
    try {
      const reportId = `tour_${auth.currentUser.uid}_${Date.now()}`;
      await setDoc(doc(db, "reports", reportId), {
        uid: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "User",
        reportType: "Zonal Tour Report",
        zone,
        year,
        period,
        data,
        status: "submitted",
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
      });
      alert("Tour report submitted successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      alert("Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const thClass = "text-[10px] uppercase font-bold text-gray-500 tracking-wider bg-gray-50/50 py-3 px-4";
  const tdClass = "py-2 px-1 border-gray-100 align-top";

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl mx-auto pb-24 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6 border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1b5e20] tracking-tight">Official Visitation & Tour Report</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">Log monitoring visitations, structural inspections, and support tours across the Area.</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="h-1 bg-[#1b5e20]"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1b5e20]/10 rounded-full flex items-center justify-center">
                <Info className="w-4 h-4 text-[#1b5e20]" />
              </div>
              <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Itinerary Log Details</h3>
            </div>
            <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => append({ date: "", target: "", purpose: "", findings: "", recommendations: "" })}
                className="text-xs font-bold border-[#1b5e20] text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white"
            >
              <Plus className="w-3 h-3 mr-1" /> Add Itinerary Row
            </Button>
          </CardHeader>
          <CardContent className="p-0 border-t border-gray-50">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={thClass}>Date</TableHead>
                    <TableHead className={thClass}>Target (School/Group)</TableHead>
                    <TableHead className={thClass}>Purpose</TableHead>
                    <TableHead className={thClass}>Findings</TableHead>
                    <TableHead className={thClass}>Recommendations</TableHead>
                    <TableHead className={thClass}></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id} className="hover:bg-gray-50/30 transition-colors">
                      <TableCell className={tdClass}>
                        <Input 
                            type="date" 
                            {...register(`tours.${index}.date`)} 
                            className="text-xs h-9 border-none bg-transparent focus:ring-0 px-2"
                        />
                      </TableCell>
                      <TableCell className={tdClass}>
                         <Input 
                            placeholder="Name of group..." 
                            {...register(`tours.${index}.target`)} 
                            className="text-xs h-9 border-none bg-transparent focus:ring-0 px-2"
                        />
                      </TableCell>
                      <TableCell className={tdClass}>
                         <Input 
                            placeholder="e.g. Monitoring" 
                            {...register(`tours.${index}.purpose`)} 
                            className="text-xs h-9 border-none bg-transparent focus:ring-0 px-2"
                        />
                      </TableCell>
                      <TableCell className="py-2 px-1 border-gray-100 min-w-[200px]">
                         <Textarea 
                            placeholder="Observations..." 
                            {...register(`tours.${index}.findings`)} 
                            className="text-[11px] min-h-[60px] border-none bg-transparent focus:ring-0 resize-none p-2"
                        />
                      </TableCell>
                      <TableCell className="py-2 px-1 border-gray-100 min-w-[200px]">
                         <Textarea 
                            placeholder="Actions needed..." 
                            {...register(`tours.${index}.recommendations`)} 
                            className="text-[11px] min-h-[60px] border-none bg-transparent focus:ring-0 resize-none p-2"
                        />
                      </TableCell>
                      <TableCell className="py-2 px-2 text-center align-middle">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => remove(index)}
                            className="text-red-300 hover:text-red-500 hover:bg-red-50"
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

        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
          <Button type="submit" disabled={isSubmitting} className="w-full max-w-md h-12 text-lg font-black bg-[#1b5e20] hover:bg-[#2e7d32] shadow-xl uppercase tracking-widest">
            {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5 mr-3" /> Save Tour Report</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function TourReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6">Loading tour report...</div>}>
      <TourReportContent />
    </Suspense>
  );
}

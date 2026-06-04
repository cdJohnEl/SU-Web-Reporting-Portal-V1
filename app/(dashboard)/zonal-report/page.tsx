"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Send, Calendar, MapPin, Users2, Activity } from "lucide-react";

function ZonalReportContent() {
  const searchParams = useSearchParams();
  
  // Metadata from initialization
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Zonal Progress Report submitted!");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">Zonal Progress Report</h1>
          <p className="text-muted-foreground text-sm font-medium">Scripture Union Nigeria, Eleme Area</p>
        </div>
        <div className="w-full md:w-auto text-left md:text-right">
          <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-lg inline-block w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-primary tracking-widest block mb-1 opacity-70">Report Context</span>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />{zone}</span>
              <span className="w-px h-3 bg-gray-300"></span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" />{period} {year}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Part A: Statistics */}
        <Card className="border-l-4 border-l-[#c39b3d]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#c39b3d]" />
              Part A: Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                "Pilgrims", "Youths", "Children", "Prim. Sch Fellowships", 
                "Sec. Sch Fellowships", "NBC Units", "School Visitors", 
                "Financial Members", "Married Members", "Missionaries"
              ].map(stat => (
                <div key={stat} className="space-y-2">
                  <Label className="text-[11px] uppercase font-bold text-muted-foreground">{stat}</Label>
                  <Input type="number" defaultValue="0" className="h-10" />
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <h4 className="text-sm font-bold text-primary uppercase border-b pb-2">Ministry Sales & Distribution</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Reading Notes */}
                <div className="space-y-3 p-4 bg-muted/10 rounded-lg border">
                  <Label className="font-bold text-su-green">Reading Notes</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-xs">Daily Guide</span><Input className="w-20" type="number" defaultValue={0} /></div>
                    <div className="flex justify-between items-center"><span className="text-xs">Daily Power</span><Input className="w-20" type="number" defaultValue={0} /></div>
                    <div className="flex justify-between items-center"><span className="text-xs">Daily Milk</span><Input className="w-20" type="number" defaultValue={0} /></div>
                  </div>
                </div>
                {/* Ministry Publications */}
                <div className="space-y-3 p-4 bg-muted/10 rounded-lg border">
                  <Label className="font-bold text-su-green">Ministry Publications</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-xs">SBSO/PBSO</span><Input className="w-20" type="number" defaultValue={0} /></div>
                    <div className="flex justify-between items-center"><span className="text-xs">SEARCH</span><Input className="w-20" type="number" defaultValue={0} /></div>
                    <div className="flex justify-between items-center"><span className="text-xs">Follow Up</span><Input className="w-20" type="number" defaultValue={0} /></div>
                  </div>
                </div>
                {/* Vital Events */}
                <div className="space-y-3 p-4 bg-muted/10 rounded-lg border">
                  <Label className="font-bold text-su-green">Vital Events</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-xs">Births</span><Input className="w-20" type="number" defaultValue={0} /></div>
                    <div className="flex justify-between items-center"><span className="text-xs">Marriages</span><Input className="w-20" type="number" defaultValue={0} /></div>
                    <div className="flex justify-between items-center"><span className="text-xs">Deaths</span><Input className="w-20" type="number" defaultValue={0} /></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Part B: Programmes Held */}
        <Card className="border-l-4 border-l-su-green">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users2 className="w-5 h-5 text-su-green" />
              Part B: Programmes Held
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-10">
            {/* General/Adult */}
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 p-2 bg-muted/30 rounded">General & Adult Ministry</h4>
              <div className="overflow-x-auto -mx-2 md:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px] text-[10px] uppercase font-bold">Programme</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold">Attendance</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold">Decisions</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold">Cost (₦)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Easter Pilgrims' Conf.", "SU Week of Sacrifice", "Prayer & Gift Day", "Mission Week"].map(prog => (
                      <TableRow key={prog}>
                        <TableCell className="font-bold text-[11px]">{prog}</TableCell>
                        <TableCell><Input className="h-9 text-xs" /></TableCell>
                        <TableCell><Input className="h-9 text-xs" type="number" /></TableCell>
                        <TableCell><Input className="h-9 text-xs" type="number" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Schools/Youth */}
            <div>
              <h4 className="text-sm font-bold text-primary mb-4 p-2 bg-muted/30 rounded">Schools & Youth Ministry</h4>
              <div className="overflow-x-auto -mx-2 md:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px] text-[10px] uppercase font-bold">Programme</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold">Attendance</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold">Decisions</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold">Cost (₦)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Zonal Schools' Rally", "Student Leaders Training", "BRP (Bible Reading)", "Valentine's Day"].map(prog => (
                      <TableRow key={prog}>
                        <TableCell className="font-bold text-[11px]">{prog}</TableCell>
                        <TableCell><Input className="h-9 text-xs" /></TableCell>
                        <TableCell><Input className="h-9 text-xs" type="number" /></TableCell>
                        <TableCell><Input className="h-9 text-xs" type="number" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Part C: Challenges */}
        <Card className="bg-muted/10">
          <CardHeader>
            <CardTitle className="text-xl">Part C: Challenges & Other Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              rows={6} 
              placeholder="Enter challenges encountered and any other notable events here..." 
              className="bg-white"
            />
          </CardContent>
        </Card>

        {/* Action Button */}
        {/* Action Button */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg flex justify-center z-50">
           <Button type="submit" className="w-full max-w-md h-12 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl uppercase tracking-widest" disabled={isSubmitting}>
             {isSubmitting ? "Submitting..." : (
               <>
                 <Send className="w-5 h-5 mr-3" /> Submit Final Zonal Report
               </>
             )}
           </Button>
        </div>
      </form>
    </div>
  );
}

export default function ZonalReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6">Loading zonal report...</div>}>
      <ZonalReportContent />
    </Suspense>
  );
}

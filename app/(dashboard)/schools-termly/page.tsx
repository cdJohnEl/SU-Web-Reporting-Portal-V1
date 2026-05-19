"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Send, Calendar, MapPin, Building2, User } from "lucide-react";

function SchoolsTermlyReportContent() {
  const searchParams = useSearchParams();
  
  // Metadata from initialization
  const zone = searchParams.get("zone") || "Not Specified";
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const period = searchParams.get("period") || "Not Specified";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      alert("Report submitted successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Info */}
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                Zonal Termly Report: Schools Dept
              </h1>
              <p className="text-muted-foreground">Scripture Union Nigeria, Eleme Area</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm bg-muted/50 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold">{zone} Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-semibold">{period} {year}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="font-semibold italic">Zonal Schools Coordinator</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/30 border">
            <TabsTrigger value="general" className="py-2.5">General Stats</TabsTrigger>
            <TabsTrigger value="trainings" className="py-2.5">Trainings</TabsTrigger>
            <TabsTrigger value="programmes" className="py-2.5">Programmes</TabsTrigger>
            <TabsTrigger value="camps" className="py-2.5">Holiday Camps</TabsTrigger>
            <TabsTrigger value="final" className="py-2.5">Final Sections</TabsTrigger>
          </TabsList>

          <Card className="mt-4 shadow-sm border-none bg-transparent">
            {/* General Stats Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-primary uppercase tracking-tight">I. Preamble & II. General Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="preamble">Preamble</Label>
                    <Textarea id="preamble" rows={3} placeholder="Brief overview of the term..." />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>No. of Missionaries</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Schools (Primary)</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Schools (Secondary)</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Total Group Membership</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                    </div>
                    
                    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>No. of School Visitors</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>No. of Schools Visited</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>New Groups Opened</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>SBSO Distributed</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4 border-b pb-2">Follow Up Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Manuals Sold</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Converts in Follow-Up</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Completed Follow-Up</Label>
                        <Input type="number" defaultValue="0" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trainings Tab */}
            <TabsContent value="trainings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-primary uppercase">III. Student Leaders Training</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Period Held</Label><Input type="text" /></div>
                    <div className="space-y-2"><Label>No. of Schools</Label><Input type="number" defaultValue="0" /></div>
                    <div className="space-y-2"><Label>Attendance</Label><Input type="number" defaultValue="0" /></div>
                    <div className="space-y-2"><Label>New Leaders Trained</Label><Input type="number" defaultValue="0" /></div>
                    <div className="space-y-2"><Label>Total Cost (₦)</Label><Input type="number" defaultValue="0" /></div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Christian Teacher's Seminar</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 items-center gap-2"><Label>Attendance</Label><Input type="number" defaultValue="0" /></div>
                      <div className="grid grid-cols-2 items-center gap-2"><Label>No. of Schools</Label><Input type="number" defaultValue="0" /></div>
                      <div className="grid grid-cols-2 items-center gap-2"><Label>Total Cost</Label><Input type="number" defaultValue="0" /></div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-base">School Visitors Training</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 items-center gap-2"><Label>Visitors Trained</Label><Input type="number" defaultValue="0" /></div>
                      <div className="grid grid-cols-2 items-center gap-2"><Label>New Volunteers</Label><Input type="number" defaultValue="0" /></div>
                      <div className="grid grid-cols-2 items-center gap-2"><Label>Total Cost</Label><Input type="number" defaultValue="0" /></div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Programmes Tab */}
            <TabsContent value="programmes">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-primary uppercase">IV. Programmes Held</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead>Programme</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>Schools</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Converts</TableHead>
                          <TableHead>Cost (₦)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {["Schools Rally", "Primary Rally", "Leavers Workshop", "Valentine's Day"].map((prog) => (
                          <TableRow key={prog}>
                            <TableCell className="font-medium">{prog}</TableCell>
                            <TableCell><Input className="w-20" type="number" defaultValue={0} /></TableCell>
                            <TableCell><Input className="w-20" type="number" defaultValue={0} /></TableCell>
                            <TableCell><Input className="w-20" type="number" defaultValue={0} /></TableCell>
                            <TableCell><Input className="w-20" type="number" defaultValue={0} /></TableCell>
                            <TableCell><Input className="w-28" type="number" defaultValue={0} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Holiday Camps Tab */}
            <TabsContent value="camps">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-t-4 border-t-su-green">
                  <CardHeader><CardTitle className="text-lg underline underline-offset-4">Students Holiday Camp</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Total Students</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>Senior Students</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>Junior Students</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>School Leavers</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>Converts</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>Expenditure</Label><Input type="number" defaultValue={0} /></div>
                  </CardContent>
                </Card>
                <Card className="border-t-4 border-t-[#c39b3d]">
                  <CardHeader><CardTitle className="text-lg underline underline-offset-4">Children Holiday Camp</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Total Children</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>Teachers</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>Converts</Label><Input type="number" defaultValue={0} /></div>
                    <div className="space-y-2"><Label>Total Cost</Label><Input type="number" defaultValue={0} /></div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Final Tab */}
            <TabsContent value="final">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg text-primary uppercase">V. Plans & VI. Budget</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea rows={6} placeholder="Next term plans..." />
                    <div className="flex items-center gap-3 bg-muted/30 p-4 rounded-lg">
                      <Label className="font-bold">Projected Budget Total:</Label>
                      <Input type="number" className="max-w-[200px]" defaultValue="0" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-lg text-primary uppercase">VII. Recommendation</CardTitle></CardHeader>
                  <CardContent>
                    <Textarea rows={10} placeholder="Your recommendations..." />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Card>
        </Tabs>

        {/* Form Actions */}
        <div className="sticky bottom-6 left-0 right-0 pt-6 flex justify-end gap-3 pointer-events-none">
          <Button type="button" variant="outline" className="h-12 px-6 shadow-lg bg-white pointer-events-auto">
            <Save className="w-4 h-4 mr-2" /> Save Progress
          </Button>
          <Button type="submit" className="h-12 px-8 shadow-lg pointer-events-auto" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : (
              <>
                <Send className="w-4 h-4 mr-2" /> Submit Zonal Termly Report
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function SchoolsTermlyReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-6">Loading report form...</div>}>
      <SchoolsTermlyReportContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Info } from "lucide-react";

function InitializeReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  
  // State for form
  const [reportType, setReportType] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [period, setPeriod] = useState("");
  const [zone, setZone] = useState("");

  useEffect(() => {
    if (type === "zonal") setReportType("Zonal Progress Report");
    else if (type === "schools-termly") setReportType("Schools Termly Report");
    else setReportType("Schools & Youth Report");
  }, [type]);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    
    const context: Record<string, string> = {
      type: type || "unknown",
      reportType,
      year,
      period,
      zone
    };
    
    const query = new URLSearchParams(context).toString();
    
    if (type === "zonal") {
      router.push(`/zonal-report?${query}`);
    } else if (type === "schools-termly") {
      router.push(`/schools-termly?${query}`);
    } else {
      router.push(`/schools-youth?${query}`);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg border-t-4 border-t-primary shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Initialize Report</CardTitle>
          <CardDescription>
            Confirm the details below to proceed to the secure form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProceed} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Input 
                  id="reportType" 
                  value={reportType} 
                  readOnly 
                  className="bg-muted cursor-not-allowed font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Reporting Year</Label>
                  <Select value={year} onValueChange={(val) => setYear(val || "")}>
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Reporting Period</Label>
                  <Select value={period} onValueChange={(val) => setPeriod(val || "")} required>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select Month/Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January (Monthly)</SelectItem>
                      <SelectItem value="February">February (Monthly)</SelectItem>
                      <SelectItem value="March">March (Monthly)</SelectItem>
                      <SelectItem value="April">April (Monthly)</SelectItem>
                      <SelectItem value="1st Term">1st Term (Termly)</SelectItem>
                      <SelectItem value="2nd Term">2nd Term (Termly)</SelectItem>
                      <SelectItem value="3rd Term">3rd Term (Termly)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Select Zone</Label>
                <Select value={zone} onValueChange={(val) => setZone(val || "")} required>
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Choose Zone..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nchia">Nchia</SelectItem>
                    <SelectItem value="Gokana">Gokana</SelectItem>
                    <SelectItem value="Ogoni">Ogoni</SelectItem>
                    <SelectItem value="Oyigbo">Oyigbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-md flex gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Selecting a Zone and Period will automatically sync data if another office has already entered related information for this period.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button type="submit" className="w-full h-11 text-base font-semibold group">
                Proceed to Report Form 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-11 text-base font-medium"
                onClick={() => router.back()}
              >
                Go Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InitializeReportPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading initialization...</div>}>
      <InitializeReportContent />
    </Suspense>
  );
}

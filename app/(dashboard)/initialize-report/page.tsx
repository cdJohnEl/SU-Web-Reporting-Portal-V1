"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Info } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useSmartMemory } from "@/lib/hooks/useSmartMemory";

const ZONES = [
  "Nchia",
  "Gokana",
  "Oyigbo",
  "Afam",
  "Andoni/Opobo",
  "Odido/Tai",
  "Etche",
  "Omuma",
  "Bori",
];

function InitializeReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [reportType, setReportType] = useState<string>("");
  const [reporter, setReporter] = useState<string>("");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [period, setPeriod] = useState<string>("");
  const [zone, setZone] = useState<string>("");
  const [group, setGroup] = useState<string>("");

  const { suggestions: groupSuggestions, saveMemory: saveGroup } = useSmartMemory("groups");

  useEffect(() => {
    const typeNames: Record<string, string> = {
      "zonal": "Zonal Progress Report",
      "schools-termly": "Schools Termly Report",
      "aids-for-life": "Aids for Life Week Report",
      "leadership-training": "Leadership Training Report",
      "valentine-program": "Valentine Program Outreach",
      "valentine-report": "Valentine Program Outreach",
      "student-rally": "Student Rally Statistics",
      "tour": "Zonal Tour Report",
      "tour-report": "Official Visitation & Tour Report",
      "trainings-meetings": "Trainings, Seminars & Meetings Report",
      "family-week": "National Family Week Report",
      "children-day": "Children's Day Celebration Report",
      "missionary": "Missionary & Permanent Schools' Visitor Report",
      "aids-for-life-report": "Aids for Life Week Report",
      "leadership-training-report": "Student Leadership Training Report",
      "student-camp": "Student Long Vacation Camp Report",
      "youth-summit": "Youth Empowerment Summit Report"
    };
    setReportType(typeNames[type || ""] || "General Ministry Report");
  }, [type]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setReporter(user.displayName || user.email || "Authenticated User");
      } else {
        setReporter("Guest Reporter");
      }
    });
    return () => unsub();
  }, []);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();

    saveGroup(group);

    const context: Record<string, string> = {
      type: type || "unknown",
      reportType,
      reporter,
      year,
      period,
      zone,
      group
    };

    const query = new URLSearchParams(context).toString();

    const routes: Record<string, string> = {
      "zonal": "/zonal-report",
      "schools-termly": "/schools-termly",
      "aids-for-life": "/aids-for-life-report",
      "aids-for-life-report": "/aids-for-life-report",
      "leadership-training": "/leadership-training-report",
      "leadership-training-report": "/leadership-training-report",
      "valentine-program": "/valentine-report",
      "valentine-report": "/valentine-report",
      "student-rally": "/student-rally-report",
      "tour": "/tour-report",
      "tour-report": "/tour-report",
      "trainings-meetings": "/trainings-meetings",
      "family-week": "/family-week-report",
      "children-day": "/children-day-report",
      "missionary": "/missionary-report",
      "student-camp": "/camping-report",
      "youth-summit": "/leadership-training-report"
    };

    const targetRoute = routes[type || ""] || "/schools-youth";
    router.push(`${targetRoute}?${query}`);
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
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Input
                    id="reportType"
                    value={reportType}
                    readOnly
                    className="bg-muted cursor-not-allowed font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reporter">Office / Reporter</Label>
                  <Input
                    id="reporter"
                    value={reporter}
                    readOnly
                    className="bg-muted cursor-not-allowed font-medium"
                    placeholder="Auto-populating reporter profile..."
                  />
                </div>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Reporting Month/Term</Label>
                  <Select value={period} onValueChange={(val) => setPeriod(val || "")} required>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select Month/Term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Term (Termly)">1st Term (Termly)</SelectItem>
                      <SelectItem value="2nd Term (Termly)">2nd Term (Termly)</SelectItem>
                      <SelectItem value="3rd Term (Termly)">3rd Term (Termly)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zone">Select Zone</Label>
                  <Select value={zone} onValueChange={(val) => setZone(val || "")} required>
                    <SelectTrigger id="zone">
                      <SelectValue placeholder="Choose Zone..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ZONES.map((z) => (
                        <SelectItem key={z} value={z}>{z}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pr-1">
                    <Label htmlFor="group">Select Group Context</Label>
                    {groupSuggestions.length > 0 && (
                      <span className="text-[9px] font-black text-[#1b5e20] uppercase bg-green-50 px-2 py-0.5 rounded-full">
                        Smart Recalls On
                      </span>
                    )}
                  </div>
                  <Input
                    id="group"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    list="saved-groups"
                    required
                    placeholder="Type or select Group designation..."
                    className="font-medium"
                  />
                  <datalist id="saved-groups">
                    {groupSuggestions.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-md flex gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Database Note:</strong> Cross-office operational sync engine triggers automatically based on matching Zone, Group, and Period configurations.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Button type="submit" className="w-full h-11 text-base font-semibold group">
                Proceed to Verification
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

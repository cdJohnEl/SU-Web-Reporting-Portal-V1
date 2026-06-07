"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  GraduationCap, Tent, Users, Heart, HeartHandshake, 
  Zap, School, TrendingUp, ArrowRight, ClipboardCheck 
} from "lucide-react";

const subsidiaries = [
  {
    title: "Student Leadership Training Day/Camp (LTD/LTC)",
    description: "Record training sessions for SU fellowship executives and leadership campsite structural statistics summary details.",
    icon: GraduationCap,
    href: "/initialize-report?type=leadership-training-report",
    color: "bg-blue-500",
    light: "bg-blue-50"
  },
  {
    title: "Student Long Vacation Camp",
    description: "Statistics and spiritual outcomes of the annual holiday camp.",
    icon: Tent,
    href: "/initialize-report?type=student-camp",
    color: "bg-orange-500",
    light: "bg-orange-50"
  },
  {
    title: "Zonal Student Rallies",
    description: "Log attendance and decisions from zonal student rallies.",
    icon: Users,
    href: "/initialize-report?type=student-rally",
    color: "bg-purple-500",
    light: "bg-purple-50"
  },
  {
    title: "Valentine Programme Outreaches",
    description: "Report on Valentine's Day evangelical outreach operations within schools.",
    icon: Heart,
    href: "/initialize-report?type=valentine-report",
    color: "bg-rose-500",
    light: "bg-rose-50"
  },
  {
    title: "Aids for Life Week",
    description: "Report on the Aids for Life Week of Emphasis awareness and teaching records.",
    icon: HeartHandshake,
    href: "/initialize-report?type=aids-for-life-report",
    color: "bg-cyan-500",
    light: "bg-cyan-50"
  },
  {
    title: "Youth Empowerment Summit",
    description: "Report on skills, empowerment, and youth participation.",
    icon: Zap,
    href: "/initialize-report?type=youth-summit",
    color: "bg-amber-500",
    light: "bg-amber-50",
    highlight: true
  }
];

export default function SchoolsYouthPage() {
  return (
    <div className="flex-1 p-4 md:p-6 space-y-8 max-w-[1200px] mx-auto pb-20">
      {/* Header Section */}
      <div className="space-y-2 border-b pb-8 border-gray-100">
        <div className="flex items-center gap-2 text-[#1b5e20] mb-1">
          <School className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-widest opacity-70 italic">Ministry Vertical</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Schools and Youth Department</h1>
        <p className="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
          Manage and record reports for all school-based and youth activities.
        </p>
      </div>

      {/* High-Level Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Schools", value: "84", icon: School, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active Fellowships", value: "62", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Teachers Reached", value: "215", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" }
        ].map((stat, i) => (
          <Card key={stat.label} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
             <CardContent className="p-6 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.label}</p>
                   <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                   <stat.icon className="w-8 h-8" />
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-3">
          <ClipboardCheck className="w-4 h-4" /> Reporting Subsidiaries
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subsidiaries.map((sub) => (
            <Link key={sub.title} href={sub.href} className="group">
              <Card className={`h-full border-none shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 overflow-hidden ${sub.highlight ? 'ring-2 ring-amber-400 ring-offset-4' : ''}`}>
                <div className={`h-1.5 ${sub.color}`}></div>
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 ${sub.light} ${sub.color.replace('bg-', 'text-')} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <sub.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-black group-hover:text-[#1b5e20] transition-colors">{sub.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {sub.description}
                  </p>
                  <div className="pt-4 flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#1b5e20] transition-colors">
                    Open Form <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

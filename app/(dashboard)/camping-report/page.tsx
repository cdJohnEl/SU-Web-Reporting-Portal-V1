"use client";

import { useEffect, useState } from "react";
import { Tent, Bird, Flame, Palette, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchDeptStats } from "@/lib/stats";

export default function CampingReportPage() {
  const [statsData, setStatsData] = useState({ count: 0, impact: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchDeptStats("Missionary Report");
      setStatsData(data);
      setLoading(false);
    };
    load();
  }, []);

  const reports = [
    {
      icon: <Tent className="text-[#1b5e20]" size={24} />,
      title: "Student Leadership Training Camp",
      dept: "Student & Youth",
      focus: "Executive training and spiritual development for school leaders.",
      link: "/initialize-report?type=leadership-training-report",
    },
    {
      icon: <Bird className="text-[#1b5e20]" size={24} />,
      title: "Easter Pilgrims' Conference",
      dept: "Pilgrims",
      focus: "Annual spiritual retreat for adult members and families.",
      link: "/initialize-report?type=easter-conference",
    },
    {
      icon: <Flame className="text-[#1b5e20]" size={24} />,
      title: "Student Long Vacation Camp",
      dept: "Student & Youth",
      focus: "Major annual outreach and discipleship for secondary students.",
      link: "/initialize-report?type=student-camp",
    },
    {
      icon: <Palette className="text-[#1b5e20]" size={24} />,
      title: "Children's Long Vacation Camp",
      dept: "Children",
      focus: "Foundational spiritual training for primary-aged children.",
      link: "/initialize-report?type=children-camp",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-1 mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#1b5e20]">Area Camping Portfolio</h2>
        <p className="text-gray-500 text-xs md:text-sm font-medium">Centralized view of all residential camps and conferences across Eleme Area.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
         <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border-l-4 border-[#1b5e20]">
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Total Camps Held</h3>
            {loading ? <Loader2 className="animate-spin text-gray-300 mt-2" size={20} /> : <div className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1 md:mt-2">{statsData.count}</div>}
         </div>
         <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border-l-4 border-[#ffca28]">
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spiritual Impact</h3>
            {loading ? <Loader2 className="animate-spin text-gray-300 mt-2" size={20} /> : <div className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1 md:mt-2">{statsData.impact.toLocaleString()}</div>}
         </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 flex gap-4 items-start">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-gray-700 leading-relaxed font-medium">
          <strong>System Note:</strong> Camping reports are integrated with their respective departments. Clicking "Go to Form" will route you to the departmental reporting unit to ensure data consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {reports.map((report, i) => (
          <div key={i} className="p-5 md:p-6 rounded-lg shadow-sm border transition-shadow relative overflow-hidden group flex flex-col h-full bg-white text-gray-900 border-gray-100 hover:shadow-md">
            <div className="mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border shrink-0 bg-[#fffdf7] border-gray-100">
              {report.icon}
            </div>
            <h4 className="font-bold mb-1 text-sm md:text-base leading-snug text-gray-900">{report.title}</h4>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-gray-400">
              Department: <span className="text-[#1b5e20]">{report.dept}</span>
            </div>
            <p className="text-xs md:text-sm mb-4 md:mb-6 flex-grow text-gray-600">Focus: {report.focus}</p>
            <Link href={report.link} className="w-full py-2 border-2 font-bold rounded transition-colors text-xs md:text-sm text-center border-[#1b5e20] text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white">
              Go to {report.dept.split(' ')[0]} Dept Form
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

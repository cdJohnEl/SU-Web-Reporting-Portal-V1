"use client";

import { useEffect, useState } from "react";
import { Tent, Bird, Flame, Palette, Rocket, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetchDeptStats } from "@/lib/stats";

export default function CampingReportPage() {
  const [statsData, setStatsData] = useState({ count: 0, impact: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchDeptStats("Missionary Report"); // Proxy for impact
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
      link: "/schools-youth",
    },
    {
      icon: <Bird className="text-[#1b5e20]" size={24} />,
      title: "Easter Pilgrims' Conference",
      dept: "Pilgrims",
      focus: "Annual spiritual retreat for adult members and families.",
      link: "/pilgrims-report",
    },
    {
      icon: <Flame className="text-[#1b5e20]" size={24} />,
      title: "Student Long Vacation Camp",
      dept: "Student & Youth",
      focus: "Major annual outreach and discipleship for secondary students.",
      link: "/schools-youth",
    },
    {
      icon: <Palette className="text-[#1b5e20]" size={24} />,
      title: "Children's Long Vacation Camp",
      dept: "Children",
      focus: "Foundational spiritual training for primary-aged children.",
      link: "/children-report",
    },
    {
      icon: <Rocket className="text-white" size={24} />,
      title: "Youth Empowerment Summit Camp",
      dept: "Student & Youth",
      focus: "Skills acquisition, empowerment, and leadership for youth.",
      link: "/schools-youth",
      highlight: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b5e20]">Area Camping Portfolio</h2>
        <p className="text-gray-600">Centralized view of all residential camps and conferences across Eleme Area.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#1b5e20]">
            <h3 className="text-sm font-bold text-gray-500 uppercase">Total Camps Held</h3>
            {loading ? <Loader2 className="animate-spin mt-2" /> : <div className="text-3xl font-bold">{statsData.count}</div>}
         </div>
         <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#ffca28]">
            <h3 className="text-sm font-bold text-gray-500 uppercase">Total Spiritual Impact</h3>
            {loading ? <Loader2 className="animate-spin mt-2" /> : <div className="text-3xl font-bold">{statsData.impact.toLocaleString()}</div>}
         </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 flex gap-4 items-start">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-gray-700 leading-relaxed font-medium">
          <strong>System Note:</strong> Camping reports are integrated with their respective departments. Clicking "Go to Form" will route you to the departmental reporting unit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <div key={i} className={`p-6 rounded-lg shadow-sm border transition-shadow relative overflow-hidden group flex flex-col h-full ${report.highlight ? 'bg-[#1b5e20] text-white border-[#1b5e20]' : 'bg-white text-gray-900 border-gray-100 hover:shadow-md'}`}>
            <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${report.highlight ? 'bg-white/10 border-white/20' : 'bg-[#fffdf7] border-gray-100'}`}>
              {report.icon}
            </div>
            <h4 className={`font-bold mb-1 ${report.highlight ? 'text-white' : 'text-gray-900'}`}>{report.title}</h4>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${report.highlight ? 'text-white/70' : 'text-gray-400'}`}>
              Department: <span className={report.highlight ? 'text-[#ffca28]' : 'text-[#1b5e20]'}>{report.dept}</span>
            </p>
            <p className={`text-sm mb-6 flex-grow ${report.highlight ? 'text-gray-200' : 'text-gray-600'}`}>{report.focus}</p>
            <Link href={report.link} className={`w-full py-2.5 border-2 font-bold rounded transition-colors text-sm text-center ${report.highlight ? 'border-[#ffca28] bg-[#ffca28] text-[#1b5e20] hover:bg-white hover:border-white' : 'border-[#1b5e20] text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white'}`}>
              Go to {report.dept.split(' ')[0]} Dept Form
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

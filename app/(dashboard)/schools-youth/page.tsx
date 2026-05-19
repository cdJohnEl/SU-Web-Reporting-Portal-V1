"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Tent, Megaphone, Zap, Paperclip, Loader2 } from "lucide-react";
import { fetchDeptStats } from "@/lib/stats";

export default function SchoolsYouthPage() {
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

  const stats = [
    { label: "Schools Reached", value: statsData.count, color: "border-[#1b5e20]" },
    { label: "Fellowship Impact", value: statsData.impact, color: "border-[#ffca28]" },
    { label: "Zonal Coverage", value: "85%", color: "border-blue-500" },
  ];

  const subsidiaries = [
    {
      icon: <GraduationCap className="text-[#1b5e20]" size={24} />,
      title: "Student Leadership Training Day (LTD)",
      description: "Record training sessions for SU fellowship executives.",
      action: "Open Form",
    },
    {
      icon: <GraduationCap className="text-[#1b5e20]" size={24} />,
      title: "Student Leadership Training Camp (LTC)",
      description: "Record training sessions for SU fellowship executives.",
      action: "Open Form",
    },
    {
      icon: <Tent className="text-[#1b5e20]" size={24} />,
      title: "Student Long Vacation Camp",
      description: "Statistics and spiritual outcomes of the annual holiday camp.",
      action: "Open Form",
    },
    {
      icon: <Megaphone className="text-[#1b5e20]" size={24} />,
      title: "Student Rally",
      description: "Log attendance and decisions from zonal student rallies.",
      action: "Open Form",
    },
    {
      icon: <Megaphone className="text-[#1b5e20]" size={24} />,
      title: "Valentine Programme",
      description: "Report on Valentine's Day participation.",
      action: "Open Form",
    },
    {
      icon: <Zap className="text-[#1b5e20]" size={24} />,
      title: "Youth Empowerment Summit",
      description: "Report on skills, empowerment, and youth participation.",
      action: "Open Form",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b5e20]">Schools and Youth Department</h2>
        <p className="text-gray-600">Manage and record reports for all school-based and youth activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${stat.color} transition-all hover:shadow-md`}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</h3>
            {loading ? (
              <Loader2 className="animate-spin text-gray-300 mt-2" size={20} />
            ) : (
              <div className="text-3xl font-extrabold text-gray-900 mt-2">{stat.value}</div>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-[#ffca28] pb-2 inline-block">Reporting Subsidiaries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subsidiaries.map((sub, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="mb-4 bg-[#fffdf7] w-12 h-12 rounded-full flex items-center justify-center border border-gray-100">
                {sub.icon}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{sub.title}</h4>
              <p className="text-sm text-gray-600 mb-6">{sub.description}</p>
              <button className="w-full py-2 border-2 border-[#1b5e20] text-[#1b5e20] font-bold rounded hover:bg-[#1b5e20] hover:text-white transition-colors text-sm">
                {sub.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#e3f2fd] p-6 rounded-lg border-l-4 border-[#2196f3] flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-[#1565c0] flex items-center gap-2">
            <Paperclip size={20} /> Required Appendices
          </h4>
          <p className="text-sm text-gray-700 mt-1">Remember to upload attendance sheets and photo summaries for each programme.</p>
        </div>
        <button className="text-[#1565c0] font-bold hover:underline whitespace-nowrap">View Upload Manager →</button>
      </div>
    </div>
  );
}

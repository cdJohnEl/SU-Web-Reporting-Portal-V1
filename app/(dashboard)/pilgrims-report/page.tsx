"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Church, Gift, Globe, Loader2 } from "lucide-react";
import { fetchDeptStats } from "@/lib/stats";
import { useRouter } from "next/navigation";

export default function PilgrimsReportPage() {
  const [statsData, setStatsData] = useState({ count: 0, impact: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const data = await fetchDeptStats("Pilgrims Report");
      setStatsData(data);
      setLoading(false);
    };
    load();
  }, []);

  const stats = [
    { label: "Active Pilgrims", value: 485, color: "border-[#1b5e20]" },
    { label: "Total Groups", value: 14, color: "border-blue-500" },
    { label: "Upcoming Program", value: "Mission Week", color: "border-[#ffca28]" },
  ];

  const subsidiaries = [
    {
      icon: <TrendingUp className="text-white" size={24} />,
      title: "Numerical Statistics",
      description: "Detailed breakdown of membership, new converts, and group growth.",
      action: "Update Numbers",
      highlight: true,
      type: "zonal-progress"
    },
    {
      icon: <Users className="text-[#1b5e20]" size={24} />,
      title: "National Family Week",
      description: "Reporting on family-focused seminars and domestic fellowship events.",
      action: "Open Form",
      type: "family-week"
    },
    {
      icon: <Church className="text-[#1b5e20]" size={24} />,
      title: "National Week of Sacrifice",
      description: "Tracking participation and sacrificial giving across all zones.",
      action: "Open Form",
      type: "week-sacrifice"
    },
    {
      icon: <Church className="text-[#1b5e20]" size={24} />,
      title: "Easter Pilgrims' Conference",
      description: "Report the annual Easter Pilgrims' and Mission Awareness Conference.",
      action: "Open Form",
      type: "easter-conference"
    },
    {
      icon: <Gift className="text-[#1b5e20]" size={24} />,
      title: "Prayer and Gift Day",
      description: "Logging special gifts and prayer points from the annual Area event.",
      action: "Open Form",
      type: "prayer-gift-day"
    },
    {
      icon: <Globe className="text-[#1b5e20]" size={24} />,
      title: "Mission Week and Outreaches",
      description: "Adult-led missions, community outreaches, and soul-winning records.",
      action: "Open Form",
      type: "mission-week-outreach"
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-1 mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#1b5e20]">Pilgrims' Department Workspace</h2>
        <p className="text-gray-500 text-xs md:text-sm font-medium">Managing records for adult members, families, and specialized prayer and mission weeks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-4 md:p-6 rounded-lg shadow-sm border-l-4 ${stat.color} transition-all hover:shadow-md`}>
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</h3>
            {loading ? (
              <Loader2 className="animate-spin text-gray-300 mt-2" size={20} />
            ) : (
              <div className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1 md:mt-2">{stat.value}</div>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 border-b-2 border-[#ffca28] pb-1 md:pb-2 inline-block">Pilgrim Ministry Subsidiaries</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {subsidiaries.map((sub, i) => (
            <div key={i} className={`p-5 md:p-6 rounded-lg shadow-sm border transition-shadow relative overflow-hidden group ${sub.highlight ? 'bg-[#1b5e20] text-white border-[#1b5e20]' : 'bg-white text-gray-900 border-gray-100 hover:shadow-md'}`}>
               <div className={`mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border ${sub.highlight ? 'bg-white/10 border-white/20' : 'bg-[#fffdf7] border-gray-100'}`}>
                {sub.icon}
              </div>
              <h4 className={`font-bold mb-1 md:mb-2 text-sm md:text-base leading-snug ${sub.highlight ? 'text-white' : 'text-gray-900'}`}>{sub.title}</h4>
              <p className={`text-xs mb-4 md:mb-6 ${sub.highlight ? 'text-gray-100' : 'text-gray-600'}`}>{sub.description}</p>
              <button
                onClick={() => router.push(`/initialize-report?type=${sub.type}`)}
                className={`w-full py-2 border-2 font-bold rounded transition-colors text-xs md:text-sm ${sub.highlight ? 'border-[#ffca28] bg-[#ffca28] text-[#1b5e20] hover:bg-white hover:border-white' : 'border-[#1b5e20] text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white'}`}
              >
                {sub.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

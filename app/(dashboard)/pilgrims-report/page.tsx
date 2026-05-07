"use client";

import { Hash, Home, Church, Gift, Globe, Info } from "lucide-react";

export default function PilgrimsReportPage() {
  const stats = [
    { label: "Active Pilgrims", value: "485", color: "border-[#1b5e20]" },
    { label: "Total Groups", value: "14", color: "border-blue-500" },
    { label: "Sacrifice Targets", value: "82%", color: "border-[#ffca28]" },
  ];

  const subsidiaries = [
    {
      icon: <Hash className="text-white" size={24} />,
      title: "Numerical Statistics",
      description: "Detailed breakdown of membership, new converts, and group growth.",
      action: "Update Numbers",
      highlight: true,
    },
    {
      icon: <Home className="text-[#1b5e20]" size={24} />,
      title: "National Family Week",
      description: "Reporting on family-focused seminars and domestic fellowship events.",
      action: "Open Form",
    },
    {
      icon: <Church className="text-[#1b5e20]" size={24} />,
      title: "National Week of Sacrifice",
      description: "Tracking participation and sacrificial giving across all zones.",
      action: "Open Form",
    },
    {
      icon: <Church className="text-[#1b5e20]" size={24} />,
      title: "Easter Pilgrims' Conference",
      description: "Report the annual Easter Pilgrims' and Mission Awareness Conference.",
      action: "Open Form",
    },
    {
      icon: <Gift className="text-[#1b5e20]" size={24} />,
      title: "Prayer and Gift Day",
      description: "Logging special gifts and prayer points from the annual Area event.",
      action: "Open Form",
    },
    {
      icon: <Globe className="text-[#1b5e20]" size={24} />,
      title: "Mission Week and Outreaches",
      description: "Adult-led missions, community outreaches, and soul-winning records.",
      action: "Open Form",
    },
  ];

  const zonalOverview = [
    { zone: "Nchia", members: 120, attendance: 95, growth: "+5%" },
    { zone: "Afam", members: 45, attendance: 38, growth: "Stable" },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b5e20]">Pilgrims' Department</h2>
        <p className="text-gray-600">Managing records for adult members, families, and specialized prayer and mission weeks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${stat.color}`}>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</h3>
            <div className="text-3xl font-extrabold text-gray-900 mt-2">{stat.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-[#ffca28] pb-2 inline-block">Pilgrim Ministry Subsidiaries</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subsidiaries.map((sub, i) => (
            <div key={i} className={`p-6 rounded-lg shadow-sm border transition-shadow relative overflow-hidden group ${sub.highlight ? 'bg-[#1b5e20] text-white border-[#1b5e20]' : 'bg-white text-gray-900 border-gray-100 hover:shadow-md'}`}>
              <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center border ${sub.highlight ? 'bg-white/10 border-white/20' : 'bg-[#fffdf7] border-gray-100'}`}>
                {sub.icon}
              </div>
              <h4 className={`font-bold mb-2 ${sub.highlight ? 'text-white' : 'text-gray-900'}`}>{sub.title}</h4>
              <p className={`text-sm mb-6 ${sub.highlight ? 'text-gray-100' : 'text-gray-600'}`}>{sub.description}</p>
              <button className={`w-full py-2 border-2 font-bold rounded transition-colors text-sm ${sub.highlight ? 'border-[#ffca28] bg-[#ffca28] text-[#1b5e20] hover:bg-white hover:border-white' : 'border-[#1b5e20] text-[#1b5e20] hover:bg-[#1b5e20] hover:text-white'}`}>
                {sub.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Zonal Membership Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Zone</th>
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Total Members</th>
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Weekly Attendance</th>
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Growth Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {zonalOverview.map((item, i) => (
                  <tr key={i}>
                    <td className="py-4 text-sm font-medium text-gray-900">{item.zone}</td>
                    <td className="py-4 text-sm text-gray-600">{item.members}</td>
                    <td className="py-4 text-sm text-gray-600">{item.attendance}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${item.growth.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Financial Summary Notes</h3>
          <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-[#ffca28] flex gap-3 mb-6">
            <Info className="text-[#ffca28] shrink-0" size={20} />
            <p className="text-xs text-gray-700"><strong>Note:</strong> Ensure all "Week of Sacrifice" figures match the bank lodgment records before final submission.</p>
          </div>
          <div className="space-y-3">
            <button className="w-full py-2.5 bg-[#1b5e20] text-white font-bold rounded-md hover:bg-[#2e7d32] transition-colors text-sm shadow-sm">
              Download Financial Template
            </button>
            <button className="w-full py-2.5 border-2 border-[#1b5e20] text-[#1b5e20] font-bold rounded-md hover:bg-gray-50 transition-colors text-sm">
              View Sacrifice History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { School, Baby, Tent, PartyPopper, Gift, BookOpen, Megaphone } from "lucide-react";

export default function ChildrenReportPage() {
  const stats = [
    { label: "Bible Clubs", value: "42", color: "border-[#1b5e20]" },
    { label: "Decisions for Christ", value: "312", color: "border-[#ffca28]" },
    { label: "Avg. Attendance", value: "1,250", color: "border-blue-500" },
  ];

  const subsidiaries = [
    {
      icon: <School className="text-[#1b5e20]" size={24} />,
      title: "Primary School Visitation",
      description: "Metrics for visitation to primary schools across the zones.",
      action: "Open Form",
    },
    {
      icon: <Baby className="text-[#1b5e20]" size={24} />,
      title: "Children Rally",
      description: "Zonal rallies focusing on outreach and children fellowship.",
      action: "Open Form",
    },
    {
      icon: <Tent className="text-[#1b5e20]" size={24} />,
      title: "Children Long Vacation Camp",
      description: "Detailed report on the annual holiday camp for children.",
      action: "Open Form",
    },
    {
      icon: <PartyPopper className="text-[#1b5e20]" size={24} />,
      title: "Children's Day",
      description: "Reporting on the May 27th national celebration activities.",
      action: "Open Form",
    },
    {
      icon: <Gift className="text-[#1b5e20]" size={24} />,
      title: "Children Christmas Party",
      description: "End-of-year evangelical outreach and festive activities.",
      action: "Open Form",
    },
    {
      icon: <BookOpen className="text-white" size={24} />,
      title: "Neighbourhood Bible Club",
      description: "Tracking the growth of community-based bible study groups.",
      action: "Log Weekly Progress",
      highlight: true,
    },
    {
      icon: <Megaphone className="text-[#1b5e20]" size={24} />,
      title: "Children Week of Emphasis",
      description: "Special week-long programs across the area zones.",
      action: "Open Form",
    },
  ];

  const recentClubs = [
    { zone: "Nchia", location: "Ebubu Community", coordinator: "Sis. Mercy", status: "Active" },
    { zone: "Oyigbo", location: "Railway Area", coordinator: "Bro. David", status: "New" },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1b5e20]">Children Department</h2>
        <p className="text-gray-600">Capturing the growth and spiritual impact of children's activities in Eleme Area.</p>
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
        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-[#ffca28] pb-2 inline-block">Children's Ministry Subsidiaries</h3>
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
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Bible Club Additions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Zone</th>
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Location</th>
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Coordinator</th>
                  <th className="pb-3 font-bold text-gray-500 text-sm uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentClubs.map((club, i) => (
                  <tr key={i}>
                    <td className="py-4 text-sm font-medium text-gray-900">{club.zone}</td>
                    <td className="py-4 text-sm text-gray-600">{club.location}</td>
                    <td className="py-4 text-sm text-gray-600">{club.coordinator}</td>
                    <td className="py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${club.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {club.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Departmental Oversight</h3>
          <p className="text-xs text-gray-500 mb-6">This section is used for General Statistics and internal oversight of the Children's department.</p>
          <div className="space-y-3">
            <button className="w-full py-2.5 bg-[#1b5e20] text-white font-bold rounded-md hover:bg-[#2e7d32] transition-colors text-sm shadow-sm">
              Download Area Summary
            </button>
            <button className="w-full py-2.5 border-2 border-[#1b5e20] text-[#1b5e20] font-bold rounded-md hover:bg-gray-50 transition-colors text-sm">
              View Yearly Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

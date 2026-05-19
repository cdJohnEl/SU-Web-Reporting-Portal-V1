"use client";

import { useEffect, useState } from "react";
import { fetchGlobalStats, GlobalStats } from "@/lib/stats";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import { useRole } from "@/lib/hooks/useRole";

export default function DashboardPage() {
  const [stats, setStats] = useState<GlobalStats>({
    totalSchools: 0,
    totalDecisions: 0,
    activeMissionaries: 0,
    submittedReports: 0,
    pendingReviews: 0,
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const { role, userId } = useRole();

  useEffect(() => {
    let mounted = true;
    let unsub: (() => void) | null = null;

    if (!role) return;

    // Live Stats
    const loadStats = async () => {
      try {
        const data = await fetchGlobalStats(role === "Admin" || role === "Travelling Secretary");
        if (mounted) setStats(data);
      } catch (err) {
        // Silent catch for stats
      }
    };
    loadStats();

    // Recent Submissions - Filter by user if not admin
    let baseQuery;
    if (role === "Admin" || role === "Travelling Secretary") {
      baseQuery = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(5));
    } else {
      // Missionary only sees their own reports to avoid permission-denied
      baseQuery = query(
        collection(db, "reports"), 
        where("userId", "==", userId), 
        orderBy("createdAt", "desc"), 
        limit(5)
      );
    }

    unsub = onSnapshot(baseQuery, (snap) => {
      if (mounted) {
        setRecentReports(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    }, (error) => {
      // Silence listener errors
    });

    return () => {
      mounted = false;
      if (unsub) unsub();
    };
  }, [role, userId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-bold text-[#1b5e20]">General Statistics</h2>
        <p className="text-gray-500 text-sm font-medium">Overview of ministry impact and reporting status for 2026</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stat Card 1 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#ffca28] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Schools Reached</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">{stats.totalSchools}</div>
          <span className="text-[#1b5e20] text-xs font-semibold bg-[#1b5e20]/10 px-2 py-1 rounded inline-block">Real-time aggregate</span>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#1b5e20] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Decisions</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">{stats.totalDecisions.toLocaleString()}</div>
          <span className="text-gray-500 text-xs font-medium">Across all approved reports</span>
        </div>
        
        {/* Stat Card 3 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#1b5e20] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Active Missionaries</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">{stats.activeMissionaries}</div>
          <span className="text-gray-500 text-xs font-medium">Currently approved users</span>
        </div>
        
        {/* Stat Card 4 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#0284c7] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Admin Approval Required</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-2">{stats.pendingReviews}</div>
          <div className="text-xs text-blue-600 font-bold">Reports awaiting review</div>
        </div>

        {/* Stat Card 5 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#1b5e20] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Total Reports</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">{stats.submittedReports}</div>
          <span className="text-gray-500 text-xs font-medium">Approved submissions</span>
        </div>

        {/* Stat Card 6 */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-[#ffca28] shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Pending Access Requests</h3>
          <div className="text-3xl font-extrabold text-gray-800 mb-1">...</div>
          <span className="text-gray-500 text-xs font-medium">Check Admin Panel</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <div className="flex-[2] bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-6 overflow-x-auto">
          <h3 className="text-[#1b5e20] text-lg font-bold border-b border-gray-100 pb-3 mb-4">Recent Submissions</h3>
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20 rounded-tl-md">Report Type</th>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20">Submitted By</th>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20">Status</th>
                <th className="p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-[#1b5e20]/20 rounded-tr-md">Decisions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-gray-400 italic">No reports submitted yet.</td></tr>
              ) : (
                recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm font-bold text-gray-800">{report.reportType}</td>
                    <td className="p-3 text-sm text-gray-600">{report.userName}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${report.status === 'approved' ? 'bg-[#1b5e20]/10 text-[#1b5e20]' : 'bg-yellow-100 text-yellow-700'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-bold text-[#1b5e20]">{report.decisions || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col gap-3">
          <h3 className="text-[#1b5e20] text-lg font-bold border-b border-gray-100 pb-3 mb-1">Quick Actions</h3>
          <button className="w-full bg-[#1b5e20] hover:bg-[#2e7d32] text-white font-semibold py-2.5 px-4 rounded-md transition-colors shadow-sm text-sm text-left">
            Generate Area Summary
          </button>
          <button className="w-full bg-white hover:bg-gray-50 text-[#1b5e20] border-2 border-[#1b5e20] font-semibold py-2 px-4 rounded-md transition-colors shadow-sm text-sm text-left">
            Export Reading Note Data
          </button>
          <button className="w-full bg-white hover:bg-gray-50 text-[#1b5e20] border-2 border-[#1b5e20] font-semibold py-2 px-4 rounded-md transition-colors shadow-sm text-sm text-left">
            View Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}

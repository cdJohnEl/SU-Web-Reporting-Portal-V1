"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { CheckCircle, XCircle, UserCheck, Shield } from "lucide-react";

type UserProfile = {
  id: string;
  fullName: string;
  zone: string;
  role: string;
  email: string;
  status: "pending" | "approved" | "rejected";
};

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for all users
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
      setPendingUsers(users.filter(u => u.status === "pending"));
      setApprovedUsers(users.filter(u => u.status === "approved"));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleApproval = async (userId: string, newStatus: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      alert(`User ${newStatus} successfully!`);
    } catch (error: any) {
      alert("Error updating status: " + error.message);
    }
  };

  const thClass = "p-3 bg-[#fffdf7] text-gray-700 font-bold text-sm border-b-2 border-gray-200 text-left";
  const tdClass = "p-3 text-sm text-gray-600 border-b border-gray-50";

  return (
    <div className="space-y-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1b5e20] flex items-center gap-2">
          <Shield size={28} /> Admin Management
        </h2>
        <p className="text-gray-500">Review and approve access requests for the reporting portal.</p>
      </div>

      {/* Pending Approvals */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-[#fffdf7] border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
            <UserCheck className="text-[#ffca28]" size={20} /> Pending User Approvals 
            <span className="bg-[#ffca28]/20 text-yellow-800 text-xs px-2 py-0.5 rounded-full ml-1">
              {pendingUsers.length}
            </span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={thClass}>Full Name</th>
                <th className={thClass}>Zone</th>
                <th className={thClass}>Role</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading users...</td></tr>
              ) : pendingUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">No pending requests at the moment.</td></tr>
              ) : (
                pendingUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className={tdClass + " font-bold text-gray-800"}>{user.fullName}</td>
                    <td className={tdClass}>{user.zone}</td>
                    <td className={tdClass}><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{user.role}</span></td>
                    <td className={tdClass}>{user.email}</td>
                    <td className={tdClass}>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproval(user.id, "approved")}
                          className="flex items-center gap-1 bg-[#1b5e20] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#2e7d32] transition-colors"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => handleApproval(user.id, "rejected")}
                          className="flex items-center gap-1 border border-red-500 text-red-500 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-50 transition-colors"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Approved Users */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden opacity-90">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-600 flex items-center gap-2 text-lg">
            Approved Users
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-1">
              {approvedUsers.length}
            </span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={thClass}>Full Name</th>
                <th className={thClass}>Zone</th>
                <th className={thClass}>Role</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">Loading users...</td></tr>
              ) : approvedUsers.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400 italic">No approved users found.</td></tr>
              ) : (
                approvedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className={tdClass + " font-bold text-gray-800"}>{user.fullName}</td>
                    <td className={tdClass}>{user.zone}</td>
                    <td className={tdClass}>{user.role}</td>
                    <td className={tdClass}>{user.email}</td>
                    <td className={tdClass}>
                      <span className="flex items-center gap-1 text-[#1b5e20] text-xs font-bold">
                        <CheckCircle size={14} /> Approved
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

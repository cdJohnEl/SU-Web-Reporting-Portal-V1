"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, updateDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { CheckCircle, Shield, Edit, Trash2, FileText, Filter, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import RoleGuard from "@/components/auth/RoleGuard";

type UserProfile = {
  id: string;
  fullName: string;
  zone: string;
  role: string;
  email: string;
  status: "pending" | "approved" | "rejected";
};

type Report = {
  id: string;
  userId: string;
  userName: string;
  type: string;
  month: string;
  year: number;
  status: "submitted" | "approved" | "rejected";
  submittedAt: any;
  decisions: number;
  schoolsVisited: number;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit User State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    let unsubUsers: (() => void) | null = null;
    let unsubReports: (() => void) | null = null;

    // Real-time Users
    unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      if (mounted) {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile)));
      }
    }, (error) => {
      // Sliently handle permission errors
    });

    // Real-time Reports
    unsubReports = onSnapshot(collection(db, "reports"), (snapshot) => {
      if (mounted) {
        setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report)));
        setLoading(false);
      }
    }, (error) => {
        if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      if (unsubUsers) unsubUsers();
      if (unsubReports) unsubReports();
    };
  }, []);

  const handleUserStatus = async (userId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
    } catch (e) { alert("Error updating status - check permissions"); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
    } catch (e) { alert("Error deleting user - check permissions"); }
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const saveUserEdits = async () => {
    if (!editingUser) return;
    try {
      const { id, ...data } = editingUser;
      await updateDoc(doc(db, "users", id), data);
      setIsEditDialogOpen(false);
    } catch (e) { alert("Error saving edits - check permissions"); }
  };

  const handleReportStatus = async (reportId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "reports", reportId), { status: newStatus });
    } catch (e) { alert("Error updating report - check permissions"); }
  };

  const pendingUsers = users.filter(u => u.status === "pending");
  const allApprovedUsers = users.filter(u => u.status === "approved");
  const pendingReports = reports.filter(r => r.status === "submitted");

  const thClass = "p-3 bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider border-b border-gray-100 text-left";
  const tdClass = "p-4 text-sm text-gray-600 border-b border-gray-50 align-middle";

  return (
    <RoleGuard allowedRoles={["Admin", "Travelling Secretary"]}>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-gray-100">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1b5e20] flex items-center gap-2">
              <Shield size={32} className="text-[#ffca28]" /> Oversight Dashboard
            </h2>
            <p className="text-gray-500 mt-1 font-medium">System Administration, User Lifecycle & Report Audit</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-white border p-1 rounded-lg mb-8 shadow-sm">
            <TabsTrigger value="users" className="px-8 py-2 font-bold data-[state=active]:bg-[#1b5e20] data-[state=active]:text-white rounded-md transition-all">
              User Management ({users.length})
            </TabsTrigger>
            <TabsTrigger value="reports" className="px-8 py-2 font-bold data-[state=active]:bg-[#1b5e20] data-[state=active]:text-white rounded-md transition-all">
              Report Approvals ({pendingReports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Pending Section */}
            {pendingUsers.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-yellow-100 overflow-hidden ring-1 ring-yellow-50">
                <div className="p-4 bg-yellow-50/50 border-b border-yellow-100">
                  <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                    <UserCheck size={18} /> New Access Requests ({pendingUsers.length})
                  </h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={thClass}>User Details</th>
                      <th className={thClass}>Zone / Role</th>
                      <th className={thClass}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(user => (
                      <tr key={user.id} className="hover:bg-yellow-50/20">
                        <td className={tdClass}>
                          <div className="font-bold text-gray-900">{user.fullName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </td>
                        <td className={tdClass}>
                          <div className="text-xs font-bold text-gray-700">{user.zone}</div>
                          <div className="text-[10px] uppercase text-[#1b5e20] font-bold">{user.role}</div>
                        </td>
                        <td className={tdClass}>
                          <div className="flex gap-2">
                            <button onClick={() => handleUserStatus(user.id, "approved")} className="bg-[#1b5e20] text-white p-2 rounded-md hover:bg-green-700 transition shadow-sm"><CheckCircle size={16} /></button>
                            <button onClick={() => handleDeleteUser(user.id)} className="bg-white text-red-500 border border-red-200 p-2 rounded-md hover:bg-red-50 transition"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* User List Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 className="font-bold text-gray-800">Master User Records</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white border px-3 py-1.5 rounded-full"><Filter size={12} /> Filter Users</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={thClass}>Full Name</th>
                      <th className={thClass}>Zone</th>
                      <th className={thClass}>Role</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allApprovedUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/50">
                        <td className={tdClass}>
                          <div className="font-bold text-gray-800">{user.fullName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </td>
                        <td className={tdClass + " font-medium"}>{user.zone}</td>
                        <td className={tdClass}><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{user.role}</span></td>
                        <td className={tdClass}>
                           <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active
                           </span>
                        </td>
                        <td className={tdClass}>
                          <div className="flex gap-2">
                             <button onClick={() => handleEditUser(user)} className="p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition"><Edit size={16}/></button>
                             <button onClick={() => handleDeleteUser(user.id)} className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
              <div className="p-5 bg-gray-50/50 border-b border-gray-100">
                 <h3 className="font-bold text-gray-800">Pending Report Reviews</h3>
                 <p className="text-xs text-gray-500 mt-1">Authenticate and approve field data into the area summary.</p>
              </div>
              
              <div className="overflow-x-auto">
                {pendingReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 text-center">
                     <FileText size={48} className="text-gray-200 mb-4" />
                     <p className="text-gray-400 font-medium">No reports waiting for approval</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={thClass}>Submitted By</th>
                        <th className={thClass}>Report Type</th>
                        <th className={thClass}>Month/Year</th>
                        <th className={thClass}>Metric Snip</th>
                        <th className={thClass}>Approval</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pendingReports.map(report => (
                        <tr key={report.id} className="hover:bg-[#fffdf7]">
                          <td className={tdClass}>
                            <div className="font-bold text-gray-900">{report.userName}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: {report.userId?.substring(0,8)}</div>
                          </td>
                          <td className={tdClass}>
                            <span className="font-semibold text-[#1565c0] flex items-center gap-1">
                              <FileText size={14} /> {report.type || "Missionary Report"}
                            </span>
                          </td>
                          <td className={tdClass + " font-bold"}>{report.month} {report.year}</td>
                          <td className={tdClass}>
                             <div className="flex gap-3 text-[10px] font-bold">
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Decisions: {report.decisions || 0}</span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Schools: {report.schoolsVisited || 0}</span>
                             </div>
                          </td>
                          <td className={tdClass}>
                             <div className="flex gap-2">
                               <button onClick={() => handleReportStatus(report.id, "approved")} className="bg-[#1b5e20] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-green-800 transition flex items-center gap-1.5">
                                 <CheckCircle size={14} /> Approve
                               </button>
                               <button onClick={() => handleReportStatus(report.id, "rejected")} className="bg-white border-2 border-red-100 text-red-500 px-3 py-1.2 rounded-md text-xs font-bold hover:bg-red-50 transition">
                                 Reject
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User Profile</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    value={editingUser.fullName}
                    onChange={e => setEditingUser({...editingUser, fullName: e.target.value})}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#1b5e20] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Zone</label>
                    <select 
                      value={editingUser.zone}
                      onChange={e => setEditingUser({...editingUser, zone: e.target.value})}
                      className="w-full border p-2 rounded-md outline-none"
                    >
                      <option value="Nchia">Nchia</option>
                      <option value="Agbonchia">Agbonchia</option>
                      <option value="Akpajo">Akpajo</option>
                      <option value="Aleto">Aleto</option>
                      <option value="Ebubu">Ebubu</option>
                      <option value="Ogale">Ogale</option>
                      <option value="Onne">Onne</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Role</label>
                    <select 
                      value={editingUser.role}
                      onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                      className="w-full border p-2 rounded-md outline-none"
                    >
                      <option value="Missionary">Missionary</option>
                      <option value="Travelling Secretary">Travelling Secretary</option>
                      <option value="Zonal Secretary">Zonal Secretary</option>
                      <option value="Area Committee Member">Area Committee Member</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <button onClick={() => setIsEditDialogOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={saveUserEdits} className="px-6 py-2 text-sm font-bold bg-[#1b5e20] text-white rounded-md hover:bg-green-800 shadow-md">Save Changes</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}

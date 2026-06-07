"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MapPin, 
  Tent, 
  Activity, 
  Folder, 
  Settings, 
  Shield,
  LogOut
} from "lucide-react";
import { useRole } from "@/lib/hooks/useRole";

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col min-h-screen">
      <SidebarContent />
    </aside>
  );
}

export function SidebarContent() {
  const { role } = useRole();
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdmin = role === "Admin" || role === "Travelling Secretary";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <Image 
          src="/scripture_union_logo.png" 
          alt="SU Logo" 
          width={40} 
          height={40} 
          className="rounded-md shadow-sm"
        />
        <span className="font-semibold text-lg text-sidebar-foreground">Eleme Area</span>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto space-y-6 py-4">
        {/* Navigation Groups */}
        <div>
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === '/dashboard' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
            <LayoutDashboard className="w-4 h-4" />
            Home
          </Link>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Core Ministry Reports
          </div>
          <div className="space-y-1">
            <Link href="/schools-youth" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === '/schools-youth' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <Users className="w-4 h-4" /> Schools & Youth Report
            </Link>
            <Link href="/children-report" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === '/children-report' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <BookOpen className="w-4 h-4" /> Children Report
            </Link>
            <Link href="/pilgrims-report" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === '/pilgrims-report' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <MapPin className="w-4 h-4" /> Pilgrims' Report
            </Link>
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Operational
          </div>
          <div className="space-y-1">
            <Link href="/camping-report" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === '/camping-report' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <Tent className="w-4 h-4" /> Camping Report
            </Link>
            <Link href="/missionary-report" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === '/missionary-report' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <Activity className="w-4 h-4" /> Missionary Report
            </Link>
            <Link href="/initialize-report?type=schools-termly" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname.includes('schools-termly') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <Folder className="w-4 h-4" /> Termly Report
            </Link>
            <Link href="/initialize-report?type=tour" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname.includes('tour-report') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <Folder className="w-4 h-4" /> Tour Report
            </Link>
            <Link href="/initialize-report?type=trainings-meetings" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname.includes('trainings-meetings') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <Folder className="w-4 h-4" /> Trainings & Meetings
            </Link>
            <Link href="/initialize-report?type=zonal" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname.includes('zonal-report') ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
              <Folder className="w-4 h-4" /> Zonal Report
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              System
            </div>
            <div className="space-y-1">
              <Link href="/admin" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${pathname === '/admin' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'}`}>
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t border-sidebar-border mt-4">
           <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
             Account
           </div>
           <div className="space-y-1">
             <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground opacity-80 transition-all">
               <Users className="w-4 h-4" /> My Profile
             </Link>
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-3 py-2 text-sm font-extrabold rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
             >
               <LogOut className="w-4 h-4" /> Sign Out
             </button>
           </div>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border text-[10px] text-center text-muted-foreground font-bold tracking-widest uppercase opacity-40">
        v1.0.0 Portfolio
      </div>
    </div>
  );
}

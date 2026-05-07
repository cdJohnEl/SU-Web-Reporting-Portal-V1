import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, MapPin, Tent, Activity, Folder, Settings, Shield } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-3">
        {/* Placeholder for SU Logo */}
        <div className="w-8 h-8 bg-primary text-primary-foreground font-bold rounded-md flex items-center justify-center">
          SU
        </div>
        <span className="font-semibold text-lg text-sidebar-foreground">Eleme Area</span>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto space-y-6 py-4">
        <div>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
            <LayoutDashboard className="w-4 h-4" />
            Home
          </Link>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Core Ministry Reports
          </div>
          <div className="space-y-1">
            <Link href="/schools-youth" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
              <Users className="w-4 h-4" /> Schools & Youth
            </Link>
            <Link href="/children-report" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
              <BookOpen className="w-4 h-4" /> Children
            </Link>
            <Link href="/pilgrims-report" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
              <MapPin className="w-4 h-4" /> Pilgrims' Report
            </Link>
            <Link href="/camping-report" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
              <Tent className="w-4 h-4" /> Camping Report
            </Link>
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Operational
          </div>
          <div className="space-y-1">
            <Link href="/missionary-report" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
              <Activity className="w-4 h-4" /> Missionary Report
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-2 border-transparent hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground hover:border-[#1b5e20]/30 transition-all opacity-80">
              <Folder className="w-4 h-4" /> Zonal Report
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md border-l-2 border-transparent hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground hover:border-[#1b5e20]/30 transition-all opacity-80">
              <Folder className="w-4 h-4" /> Tour Report
            </Link>
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            System
          </div>
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground">
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground opacity-80">
              <Users className="w-4 h-4" /> User's Profile
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border text-sm text-center text-muted-foreground">
        v1.0.0
      </div>
    </aside>
  );
}

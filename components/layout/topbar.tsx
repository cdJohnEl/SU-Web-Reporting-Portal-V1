"use client";

import { useEffect, useState } from "react";
import { User, LogOut, Search, Menu } from "lucide-react";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SidebarContent } from "./sidebar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export function TopBar() {
  const [userName, setUserName] = useState<string>("User");
  const [initials, setInitials] = useState<string>("U");
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        
        // Try getting full name from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const fullName = userData.fullName || userData.name;
          if (fullName) {
            setUserName(fullName);
            const initials = fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2);
            setInitials(initials);
          }
        }
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="h-16 border-b bg-white flex flex-row items-center justify-between px-4 md:px-6 shadow-sm z-30 w-full sticky top-0">
      <div className="flex items-center gap-2">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Dialog>
            <DialogTrigger 
              render={
                <Button variant="ghost" size="icon" className="text-[#1b5e20] hover:bg-[#1b5e20]/10">
                  <Menu className="h-6 w-6" />
                </Button>
              }
            />
            <DialogContent 
              className="fixed left-0 top-0 bottom-0 translate-x-0 translate-y-0 w-72 h-full rounded-none p-0 bg-sidebar border-r border-sidebar-border data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left overflow-hidden sm:max-w-none"
              showCloseButton={true}
            >
              <div className="h-full overflow-y-auto">
                <SidebarContent />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-3 mr-4">
          <Image 
            src="/scripture_union_logo.png" 
            alt="SU Logo" 
            width={32} 
            height={32} 
            className="rounded-sm shadow-sm"
          />
          <span className="font-bold text-[#1b5e20] text-sm md:hidden">SU Eleme</span>
        </div>
      </div>
      
      <div className="hidden sm:flex flex-1 max-w-lg mx-4">
        <div className="relative flex items-center w-full h-10 rounded-md border border-gray-200 bg-gray-50/50 px-3 overflow-hidden focus-within:ring-2 focus-within:ring-[#1b5e20]/20 focus-within:border-[#1b5e20] transition-all">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search reports or data..." 
            className="w-full h-full outline-none text-sm bg-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-100 p-1 md:p-2 rounded-md border-none outline-none group transition-all">
            <span className="text-sm text-gray-600 hidden md:inline-block">
              Welcome, <strong className="text-gray-900 font-extrabold">{userName.split(' ')[0]}</strong>
            </span>
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-md bg-[#1b5e20] text-white flex items-center justify-center text-xs md:text-sm font-bold shadow-sm group-hover:scale-105 transition-transform">
              {initials}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 p-2 shadow-xl border-gray-100">
            <DropdownMenuLabel className="font-extrabold text-[#1b5e20] text-[10px] uppercase tracking-widest px-2 py-1.5 opacity-50">Authorized Session</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2.5 font-bold text-gray-700 rounded-md focus:bg-[#1b5e20]/5 focus:text-[#1b5e20]">
              <User className="mr-2 h-4 w-4" />
              User Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 cursor-pointer py-2.5 font-black rounded-md focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out Securely
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

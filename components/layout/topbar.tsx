"use client";

import { useEffect, useState } from "react";
import { User, LogOut, Search } from "lucide-react";
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

export function TopBar() {
  const [userName, setUserName] = useState<string>("Amenya");
  const [initials, setInitials] = useState<string>("AM");
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || "User");
        
        // Try getting full name from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const fullName = userDoc.data().fullName;
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
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="h-16 border-b bg-white flex flex-row items-center justify-between px-6 shadow-sm z-10 w-full relative">
      <div className="flex-1 max-w-lg">
        <div className="relative flex items-center w-full h-10 rounded-md border border-gray-300 bg-white px-3 overflow-hidden focus-within:ring-2 focus-within:ring-[#1b5e20] focus-within:border-transparent transition-all">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search reports or data..." 
            className="w-full h-full outline-none text-sm bg-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md border-none outline-none focus:ring-2 focus:ring-[#1b5e20] group transition-all">
            <span className="text-sm text-gray-600 hidden sm:inline-block">
              Welcome, <strong className="text-gray-900 font-extrabold">{userName.split(' ')[0]}</strong>
            </span>
            <div className="h-9 w-9 rounded-full bg-[#1b5e20] text-white flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-105 transition-transform">
              {initials}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 p-2">
            <DropdownMenuLabel className="font-bold text-[#1b5e20]">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2 font-medium rounded-md">
              <User className="mr-2 h-4 w-4" />
              User Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 cursor-pointer py-2 font-bold rounded-md focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (allowedRoles.includes(userData.role)) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
            router.push("/dashboard"); // Redirect unauthorized users to dashboard
          }
        } else {
          setAuthorized(false);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Role check failed:", error);
        setAuthorized(false);
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router, allowedRoles]);

  if (authorized === null) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1b5e20] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}

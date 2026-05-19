"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export function useRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let unsubDoc: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (mounted) setUserId(user.uid);
        unsubDoc = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (mounted && docSnap.exists()) {
            setRole(docSnap.data().role);
            setLoading(false);
          }
        }, (err) => {
          if (mounted) {
            console.error("Error fetching user role:", err);
            setLoading(false);
          }
        });
      } else {
        if (mounted) {
          setRole(null);
          setUserId(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  return { role, userId, loading };
}

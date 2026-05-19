import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export type GlobalStats = {
  totalSchools: number;
  totalDecisions: number;
  activeMissionaries: number;
  submittedReports: number;
  pendingReviews: number;
};

export async function fetchGlobalStats(isAdmin: boolean = false): Promise<GlobalStats> {
  try {
    // Both Missionaries and Admins can fetch approved totals if rules allow
    const reportsQuery = query(collection(db, "reports"), where("status", "==", "approved"));
    const reportsSnapshot = await getDocs(reportsQuery);
    
    let totalSchools = 0;
    let totalDecisions = 0;
    
    reportsSnapshot.forEach((doc) => {
      const data = doc.data();
      totalSchools += (data.schoolsVisited || 0);
      totalDecisions += (data.decisions || 0);
    });

    const pendingSnapshot = isAdmin 
      ? await getDocs(query(collection(db, "reports"), where("status", "==", "submitted")))
      : { size: 0 } as any;
    
    const usersSnapshot = isAdmin
      ? await getDocs(query(collection(db, "users"), where("status", "==", "approved")))
      : { size: 0 } as any;

    return {
      totalSchools,
      totalDecisions,
      activeMissionaries: usersSnapshot.size,
      submittedReports: reportsSnapshot.size,
      pendingReviews: pendingSnapshot.size,
    };
  } catch (error: any) {
    // Return empty stats silently on permission denied to avoid console spam
    // until the user applies the correct Firestore security rules.
    return {
      totalSchools: 0,
      totalDecisions: 0,
      activeMissionaries: 0,
      submittedReports: 0,
      pendingReviews: 0,
    };
  }
}

export async function fetchDeptStats(reportType: string) {
  try {
    const q = query(
        collection(db, "reports"), 
        where("reportType", "==", reportType),
        where("status", "==", "approved")
    );
    const snap = await getDocs(q);
    let total = 0;
    snap.forEach(doc => {
        total += (doc.data().decisions || 0); // Simplified for now
    });
    return { count: snap.size, impact: total };
  } catch (error: any) {
    return { count: 0, impact: 0 };
  }
}

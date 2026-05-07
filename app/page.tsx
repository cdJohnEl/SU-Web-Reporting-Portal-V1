import { redirect } from "next/navigation";

export default function Home() {
  // Currently redirecting user to login or dashboard.
  // When middleware is implemented, this will naturally funnel them based on auth state.
  redirect("/login");
}

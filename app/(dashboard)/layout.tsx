import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import AuthGuard from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'SU Reporting Portal | Dashboard',
  description: 'Internal reporting dashboard for Scripture Union Eleme.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full bg-[#fffdf7] relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1b5e20 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <TopBar />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative z-10">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

import { AppSidebarNav } from '@/components/common/AppSidebarNav';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold text-primary"
            >
              <HeartPulse className="h-6 w-6" />
              <span className="text-xl">RuralCare AI</span>
            </Link>
          </div>
          <div className="flex-1">
            <AppSidebarNav />
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

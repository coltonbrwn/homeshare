'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}

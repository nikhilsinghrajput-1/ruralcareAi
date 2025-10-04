
'use client';

import { AppSidebarNav } from '@/components/common/AppSidebarNav';
import Link from 'next/link';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, cloneElement, isValidElement, Children } from 'react';
import { doc } from 'firebase/firestore';
import { useTranslation } from '@/hooks/use-translation';
import { AppHeader } from '@/components/common/AppHeader';
import { TranslationContext } from '@/contexts/TranslationContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);
  const { t, isLoading: isTranslationLoading } = useTranslation(userProfile?.languagePreference);

  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // This effect now safely handles setting the title for all pages.
    if (pathname === '/dashboard') {
      setPageTitle('Dashboard');
    }
  }, [pathname]);

  const isLoading = isUserLoading || isProfileLoading || isTranslationLoading;

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child)) {
      // @ts-expect-error - we are cloning the element and adding props
      return cloneElement(child, { setPageTitle });
    }
    return child;
  });

  return (
    <TranslationContext.Provider value={{ t, isLoading: isTranslationLoading }}>
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-card md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-16 items-center border-b px-6">
                <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-primary"
                >
                <HeartPulse className="h-6 w-6" />
                <span className="text-xl">RuralCare AI</span>
                </Link>
            </div>
            <div className="flex-1">
                <AppSidebarNav t={t} />
            </div>
            </div>
        </aside>
        <div className="flex flex-col">
            <AppHeader pageTitle={pageTitle} t={t} />
            {childrenWithProps}
        </div>
        </div>
    </TranslationContext.Provider>
  );
}

    
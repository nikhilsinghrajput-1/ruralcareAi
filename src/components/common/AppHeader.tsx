
'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CircleUser, Menu, Package2, Search, Bell, HeartPulse, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AppSidebarNav } from './AppSidebarNav';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

type AppHeaderProps = {
  pageTitle: string;
  t: (key: string) => string;
};

export function AppHeader({ pageTitle, t }: AppHeaderProps) {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
        >
          <HeartPulse className="h-6 w-6" />
          <span className="sr-only">RuralCare AI</span>
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full max-h-screen flex-col">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                <HeartPulse className="h-6 w-6" />
                <span>RuralCare AI</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <AppSidebarNav t={t} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <h1 className="text-xl font-semibold md:text-2xl">{pageTitle}</h1>
        <div className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            {/* Search can be implemented later */}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('header.userMenu.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t('header.userMenu.settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>{t('header.userMenu.support')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              {t('header.userMenu.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

    
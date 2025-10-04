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
import { CircleUser, Menu, Package2, Search, Bell, HeartPulse } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AppSidebarNav } from './AppSidebarNav';

type AppHeaderProps = {
  pageTitle: string;
};

export function AppHeader({ pageTitle }: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
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
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
                <HeartPulse className="h-6 w-6" />
                <span>RuralCare AI</span>
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <AppSidebarNav />
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
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/login">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

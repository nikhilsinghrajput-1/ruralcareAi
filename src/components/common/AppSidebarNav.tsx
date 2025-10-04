'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  Scan,
  Siren,
  Video,
  BookOpen,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'AI Tools',
    icon: Stethoscope,
    isParent: true,
    children: [
      {
        href: '/dashboard/symptom-analysis',
        label: 'Symptom Analysis',
        icon: Stethoscope,
      },
      {
        href: '/dashboard/image-analysis',
        label: 'Image Analysis',
        icon: Scan,
      },
      {
        href: '/dashboard/emergency-detection',
        label: 'Emergency Detection',
        icon: Siren,
      },
    ],
  },
  { href: '/dashboard/telemedicine', label: 'Telemedicine', icon: Video },
  {
    href: '/dashboard/health-education',
    label: 'Health Education',
    icon: BookOpen,
  },
];

const secondaryNavItems = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-4 text-sm font-medium h-full">
        <div className="flex-grow">
            <Accordion type="multiple" className="w-full" defaultValue={['AI Tools']}>
                {navItems.map((item, index) =>
                item.isParent ? (
                    <AccordionItem key={index} value={item.label} className="border-b-0">
                    <AccordionTrigger className="py-2 text-base font-semibold text-foreground/70 hover:text-primary hover:no-underline [&[data-state=open]>svg]:text-primary">
                        <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 border-l-2 border-primary/50 ml-2.5">
                        {item.children?.map((child) => (
                        <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-foreground transition-all hover:text-primary hover:bg-muted',
                            pathname === child.href && 'bg-muted text-primary'
                            )}
                        >
                            <child.icon className="h-4 w-4" />
                            {child.label}
                        </Link>
                        ))}
                    </AccordionContent>
                    </AccordionItem>
                ) : (
                    <Link
                    key={item.href}
                    href={item.href!}
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary hover:bg-muted',
                        pathname === item.href && 'bg-muted text-primary'
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    </Link>
                )
                )}
            </Accordion>
      </div>
      <div className="mt-auto pb-4">
        {secondaryNavItems.map(item => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/70 transition-all hover:text-primary hover:bg-muted',
                    pathname === item.href && 'bg-muted text-primary font-semibold'
                )}
            >
                <item.icon className="h-5 w-5" />
                {item.label}
            </Link>
        ))}
      </div>
    </nav>
  );
}

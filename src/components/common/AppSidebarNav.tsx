
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
  HeartPulse,
  Users,
  Briefcase,
  ClipboardList,
  Heart,
  Syringe,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type AppSidebarNavProps = {
    t: (key: string) => string;
    userRole?: string;
}

export function AppSidebarNav({ t, userRole }: AppSidebarNavProps) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    {
      label: t('sidebar.aiTools.title'),
      icon: Stethoscope,
      isParent: true,
      children: [
        {
          href: '/dashboard/symptom-analysis',
          label: t('sidebar.aiTools.symptomAnalysis'),
          icon: Stethoscope,
        },
        {
          href: '/dashboard/image-analysis',
          label: t('sidebar.aiTools.imageAnalysis'),
          icon: Scan,
        },
        {
          href: '/dashboard/emergency-detection',
          label: t('sidebar.aiTools.emergencyDetection'),
          icon: Siren,
        },
      ],
    },
    { href: '/dashboard/telemedicine', label: t('sidebar.telemedicine'), icon: Video },
    {
      href: '/dashboard/specialists',
      label: t('sidebar.specialists'),
      icon: Users,
    },
    {
      href: '/dashboard/vaccination',
      label: t('sidebar.vaccination'),
      icon: Syringe,
    },
    {
      href: '/dashboard/health-education',
      label: t('sidebar.healthEducation'),
      icon: BookOpen,
    },
    {
        href: '/dashboard/womens-wellbeing',
        label: t('sidebar.womensWellbeing'),
        icon: Heart,
    },
     {
        href: '/dashboard/self-healing',
        label: t('sidebar.selfHealing'),
        icon: Sparkles,
    },
    {
        href: '/dashboard/emergency-card',
        label: t('sidebar.emergencyCard'),
        icon: HeartPulse
    }
  ];

  if (userRole === 'chw') {
    navItems.splice(1, 0, {
        isParent: true,
        label: "CHW Tools",
        icon: Briefcase,
        children: [
            {
                href: '/dashboard/chw/my-patients',
                label: t('sidebar.myPatients'),
                icon: Users
            },
            {
                href: '/dashboard/chw/my-tasks',
                label: t('sidebar.myTasks'),
                icon: ClipboardList
            }
        ]
    });
  }

  if (userRole === 'specialist') {
    navItems.splice(1, 0, {
        href: '/dashboard/specialist/dashboard',
        label: 'Referral Dashboard',
        icon: Briefcase
    });
  }


  const secondaryNavItems = [
      { href: '/dashboard/settings', label: t('sidebar.settings'), icon: Settings },
  ]


  return (
    <nav className="grid items-start px-4 text-sm font-medium h-full">
        <div className="flex-grow">
            <Accordion type="multiple" className="w-full" defaultValue={[t('sidebar.aiTools.title'), 'CHW Tools']}>
                {navItems.map((item, index) =>
                item.isParent ? (
                    <AccordionItem key={index} value={item.label} className="border-b-0">
                    <AccordionTrigger className="py-2 text-base font-semibold text-foreground/70 hover:text-primary hover:no-underline [&[data-state=open]&gt;svg]:text-primary">
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

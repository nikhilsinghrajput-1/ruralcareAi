'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HeartPulse,
  CalendarDays,
  Stethoscope,
  Users,
  Search,
  BookHeart,
  Hospital,
  User,
  Heart,
  Activity,
  Siren,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  className,
  iconClassName
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  className?: string;
  iconClassName?: string;
}) => (
  <Link href={href} className="block hover:shadow-lg transition-shadow rounded-lg">
    <Card className={cn('flex items-center p-4 h-full', className)}>
      <Icon className={cn('h-8 w-8 mr-4', iconClassName)} />
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  </Link>
);


const HelpCard = ({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType;
  title: string;
  href: string;
}) => (
  <Link href={href} className="block">
      <Card className="group hover:border-primary transition-colors text-center p-6 flex flex-col items-center justify-center h-full border-2 border-dashed">
          <Icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-xl">{title}</h3>
      </Card>
  </Link>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background sticky top-0 z-50 border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">RuralCare AI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
           <Link
            href="/dashboard/telemedicine"
            className="text-sm font-medium hover:underline underline-offset-4 hidden md:block"
          >
            Hospitals
          </Link>
           <Link
            href="/dashboard/specialists"
            className="text-sm font-medium hover:underline underline-offset-4 hidden md:block"
          >
            Specialities
          </Link>
           <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline underline-offset-4 hidden md:block"
          >
            Patient Corner
          </Link>
          <Button asChild>
            <Link href="/login">Login / Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-12 pb-12 md:pt-24 lg:pt-32 relative bg-gray-50/50">
           <div className="absolute inset-0 z-0">
               <Image
                    src="https://picsum.photos/seed/healthcare-banner/1800/1000"
                    alt="Healthcare background"
                    fill
                    objectFit="cover"
                    className="opacity-10"
                    data-ai-hint="medical professional background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
           </div>

          <div className="container px-4 md:px-6 z-10 relative">
            <div className="flex flex-col items-center space-y-4 text-center">
               <div className="flex gap-4 mb-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/telemedicine"><CalendarDays />Book Appointment</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/symptom-analysis"><Stethoscope />Analyze Symptoms</Link>
                  </Button>
                  <Button variant="outline" asChild>
                     <Link href="/dashboard/specialists"><Users />View Specialists</Link>
                  </Button>
                </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                  Healthcare for Good
                </h1>
                <p className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                    Today. Tomorrow. Always.
                </p>
              </div>
               <div className="relative w-full max-w-2xl mt-8">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
               </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeatureCard 
                            icon={CalendarDays} 
                            title="Book an Appointment" 
                            description="With the country's leading experts" 
                            href="/dashboard/telemedicine"
                            className="bg-yellow-50 border-yellow-200"
                            iconClassName="text-yellow-600"
                        />
                         <FeatureCard 
                            icon={Hospital} 
                            title="Hospitals" 
                            description="Health needs under one roof" 
                            href="/dashboard/telemedicine"
                            className="bg-blue-50 border-blue-200"
                            iconClassName="text-blue-600"
                        />
                         <FeatureCard 
                            icon={Heart} 
                            title="Specialities" 
                            description="Our expertise in Healthcare" 
                            href="/dashboard/specialists"
                            className="bg-purple-50 border-purple-200"
                            iconClassName="text-purple-600"
                        />
                         <FeatureCard 
                            icon={Users} 
                            title="Doctors" 
                            description="Top experts for your health" 
                            href="/dashboard/specialists"
                            className="bg-orange-50 border-orange-200"
                            iconClassName="text-orange-600"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">We can help you with</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                           <HelpCard icon={Activity} title="Health Checkups" href="/dashboard/symptom-analysis"/>
                           <HelpCard icon={Siren} title="Emergency Services" href="/dashboard/emergency-detection"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 RuralCare AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
          <div className="flex gap-4">
            <Link href="#">
              <MessageSquare className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
}

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
  ShieldCheck,
  Video,
  Lightbulb,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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

        {/* Features Overview Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features for Better Health</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our platform provides a suite of tools designed to bring quality healthcare to your fingertips.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Stethoscope className="h-10 w-10 text-primary" />
                  <CardTitle>AI Symptom Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Describe symptoms via text or voice and get an AI-powered preliminary analysis and risk assessment in seconds.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Video className="h-10 w-10 text-primary" />
                  <CardTitle>Telemedicine Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Schedule and conduct live video sessions with remote doctors and specialists, bridging the distance gap.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Siren className="h-10 w-10 text-destructive" />
                  <CardTitle>One-Touch Emergency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Instantly alert emergency contacts and nearby CHWs with your live location in critical situations.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple Steps to Get Care</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                We've designed our platform to be simple and intuitive.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Register & Build Profile</h3>
                <p className="text-muted-foreground">Quickly sign up and fill out your Digital Emergency Card with critical health information.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                  <Lightbulb className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Access AI & Specialists</h3>
                <p className="text-muted-foreground">Use AI tools for instant analysis or browse the specialist directory to schedule a consultation.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-4">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Get Care & Follow-up</h3>
                <p className="text-muted-foreground">Receive diagnoses, referrals, and manage your health journey with automated reminders.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by Communities</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Hear from those who are using RuralCare AI to make a difference.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <blockquote className="text-lg">"For the first time, I feel secure knowing that help is just a button press away. The emergency feature gave my family peace of mind."</blockquote>
                  <div className="mt-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://picsum.photos/seed/patient/100/100" data-ai-hint="portrait woman" />
                      <AvatarFallback>SP</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Sunita Patil</p>
                      <p className="text-sm text-muted-foreground">Patient, Village Resident</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <blockquote className="text-lg">"This platform has revolutionized my work. I can manage my patients more effectively and get them specialist advice without long travel."</blockquote>
                   <div className="mt-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="https://picsum.photos/seed/chw/100/100" data-ai-hint="portrait man" />
                      <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Rajesh Kumar</p>
                      <p className="text-sm text-muted-foreground">Community Health Worker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-card border-t">
        <div className="container py-12 px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4">
                <div className="md:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <HeartPulse className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl">RuralCare AI</span>
                    </Link>
                    <p className="text-sm text-muted-foreground">Bridging the healthcare gap in rural communities with technology.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
                    <div>
                        <h4 className="font-semibold mb-2">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Patient Corner</Link></li>
                            <li><Link href="/dashboard/specialists" className="text-muted-foreground hover:text-foreground">Find a Doctor</Link></li>
                            <li><Link href="/dashboard/telemedicine" className="text-muted-foreground hover:text-foreground">Book Appointment</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Stay Connected</h4>
                        <div className="flex space-x-4 mb-4">
                            <Link href="#"><Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
                            <Link href="#"><Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
                            <Link href="#"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" /></Link>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Subscribe to our newsletter</p>
                        <div className="flex">
                            <Input placeholder="Your email" className="rounded-r-none" />
                            <Button type="submit" className="rounded-l-none">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 RuralCare AI. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}

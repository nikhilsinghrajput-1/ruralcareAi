
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HeartPulse,
  MessageSquareHeart,
  Siren,
  Camera,
  BookOpen,
  Users,
  Twitter,
  Linkedin,
} from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background sticky top-0 z-50 border-b">
        <Link href="#" className="flex items-center justify-center">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="sr-only">RuralCare AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Testimonials
          </Link>
          <Button asChild>
            <Link href="/login">Login / Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Revolutionizing Rural Healthcare with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Empowering Community Health Workers with AI-driven diagnostics
                    to bring quality healthcare to every village.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started for Free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#">Book a Demo</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/rural-health/600/400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                width={600}
                height={400}
                data-ai-hint="health worker rural"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Smarter Way to Provide Care
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform equips health workers with powerful tools to
                  diagnose, assist, and educate their communities effectively.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <MessageSquareHeart className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Symptom Analysis</h3>
                <p className="text-muted-foreground">
                  Analyze symptoms with AI to get instant preliminary
                  diagnostics and risk assessments.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <Siren className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Emergency Detection</h3>
                <p className="text-muted-foreground">
                  Detect critical conditions and receive immediate action
                  protocols to save lives.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <Camera className="h-10 w-10 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Medical Image Analysis</h3>
                <p className="text-muted-foreground">
                  Upload photos of wounds or skin conditions for an AI-powered
                  analysis.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                How It Works
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A simple, intuitive process designed for the real world.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 md:grid-cols-3 items-start justify-center gap-8 md:gap-12 pt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                  1
                </div>
                <h3 className="text-lg font-bold">Speak or Type Symptoms</h3>
                <p className="text-sm text-muted-foreground">
                  Easily record patient symptoms using voice or text, in your
                  local language.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                  2
                </div>
                <h3 className="text-lg font-bold">AI Analyzes Data</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI processes the information to identify potential
                  conditions and risks.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl">
                  3
                </div>
                <h3 className="text-lg font-bold">Receive Instant Guidance</h3>
                <p className="text-sm text-muted-foreground">
                  Get clear, actionable steps, from first-aid advice to
                  escalating to a specialist.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-5xl mb-12">
              Trusted by Communities
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Users className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle>Sunita Devi</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Community Health Worker, Bihar
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    “RuralCare AI has changed the way I work. I can now assess
                    patients more quickly and confidently. It's like having a
                    doctor in my pocket.”
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Users className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle>Ramesh P.</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Village Elder, Maharashtra
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    “For the first time, our village has access to immediate
                    health advice. This app is saving lives and giving us
                    hope.”
                  </p>
                </CardContent>
              </Card>
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
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="#">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
}

    
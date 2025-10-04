'use client';
import Link from 'next/link';
import {
  Stethoscope,
  Scan,
  Siren,
  ArrowRight,
  Video,
  BookOpen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const features = [
  {
    icon: Stethoscope,
    title: 'Symptom Analysis',
    description: 'Get a preliminary diagnosis by describing patient symptoms.',
    link: '/dashboard/symptom-analysis',
    cta: 'Analyze Symptoms',
  },
  {
    icon: Scan,
    title: 'Image Analysis',
    description: 'Upload a medical image for AI-powered diagnostic insights.',
    link: '/dashboard/image-analysis',
    cta: 'Analyze Image',
  },
  {
    icon: Siren,
    title: 'Emergency Detection',
    description: 'Assess situations for critical conditions and get action plans.',
    link: '/dashboard/emergency-detection',
    cta: 'Detect Emergency',
  },
];

const otherFeatures = [
    {
      icon: Video,
      title: "Telemedicine",
      description: "Connect with specialists via video consultation.",
      link: "/dashboard/telemedicine"
    },
    {
      icon: BookOpen,
      title: "Health Education",
      description: "Access a library of health articles and videos.",
      link: "/dashboard/health-education"
    }
]

interface DashboardPageProps {
  setPageTitle: (title: string) => void;
}

export default function DashboardPage({ setPageTitle }: DashboardPageProps) {
  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);

  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={feature.link}>
                    {feature.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            {otherFeatures.map(feature => (
                 <Card key={feature.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">{feature.title}</CardTitle>
                        <feature.icon className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                     <CardFooter>
                        <Button asChild variant="outline">
                            <Link href={feature.link}>
                                Go to {feature.title}
                            </Link>
                        </Button>
                     </CardFooter>
                 </Card>
            ))}
        </div>
      </main>
  );
}

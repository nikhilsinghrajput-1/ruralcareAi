'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Mic, Play, Sparkles, Wind, Waves, Sun, Moon } from 'lucide-react';

interface SelfHealingPageProps {
  setPageTitle?: (title: string) => void;
}

const SessionCard = ({ title, description, duration, imageUrl, imageHint }: { title: string, description: string, duration: string, imageUrl: string, imageHint: string }) => (
    <Card className="overflow-hidden">
        <div className="relative h-40 w-full">
            <Image src={imageUrl} alt={title} fill objectFit="cover" data-ai-hint={imageHint} />
        </div>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">{duration}</span>
            <Button size="sm" className="gap-2"><Play className="h-4 w-4" /> Start Session</Button>
        </CardFooter>
    </Card>
);

export default function SelfHealingPage({ setPageTitle }: SelfHealingPageProps) {
  useEffect(() => {
    setPageTitle?.('Self-Healing & Relaxation');
  }, [setPageTitle]);

  return (
    <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-green-50/50 via-blue-50/50 to-purple-50/50">
      <div className="mb-8 text-center">
        <Sparkles className="h-12 w-12 text-primary mx-auto mb-2" />
        <h1 className="text-3xl font-bold tracking-tight">Self-Healing & Relaxation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A peaceful environment for mental wellness, spiritual healing, and stress relief through guided chanting, yoga, and meditation.
        </p>
      </div>

      <Tabs defaultValue="meditation" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto h-auto">
          <TabsTrigger value="chanting" className="gap-2"><Mic />Chanting</TabsTrigger>
          <TabsTrigger value="yoga" className="gap-2"><Wind />Yoga</TabsTrigger>
          <TabsTrigger value="meditation" className="gap-2"><BrainCircuit />Meditation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chanting" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SessionCard 
                    title="Om Chanting"
                    description="A powerful mantra to align your body, mind, and spirit."
                    duration="10 Minutes"
                    imageUrl="https://plus.unsplash.com/premium_photo-1674675647905-db8438e251dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
                    imageHint="zen spiritual"
                />
                 <SessionCard 
                    title="Gayatri Mantra"
                    description="An ancient chant for wisdom and enlightenment."
                    duration="15 Minutes"
                    imageUrl="https://picsum.photos/seed/gayatri/600/400"
                    imageHint="sunrise meditation"
                />
                 <SessionCard 
                    title="Mahamrityunjaya Mantra"
                    description="A healing mantra for rejuvenation and protection."
                    duration="20 Minutes"
                    imageUrl="https://plus.unsplash.com/premium_photo-1677013623482-6d71ca2dc71a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9seSUyMGJvb2t8ZW58MHx8MHx8fDA%3D"
                    imageHint="serene nature"
                />
            </div>
        </TabsContent>

        <TabsContent value="yoga" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SessionCard 
                    title="Morning Energizer"
                    description="A gentle flow to awaken your body and mind."
                    duration="15 Minutes"
                    imageUrl="https://images.unsplash.com/reserve/YEc7WB6ASDydBTw6GDlF_antalya-beach-lulu.jpg?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
                    imageHint="sunrise yoga"
                />
                 <SessionCard 
                    title="Chair Yoga"
                    description="Accessible poses for all mobility levels to improve flexibility."
                    duration="10 Minutes"
                    imageUrl="https://picsum.photos/seed/chair-yoga/600/400"
                    imageHint="person chair yoga"
                />
                 <SessionCard 
                    title="Evening Relaxation"
                    description="A calming sequence to release the day's stress and prepare for sleep."
                    duration="20 Minutes"
                    imageUrl="https://picsum.photos/seed/evening-yoga/600/400"
                    imageHint="calm sunset"
                />
            </div>
        </TabsContent>
        
        <TabsContent value="meditation" className="mt-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <SessionCard 
                    title="Mindfulness Meditation"
                    description="Focus on your breath and find stillness in the present moment."
                    duration="10 Minutes"
                    imageUrl="https://picsum.photos/seed/mindful-meditation/600/400"
                    imageHint="peaceful person"
                />
                 <SessionCard 
                    title="Body Scan Relaxation"
                    description="Release tension from head to toe with this guided body scan."
                    duration="20 Minutes"
                    imageUrl="https://picsum.photos/seed/body-scan/600/400"
                    imageHint="calm person lying"
                />
                 <SessionCard 
                    title="Anxiety Relief Breathing"
                    description="Use the 4-7-8 technique to calm your nervous system instantly."
                    duration="5 Minutes"
                    imageUrl="https://picsum.photos/seed/breathing/600/400"
                    imageHint="serene landscape"
                />
            </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

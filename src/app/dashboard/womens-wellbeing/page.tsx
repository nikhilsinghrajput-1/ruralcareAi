'use client';

import { useEffect } from 'react';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Shield, Heart, Baby, Droplets, Leaf, Activity, Volume2, Phone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WomensWellbeingPageProps {
  setPageTitle?: (title: string) => void;
}

const ContentCard = ({ title, children, imageUrl, imageHint }: { title: string, children: React.ReactNode, imageUrl?: string, imageHint?: string }) => (
    <Card className="mt-4">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {imageUrl && (
                 <div className="relative h-48 w-full rounded-lg overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        objectFit="cover"
                        data-ai-hint={imageHint}
                    />
                </div>
            )}
            <div className="text-muted-foreground">{children}</div>
            <Button variant="outline" size="sm" className="gap-2">
                <Volume2 />
                Listen
            </Button>
        </CardContent>
    </Card>
);

export default function WomensWellbeingPage({ setPageTitle }: WomensWellbeingPageProps) {
  const { t } = useAppTranslation();

  useEffect(() => {
    setPageTitle?.(t('womensWellbeing.header'));
  }, [t, setPageTitle]);

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('womensWellbeing.header')}</h1>
        <p className="text-muted-foreground">{t('womensWellbeing.description')}</p>
      </div>

      <Tabs defaultValue="healthy-living" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="healthy-living" className="gap-2"><Leaf />{t('womensWellbeing.tabs.healthyLiving')}</TabsTrigger>
          <TabsTrigger value="safety" className="gap-2"><Shield />{t('womensWellbeing.tabs.safety')}</TabsTrigger>
          <TabsTrigger value="pregnancy" className="gap-2"><Baby />{t('womensWellbeing.tabs.pregnancy')}</TabsTrigger>
          <TabsTrigger value="menstruation" className="gap-2"><Droplets />{t('womensWellbeing.tabs.menstruation')}</TabsTrigger>
          <TabsTrigger value="menopause" className="gap-2"><Activity />{t('womensWellbeing.tabs.menopause')}</TabsTrigger>
          <TabsTrigger value="other" className="gap-2"><Heart />{t('womensWellbeing.tabs.other')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="healthy-living">
            <ContentCard title="Daily Hygiene Routines" imageUrl="https://trainingexpress.org.uk/wp-content/uploads/2020/05/hand-wash.jpg" imageHint="hygiene person">
                <p>Placeholder for daily hygiene routines. This section will include information on handwashing, dental care, and general cleanliness to prevent infections.</p>
            </ContentCard>
             <ContentCard title="Nutrition Tips" imageUrl="https://plus.unsplash.com/premium_photo-1726736525038-66c5306e08b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D " imageHint="healthy food woman">
                <p>Placeholder for nutrition tips for women. This will cover balanced diets, essential nutrients like iron and calcium, and healthy eating habits.</p>
            </ContentCard>
        </TabsContent>

        <TabsContent value="safety">
            <Alert variant="destructive" className="mb-6">
                <Phone className="h-5 w-5" />
                <AlertTitle>Emergency Helplines</AlertTitle>
                <AlertDescription>
                    <p>Women's Helpline: <Button variant="link" className="p-0 h-auto" asChild><a href="tel:1091">1091</a></Button></p>
                    <p>Local Police: <Button variant="link" className="p-0 h-auto" asChild><a href="tel:100">100</a></Button></p>
                </AlertDescription>
            </Alert>
            <ContentCard title="Maintaining Personal Safety at Home">
                <p>Placeholder for guidance on personal safety. This will include tips on securing your home, being aware of your surroundings, and what to do in case of a threat.</p>
            </ContentCard>
        </TabsContent>

        <TabsContent value="pregnancy">
            <ContentCard title="Key Do's and Don'ts During Pregnancy" imageUrl="https://plus.unsplash.com/premium_photo-1723737629884-364ae1a82d34?q=80&w=1692&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" imageHint="pregnant woman health">
                <p>Placeholder for pregnancy care. This section will provide guidance on nutrition, rest, regular checkups, and warning signs to watch out for during pregnancy.</p>
            </ContentCard>
        </TabsContent>

        <TabsContent value="menstruation">
            <ContentCard title="Menstrual Hygiene Management" imageUrl="https://picsum.photos/seed/menstrual-health/600/400" imageHint="hygiene products">
                <p>Placeholder for menstrual hygiene. This will cover the use of safe products, managing discomfort, and busting common myths about menstruation.</p>
            </ContentCard>
        </TabsContent>
        
        <TabsContent value="menopause">
            <ContentCard title="Navigating Menopause" imageUrl="https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZlbWFsZSUyMGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D" imageHint="older woman happy">
                <p>Placeholder for menopause guidance. This section will help women understand the changes during menopause, manage symptoms, and focus on mental and physical well-being.</p>
            </ContentCard>
        </TabsContent>

        <TabsContent value="other">
            <ContentCard title="Common Health Issues" imageUrl="https://plus.unsplash.com/premium_photo-1675808577247-2281dc17147a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
                <p>Placeholder for other common health issues like Anemia, UTIs, and guidance on breast self-exams. This section will provide prevention tips and symptoms to look for.</p>
            </ContentCard>
        </TabsContent>
      </Tabs>
    </main>
  );
}

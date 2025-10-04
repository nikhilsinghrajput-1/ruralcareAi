'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { HealthEducationContent } from '@/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

interface HealthEducationPageProps {
  t?: (key: string) => string;
  setPageTitle?: (title: string) => void;
}

export default function HealthEducationPage({ t = (key) => key, setPageTitle }: HealthEducationPageProps) {
  const firestore = useFirestore();

  useEffect(() => {
    setPageTitle?.(t('healthEducation.header'));
  }, [t, setPageTitle]);

  const articlesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'health_education_content');
  }, [firestore]);

  const { data: articles, isLoading } = useCollection<HealthEducationContent>(articlesQuery);

  return (
      <main className="flex-1 p-4 md:p-8">
        {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({length: 4}).map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="h-48 w-full" />
                        <div className="p-6">
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <CardFooter>
                            <Skeleton className="h-6 w-1/2" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}
        {!isLoading && articles && articles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article) => {
              const image = PlaceHolderImages.find((img) => img.id === article.imageId);
              return (
                <Card key={article.id} className="flex flex-col overflow-hidden">
                  <CardHeader className="p-0">
                    {image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={image.imageUrl}
                          alt={article.title}
                          fill
                          objectFit="cover"
                          data-ai-hint={image.imageHint}
                        />
                      </div>
                    )}
                  </CardHeader>
                  <div className="p-6 flex flex-col flex-grow">
                      <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription className="mt-2 flex-grow">{article.summary}</CardDescription>
                  </div>
                  <CardFooter>
                    <Link href="#" className="text-primary font-semibold flex items-center gap-2">
                      {t('healthEducation.readMore')} <ArrowRight className="h-4 w-4"/>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        {!isLoading && (!articles || articles.length === 0) && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">{t('healthEducation.noContent.title')}</h3>
                <p className="text-muted-foreground">{t('healthEducation.noContent.description')}</p>
            </div>
        )}
      </main>
  );
}

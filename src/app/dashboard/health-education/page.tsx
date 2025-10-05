
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
import { ArrowRight, BookOpen } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect } from 'react';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { HEALTH_ARTICLES } from '@/lib/health-education-data';

interface HealthEducationPageProps {
  setPageTitle?: (title: string) => void;
}

export default function HealthEducationPage({ setPageTitle }: HealthEducationPageProps) {
  const { t } = useAppTranslation();
  const articles = HEALTH_ARTICLES;

  useEffect(() => {
    setPageTitle?.(t('healthEducation.header'));
  }, [t, setPageTitle]);

  return (
      <main className="flex-1 p-4 md:p-8">
        {articles && articles.length > 0 ? (
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
        ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">{t('healthEducation.noContent.title')}</h3>
                <p className="text-muted-foreground">{t('healthEducation.noContent.description')}</p>
            </div>
        )}
      </main>
  );
}

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppHeader } from '@/components/common/AppHeader';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    title: 'The Importance of Handwashing',
    category: 'Hygiene',
    summary: 'Learn the proper techniques for handwashing to prevent the spread of germs and diseases.',
    imageId: 'health-education-1',
  },
  {
    title: 'Eating a Balanced Diet',
    category: 'Nutrition',
    summary: 'Discover the key components of a healthy diet and how it can improve your overall well-being.',
    imageId: 'health-education-2',
  },
  {
    title: 'Staying Active for a Healthy Heart',
    category: 'Fitness',
    summary: 'Find out how regular physical activity can strengthen your heart and reduce health risks.',
    imageId: 'health-education-3',
  },
  {
    title: 'Understanding Your Blood Pressure',
    category: 'Chronic Disease',
    summary: 'A guide to understanding blood pressure readings and managing hypertension.',
    imageId: 'health-education-4',
  },
];

export default function HealthEducationPage() {
  return (
    <>
      <AppHeader pageTitle="Health Education" />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article) => {
            const image = PlaceHolderImages.find((img) => img.id === article.imageId);
            return (
              <Card key={article.title} className="flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                  {image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={image.imageUrl}
                        alt={article.title}
                        layout="fill"
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
                    Read More <ArrowRight className="h-4 w-4"/>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}

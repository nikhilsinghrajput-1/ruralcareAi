'use client';

import { useState, ChangeEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { analyzeMedicalImage, AnalyzeMedicalImageOutput } from '@/ai/flows/analyze-medical-images';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppTranslation } from '@/contexts/TranslationContext';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Please describe the image in at least 10 characters.',
  }),
});

function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
}

interface ImageAnalysisPageProps {
  setPageTitle?: (title: string) => void;
}

export default function ImageAnalysisPage({ setPageTitle }: ImageAnalysisPageProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMedicalImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useAppTranslation();

  useEffect(() => {
    setPageTitle?.(t('imageAnalysis.header'));
  }, [t, setPageTitle]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const dataUri = await fileToDataUri(file);
      setImageDataUri(dataUri);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!imageDataUri) {
        toast({
            variant: 'destructive',
            title: t('imageAnalysis.toast.noImage.title'),
            description: t('imageAnalysis.toast.noImage.description'),
        });
        return;
    }
    
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeMedicalImage({
        photoDataUri: imageDataUri,
        description: values.description,
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Image analysis failed:', error);
      toast({
        variant: 'destructive',
        title: t('imageAnalysis.toast.analysisFailed.title'),
        description: t('imageAnalysis.toast.analysisFailed.description'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('imageAnalysis.upload.title')}</CardTitle>
              <CardDescription>{t('imageAnalysis.upload.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormItem>
                    <FormLabel>{t('imageAnalysis.form.image.label')}</FormLabel>
                    <FormControl>
                        <div 
                            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Image preview" fill objectFit="contain" className="rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{t('imageAnalysis.form.image.uploadTrigger')}</span> {t('imageAnalysis.form.image.dragAndDrop')}</p>
                                    <p className="text-xs text-muted-foreground">{t('imageAnalysis.form.image.fileTypes')}</p>
                                </div>
                            )}
                            <Input ref={fileInputRef} id="picture" type="file" className="hidden" accept="image/*" onChange={handleImageChange}/>
                        </div>
                    </FormControl>
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('imageAnalysis.form.description.label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('imageAnalysis.form.description.placeholder')} {...field} />
                        </FormControl>
                        <FormDescription>
                          {t('imageAnalysis.form.description.description')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? t('imageAnalysis.form.submitButtonLoading') : t('imageAnalysis.form.submitButton')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>{t('imageAnalysis.analysis.title')}</CardTitle>
              <CardDescription>{t('imageAnalysis.analysis.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                   <Loader2 className="h-16 w-16 animate-spin text-primary" />
                   <p className="text-muted-foreground">{t('imageAnalysis.analysis.loadingText')}</p>
                </div>
              )}
              {analysisResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold">{t('imageAnalysis.analysis.result.diagnosis')}</h3>
                    <p className="text-muted-foreground">{analysisResult.diagnosis}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t('imageAnalysis.analysis.result.confidence')}</h3>
                    <div className="flex items-center gap-4">
                      <Progress value={analysisResult.confidenceScore * 100} className="w-full" />
                      <span className="font-bold text-primary">{`${(analysisResult.confidenceScore * 100).toFixed(0)}%`}</span>
                    </div>
                  </div>
                </div>
              ) : !isLoading && (
                 <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">{t('imageAnalysis.analysis.placeholder')}</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
  );
}

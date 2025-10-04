'use client';

import { useState, ChangeEvent, useRef } from 'react';
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
import { AppHeader } from '@/components/common/AppHeader';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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

export default function ImageAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeMedicalImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
            title: 'No Image Selected',
            description: 'Please upload an image to analyze.',
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
        title: 'Analysis Failed',
        description: 'There was an error processing the image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AppHeader pageTitle="Medical Image Analysis" />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Upload a medical image and provide a description for analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormItem>
                    <FormLabel>Medical Image</FormLabel>
                    <FormControl>
                        <div 
                            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, or other image formats</p>
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
                        <FormLabel>Image Description</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'Skin lesion on the patient's forearm, appeared 1 week ago.'" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide context for the image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>This is an AI-generated analysis and should be confirmed by a medical professional.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                   <Loader2 className="h-16 w-16 animate-spin text-primary" />
                   <p className="text-muted-foreground">Analyzing image, please wait...</p>
                </div>
              )}
              {analysisResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold">Diagnostic Insights</h3>
                    <p className="text-muted-foreground">{analysisResult.diagnosis}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Confidence Score</h3>
                    <div className="flex items-center gap-4">
                      <Progress value={analysisResult.confidenceScore * 100} className="w-full" />
                      <span className="font-bold text-primary">{`${(analysisResult.confidenceScore * 100).toFixed(0)}%`}</span>
                    </div>
                  </div>
                </div>
              ) : !isLoading && (
                 <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Analysis results will be displayed here.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

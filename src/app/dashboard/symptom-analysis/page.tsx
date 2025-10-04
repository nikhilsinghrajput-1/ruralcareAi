'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { analyzeSymptoms, AnalyzeSymptomsOutput } from '@/ai/flows/analyze-symptoms';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AppHeader } from '@/components/common/AppHeader';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: 'Please describe the symptoms in at least 10 characters.',
  }),
});

export default function SymptomAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeSymptomsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeSymptoms(values);
      setAnalysisResult(result);
      
      if (user && firestore) {
        const consultationData = {
          ...values,
          ...result,
          patientId: user.uid,
          consultationDate: serverTimestamp(),
        };
        const consultationsRef = collection(firestore, 'user_profiles', user.uid, 'consultations');
        addDocumentNonBlocking(consultationsRef, consultationData);
        toast({
            title: "Analysis Saved",
            description: "The consultation has been saved to the patient's record."
        })
      }

    } catch (error) {
      console.error('Symptom analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error processing the symptoms. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AppHeader pageTitle="Symptom Analysis" />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe Symptoms</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'Patient has a high fever, persistent cough, and difficulty breathing for the last 2 days.'"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of the patient's symptoms, including duration and severity.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading || !user} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Analyzing...' : 'Analyze and Save Symptoms'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                   <Loader2 className="h-16 w-16 animate-spin text-primary" />
                   <p className="text-muted-foreground">Analyzing symptoms, please wait...</p>
                </div>
              )}
              {analysisResult ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold">Preliminary Diagnosis</h3>
                    <p className="text-muted-foreground">{analysisResult.preliminaryDiagnosis}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Risk Assessment</h3>
                    <p className="text-muted-foreground">{analysisResult.riskAssessment}</p>
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

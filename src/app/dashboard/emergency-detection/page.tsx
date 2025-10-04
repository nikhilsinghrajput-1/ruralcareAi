'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { detectEmergencyConditions, DetectEmergencyConditionsOutput } from '@/ai/flows/detect-emergency-conditions';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppHeader } from '@/components/common/AppHeader';
import { Loader2, Siren, ListChecks, PhoneForwarded } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe symptoms.'),
  vitalSigns: z.string().min(5, 'Please enter vital signs.'),
  medicalHistory: z.string().min(5, 'Please enter medical history.'),
  patientLocation: z.string().min(3, 'Please enter patient location.'),
});

export default function EmergencyDetectionPage() {
  const [detectionResult, setDetectionResult] = useState<DetectEmergencyConditionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      vitalSigns: '',
      medicalHistory: '',
      patientLocation: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDetectionResult(null);
    try {
      const result = await detectEmergencyConditions(values);
      setDetectionResult(result);
    } catch (error) {
      console.error('Emergency detection failed:', error);
      toast({
        variant: 'destructive',
        title: 'Detection Failed',
        description: 'There was an error processing the data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AppHeader pageTitle="Emergency Detection" />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Data</CardTitle>
              <CardDescription>Fill in the patient's data to assess for emergency conditions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="symptoms" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Chest pain, shortness of breath" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="vitalSigns" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vital Signs</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BP 180/120, HR 120, SpO2 88%" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="medicalHistory" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant Medical History</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., History of heart attack, diabetes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="patientLocation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Village A, near the community hall" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Assessing...' : 'Assess for Emergency'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Emergency Assessment</CardTitle>
              <CardDescription>AI-generated assessment and recommended actions.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                   <Loader2 className="h-16 w-16 animate-spin text-primary" />
                   <p className="text-muted-foreground">Assessing patient data...</p>
                </div>
              )}
              {detectionResult ? (
                <Alert variant={detectionResult.isEmergency ? 'destructive' : 'default'} className="h-full">
                  <Siren className="h-5 w-5" />
                  <AlertTitle className="text-lg font-bold">
                    {detectionResult.isEmergency ? 'Emergency Detected' : 'No Emergency Detected'}
                  </AlertTitle>
                  <AlertDescription>
                    <div className="space-y-4 mt-4">
                        <p>{detectionResult.emergencyDescription}</p>

                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><ListChecks />Recommended Actions</h4>
                            <p className="text-sm">{detectionResult.recommendedActions}</p>
                        </div>
                        
                        {detectionResult.isEmergency && detectionResult.alertContacts.length > 0 && (
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><PhoneForwarded />Alert Contacts</h4>
                                <div className="flex flex-wrap gap-2">
                                    {detectionResult.alertContacts.map((contact, i) => (
                                        <Badge key={i} variant="secondary">{contact}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                  </AlertDescription>
                </Alert>
              ) : !isLoading && (
                 <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Assessment results will be shown here.</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

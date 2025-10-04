'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Siren, ListChecks, PhoneForwarded, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { useUser, useFirestore } from '@/firebase';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe symptoms.'),
  vitalSigns: z.string().min(5, 'Please enter vital signs.'),
  medicalHistory: z.string().min(5, 'Please enter medical history.'),
  patientLocation: z.string().min(3, 'Please enter patient location.'),
});

interface EmergencyDetectionPageProps {
  setPageTitle?: (title: string) => void;
}

export default function EmergencyDetectionPage({ setPageTitle }: EmergencyDetectionPageProps) {
  const [detectionResult, setDetectionResult] = useState<DetectEmergencyConditionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useAppTranslation();
  const { user } = useUser();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<{ languagePreference?: string } | null>(null);

  useEffect(() => {
    setPageTitle?.(t('emergencyDetection.header'));
  }, [t, setPageTitle]);
  
  useEffect(() => {
    if (user && firestore) {
      const getUserProfile = async () => {
        const { getDoc, doc } = await import('firebase/firestore');
        const userDoc = await getDoc(doc(firestore, 'user_profiles', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      };
      getUserProfile();
    }
  }, [user, firestore]);


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
        title: t('emergencyDetection.toast.detectionFailed.title'),
        description: t('emergencyDetection.toast.detectionFailed.description'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSpeakActions = () => {
    if (!detectionResult || typeof window === 'undefined' || !window.speechSynthesis) {
        toast({
            variant: 'destructive',
            title: "Browser Not Supported",
            description: "Your browser does not support voice output."
        })
        return;
    }

    window.speechSynthesis.cancel(); // Cancel any previous speech

    const textToSpeak = detectionResult.recommendedActions;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = userProfile?.languagePreference || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('emergencyDetection.patientData.title')}</CardTitle>
              <CardDescription>{t('emergencyDetection.patientData.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="symptoms" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('emergencyDetection.form.symptoms.label')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('emergencyDetection.form.symptoms.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="vitalSigns" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('emergencyDetection.form.vitalSigns.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('emergencyDetection.form.vitalSigns.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="medicalHistory" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('emergencyDetection.form.medicalHistory.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('emergencyDetection.form.medicalHistory.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="patientLocation" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('emergencyDetection.form.patientLocation.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('emergencyDetection.form.patientLocation.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? t('emergencyDetection.form.submitButtonLoading') : t('emergencyDetection.form.submitButton')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>{t('emergencyDetection.assessment.title')}</CardTitle>
              <CardDescription>{t('emergencyDetection.assessment.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                   <Loader2 className="h-16 w-16 animate-spin text-primary" />
                   <p className="text-muted-foreground">{t('emergencyDetection.assessment.loadingText')}</p>
                </div>
              )}
              {detectionResult ? (
                <Alert variant={detectionResult.isEmergency ? 'destructive' : 'default'} className="h-full">
                  <Siren className="h-5 w-5" />
                  <AlertTitle className="text-lg font-bold">
                    {detectionResult.isEmergency ? t('emergencyDetection.assessment.result.emergency') : t('emergencyDetection.assessment.result.noEmergency')}
                  </AlertTitle>
                  <AlertDescription>
                    <div className="space-y-4 mt-4">
                        <p>{detectionResult.emergencyDescription}</p>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold flex items-center gap-2"><ListChecks />{t('emergencyDetection.assessment.result.actions')}</h4>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={handleSpeakActions}
                                    disabled={!detectionResult}
                                    aria-label="Read recommended actions aloud"
                                >
                                    <Volume2 className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="text-sm">{detectionResult.recommendedActions}</p>
                        </div>
                        
                        {detectionResult.isEmergency && detectionResult.alertContacts.length > 0 && (
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><PhoneForwarded />{t('emergencyDetection.assessment.result.alertContacts')}</h4>
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
                    <p className="text-muted-foreground">{t('emergencyDetection.assessment.placeholder')}</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking, useDoc } from '@/firebase';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { Specialist, Referral } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpecialistsPageProps {
  setPageTitle?: (title: string) => void;
}

export default function SpecialistsPage({ setPageTitle }: SpecialistsPageProps) {
  const { t } = useAppTranslation();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [referralNotes, setReferralNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPageTitle?.(t('specialists.header'));
  }, [t, setPageTitle]);

  const specialistsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'specialists');
  }, [firestore]);

  const { data: specialists, isLoading } = useCollection<Specialist>(specialistsQuery);
  
  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [user, firestore]);
  const { data: userProfile } = useDoc(userDocRef);


  const handleReferClick = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setIsReferralDialogOpen(true);
  };

  const handleSendReferral = async () => {
    if (!user || !userProfile || !selectedSpecialist || !referralNotes.trim()) {
      toast({
        variant: 'destructive',
        title: t('specialists.toast.error.title'),
        description: 'Missing user, specialist, or notes.',
      });
      return;
    }

    setIsSubmitting(true);
    const referralsCollection = collection(firestore, 'referrals');

    const newReferral: Omit<Referral, 'id'> = {
      patientId: user.uid,
      patientName: userProfile.name,
      patientVillage: userProfile.villageLocation,
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      status: 'pending',
      notes: referralNotes,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(referralsCollection, newReferral);
    
    toast({
        title: t('specialists.toast.success.title'),
        description: t('specialists.toast.success.description'),
    });

    setIsSubmitting(false);
    setReferralNotes('');
    setIsReferralDialogOpen(false);
  };

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('specialists.header')}</h1>
        <p className="text-muted-foreground">{t('specialists.description')}</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </CardHeader>
              <CardContent className="text-center">
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : specialists && specialists.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {specialists.map((specialist) => (
            <Card key={specialist.id} className="flex flex-col">
              <CardHeader className="items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={specialist.imageUrl} alt={specialist.name} />
                  <AvatarFallback className="text-3xl">
                    <User />
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="flex-grow text-center">
                <CardTitle>{specialist.name}</CardTitle>
                <CardDescription>{specialist.specialty}</CardDescription>
                <p className="text-sm text-muted-foreground mt-1">{specialist.location}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleReferClick(specialist)}>
                  {t('specialists.buttons.refer')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center rounded-lg border border-dashed p-8">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">{t('specialists.noSpecialists')}</h3>
        </div>
      )}

      <Dialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('specialists.dialog.title')} {selectedSpecialist?.name}
            </DialogTitle>
            <DialogDescription>{t('specialists.dialog.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">{t('specialists.dialog.notes_label')}</Label>
              <Textarea
                id="notes"
                value={referralNotes}
                onChange={(e) => setReferralNotes(e.target.value)}
                placeholder={t('specialists.dialog.notes_placeholder')}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t('specialists.dialog.cancel')}</Button>
            </DialogClose>
            <Button onClick={handleSendReferral} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('specialists.dialog.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

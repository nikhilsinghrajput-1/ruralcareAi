'use client';

import { useEffect } from 'react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ShieldAlert, HeartPulse, Pill, Droplets, Users, Phone, PersonStanding, Home, Mail } from 'lucide-react';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EmergencyCardPageProps {
  setPageTitle?: (title: string) => void;
}

const InfoRow = ({ icon, label, value, isList = false }: { icon: React.ReactNode, label: string, value?: string | string[], isList?: boolean }) => {
    if (!value || (isList && Array.isArray(value) && value.length === 0)) return null;

    return (
        <div>
            <h4 className="text-sm font-semibold flex items-center text-muted-foreground">
                {icon}
                <span className="ml-2">{label}</span>
            </h4>
            {isList && Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2 mt-2">
                    {value.map((item, index) => (
                        <Badge key={index} variant="secondary">{item}</Badge>
                    ))}
                </div>
            ) : (
                <p className="text-lg font-bold text-foreground mt-1">{value}</p>
            )}
        </div>
    );
};


export default function EmergencyCardPage({ setPageTitle }: EmergencyCardPageProps) {
  const { t } = useAppTranslation();
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    setPageTitle?.(t('emergencyCard.header'));
  }, [t, setPageTitle]);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading } = useDoc(userDocRef);

  const getInitials = (name: string = '') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <main className="flex-1 p-4 md:p-8 flex justify-center items-start">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-destructive text-destructive-foreground p-6 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <ShieldAlert className="h-8 w-8" />
            {t('emergencyCard.title')}
          </CardTitle>
          <CardDescription className="text-destructive-foreground/80">
            {t('emergencyCard.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            {isLoading ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            ) : userProfile && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="h-24 w-24 border-4 border-destructive">
                            <AvatarImage src={user?.photoURL || undefined} alt={userProfile.name} />
                            <AvatarFallback className="text-4xl bg-muted">{getInitials(userProfile.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-3xl font-bold">{userProfile.name}</h2>
                            <p className="text-muted-foreground capitalize flex items-center gap-2 mt-1">
                                <PersonStanding className="h-4 w-4"/> {userProfile.role}
                            </p>
                        </div>
                    </div>
                    <Separator />

                     {/* Critical Medical Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoRow icon={<Droplets className="h-5 w-5"/>} label={t('emergencyCard.bloodType')} value={userProfile.bloodType} />
                        <InfoRow icon={<HeartPulse className="h-5 w-5"/>} label={t('emergencyCard.chronicConditions')} value={userProfile.chronicConditions} isList />
                        <InfoRow icon={<ShieldAlert className="h-5 w-5"/>} label={t('emergencyCard.allergies')} value={userProfile.allergies} isList />
                        <InfoRow icon={<Pill className="h-5 w-5"/>} label={t('emergencyCard.medications')} value={userProfile.currentMedications} isList />
                    </div>
                    <Separator />

                    {/* Contact Info */}
                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold">{t('emergencyCard.contactInfo.title')}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoRow icon={<Mail className="h-5 w-5"/>} label={t('emergencyCard.contactInfo.email')} value={userProfile.email} />
                            <InfoRow icon={<Home className="h-5 w-5"/>} label={t('emergencyCard.contactInfo.location')} value={userProfile.villageLocation} />
                        </div>
                    </div>
                    
                    {userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0 && (
                        <>
                         <Separator />
                         <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5"/>{t('emergencyCard.emergencyContacts.title')}</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userProfile.emergencyContacts.map((contact, index) => (
                                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                        <p className="font-bold">{contact.name} <Badge variant="outline" className="ml-2">{contact.relationship}</Badge></p>
                                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                            <Phone className="h-4 w-4" />{contact.phone}
                                        </p>
                                    </div>
                                ))}
                            </div>
                         </div>
                        </>
                    )}
                </div>
            )}
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={() => window.print()}>{t('emergencyCard.printButton')}</Button>
        </CardFooter>
      </Card>
    </main>
  );
}

    
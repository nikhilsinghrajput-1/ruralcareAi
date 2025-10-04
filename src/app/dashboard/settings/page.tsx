'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDoc, useFirestore, useUser, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Trash2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languages } from '@/lib/languages';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { Separator } from '@/components/ui/separator';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'A valid phone number is required'),
  relationship: z.string().min(2, 'Relationship is required'),
});

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional(),
  languagePreference: z.string().min(1, 'Language is required'),
  emergencyContacts: z.array(contactSchema).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface SettingsPageProps {
  setPageTitle?: (title: string) => void;
  t: (key: string) => string;
}

export default function SettingsPage({ setPageTitle, t: initialT }: SettingsPageProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t: contextT } = useAppTranslation();
  
  const t = initialT || contextT;

  useEffect(() => {
    setPageTitle?.(t('settings.header'));
  }, [t, setPageTitle]);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      languagePreference: 'en',
      emergencyContacts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'emergencyContacts'
  });

  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || user?.email || '',
        languagePreference: userProfile.languagePreference || 'en',
        emergencyContacts: userProfile.emergencyContacts || [],
      });
    }
  }, [userProfile, user, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!userDocRef) return;
    
    const updatedData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
    };

    updateDocumentNonBlocking(userDocRef, updatedData);

    toast({
      title: t('settings.toast.profileUpdated.title'),
      description: t('settings.toast.profileUpdated.description'),
    });
  }

  const handleAddContact = () => {
    const result = contactSchema.safeParse(newContact);
    if (result.success) {
        append(newContact);
        setNewContact({ name: '', phone: '', relationship: '' });
    } else {
        // Show validation errors, e.g., using toast
        toast({
            variant: "destructive",
            title: "Invalid Contact",
            description: "Please fill all fields for the new contact."
        })
    }
  }

  const isLoading = isProfileLoading;

  return (
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>{t('settings.profile.title')}</CardTitle>
                        <CardDescription>{t('settings.profile.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('settings.form.firstName.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('settings.form.firstName.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t('settings.form.lastName.label')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('settings.form.lastName.placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('settings.form.email.label')}</FormLabel>
                                    <FormControl>
                                    <Input placeholder={t('settings.form.email.placeholder')} {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField control={form.control} name="languagePreference" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('settings.form.language.label')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder={t('settings.form.language.placeholder')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </>
                        )}
                    </CardContent>
                    <CardFooter>
                         <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('settings.form.submitButton')}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>{t('settings.emergencyContacts.title')}</CardTitle>
                  <CardDescription>{t('settings.emergencyContacts.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                 {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                 ) : (
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center justify-between gap-4 p-2 border rounded-lg">
                                <div className="flex-1">
                                    <p className="font-semibold">{field.name}</p>
                                    <p className="text-sm text-muted-foreground">{field.phone} - <span className="capitalize">{field.relationship}</span></p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                        ))}

                        {fields.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">{t('settings.emergencyContacts.noContacts')}</p>
                        )}
                    </div>
                 )}
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4 pt-6 border-t">
                  <h4 className="font-semibold">{t('settings.emergencyContacts.addContact.title')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                            placeholder={t('settings.emergencyContacts.addContact.namePlaceholder')}
                            value={newContact.name}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        />
                        <Input
                            placeholder={t('settings.emergencyContacts.addContact.phonePlaceholder')}
                            value={newContact.phone}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        />
                         <Input
                            placeholder={t('settings.emergencyContacts.addContact.relationshipPlaceholder')}
                            value={newContact.relationship}
                            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        />
                  </div>
                   <Button onClick={handleAddContact} className="self-start">
                        <UserPlus className="mr-2"/>
                        {t('settings.emergencyContacts.addContact.button')}
                    </Button>
              </CardFooter>
          </Card>
        </div>
      </main>
  );
}

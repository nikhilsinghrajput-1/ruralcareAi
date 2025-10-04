'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDoc, useFirestore, useUser, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Trash2, UserPlus, PlusCircle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languages } from '@/lib/languages';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

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
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface SettingsPageProps {
  setPageTitle?: (title: string) => void;
  t?: (key: string) => string;
}

const TagInput = ({ value = [], onChange, placeholder }: { value?: string[], onChange: (value: string[]) => void, placeholder: string }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            onChange([...value, inputValue.trim()]);
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <button type="button" onClick={() => removeTag(index)} className="ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
        </div>
    );
};

export default function SettingsPage({ setPageTitle, t: initialT }: SettingsPageProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useAppTranslation();

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
      bloodType: '',
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
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
        bloodType: userProfile.bloodType || '',
        allergies: userProfile.allergies || [],
        chronicConditions: userProfile.chronicConditions || [],
        currentMedications: userProfile.currentMedications || [],
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('settings.profile.title')}</CardTitle>
                        <CardDescription>{t('settings.profile.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
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
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('settings.medicalInfo.title')}</CardTitle>
                        <CardDescription>{t('settings.medicalInfo.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? <Skeleton className="h-40 w-full" /> : (
                            <>
                                <FormField
                                    control={form.control}
                                    name="bloodType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('settings.form.bloodType.label')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('settings.form.bloodType.placeholder')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(type => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="allergies"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('settings.form.allergies.label')}</FormLabel>
                                            <TagInput {...field} placeholder={t('settings.form.allergies.placeholder')} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="chronicConditions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('settings.form.chronicConditions.label')}</FormLabel>
                                            <TagInput {...field} placeholder={t('settings.form.chronicConditions.placeholder')} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="currentMedications"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('settings.form.medications.label')}</FormLabel>
                                            <TagInput {...field} placeholder={t('settings.form.medications.placeholder')} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </CardContent>
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
                        <Button type="button" onClick={handleAddContact} className="self-start">
                                <UserPlus className="mr-2"/>
                                {t('settings.emergencyContacts.addContact.button')}
                            </Button>
                    </CardFooter>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting || isLoading} size="lg">
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('settings.form.submitButton')}
                    </Button>
                </div>
            </form>
        </Form>
      </main>
  );
}

const X = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );

    
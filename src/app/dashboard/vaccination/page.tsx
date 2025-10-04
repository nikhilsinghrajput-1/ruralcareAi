'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { useAppTranslation } from '@/contexts/TranslationContext';
import { VACCINE_SCHEDULE, Vaccine } from '@/lib/vaccine-data';
import { UserVaccineRecord } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Syringe, Library, List, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const logVaccineSchema = z.object({
  vaccineId: z.string().min(1, 'Please select a vaccine.'),
  dateAdministered: z.date({
    required_error: "A date is required.",
  }),
});

interface VaccinationPageProps {
  setPageTitle?: (title: string) => void;
}

export default function VaccinationPage({ setPageTitle }: VaccinationPageProps) {
  const { t } = useAppTranslation();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setPageTitle?.(t('vaccination.header'));
  }, [t, setPageTitle]);

  const userVaccineRecordsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'user_profiles', user.uid, 'vaccine_records'), orderBy('dateAdministered', 'desc'));
  }, [user, firestore]);

  const { data: userRecords, isLoading: areRecordsLoading } = useCollection<UserVaccineRecord>(userVaccineRecordsQuery);

  const form = useForm<z.infer<typeof logVaccineSchema>>({
    resolver: zodResolver(logVaccineSchema),
  });

  async function onSubmit(values: z.infer<typeof logVaccineSchema>) {
    if (!user) return;
    
    const recordsCollection = collection(firestore, 'user_profiles', user.uid, 'vaccine_records');
    
    const newRecord: Omit<UserVaccineRecord, 'id'> = {
        vaccineId: values.vaccineId,
        dateAdministered: serverTimestamp(values.dateAdministered),
        status: 'completed'
    };
    
    addDocumentNonBlocking(recordsCollection, newRecord);
    
    toast({ title: t('vaccination.toast.recordAdded.title'), description: t('vaccination.toast.recordAdded.description') });
    form.reset();
    setIsDialogOpen(false);
  }

  const getVaccineNameById = (id: string) => {
    return VACCINE_SCHEDULE.find(v => v.id === id)?.name || id;
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3"><Syringe className="h-6 w-6"/>{t('vaccination.header')}</CardTitle>
          <CardDescription>{t('vaccination.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="records"><List className="mr-2"/>{t('vaccination.tabs.myRecords')}</TabsTrigger>
              <TabsTrigger value="library"><Library className="mr-2"/>{t('vaccination.tabs.vaccineLibrary')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="records" className="mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                       <div>
                         <CardTitle>{t('vaccination.myRecords.title')}</CardTitle>
                         <CardDescription>{t('vaccination.myRecords.description')}</CardDescription>
                       </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><Plus className="mr-2 h-4 w-4" />{t('vaccination.myRecords.logButton')}</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{t('vaccination.logDialog.title')}</DialogTitle>
                                    <DialogDescription>{t('vaccination.logDialog.description')}</DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField control={form.control} name="vaccineId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('vaccination.logDialog.form.vaccine.label')}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder={t('vaccination.logDialog.form.vaccine.placeholder')} /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {VACCINE_SCHEDULE.map(vaccine => (
                                                            <SelectItem key={vaccine.id} value={vaccine.id}>{vaccine.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name="dateAdministered" render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>{t('vaccination.logDialog.form.date.label')}</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>
                                                            {field.value ? format(field.value, "PPP") : <span>{t('vaccination.logDialog.form.date.placeholder')}</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>{t('vaccination.buttons.cancel')}</Button>
                                            <Button type="submit">{t('vaccination.buttons.log')}</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                       <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('vaccination.myRecords.table.vaccine')}</TableHead>
                                <TableHead>{t('vaccination.myRecords.table.date')}</TableHead>
                                <TableHead className="text-right">{t('vaccination.myRecords.table.status')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {areRecordsLoading && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                    </TableCell>
                                </TableRow>
                            )}
                            {!areRecordsLoading && userRecords && userRecords.length > 0 ? (
                                userRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{getVaccineNameById(record.vaccineId)}</TableCell>
                                    <TableCell>{format(record.dateAdministered.toDate(), 'PPP')}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="mr-1 h-3 w-3"/>
                                            {t('vaccination.status.completed')}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : !areRecordsLoading && (
                                <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="font-semibold">{t('vaccination.myRecords.noRecords.title')}</p>
                                        <p className="text-muted-foreground text-sm">{t('vaccination.myRecords.noRecords.description')}</p>
                                    </div>
                                </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="library" className="mt-6">
                 <Card>
                    <CardHeader>
                         <CardTitle>{t('vaccination.vaccineLibrary.title')}</CardTitle>
                         <CardDescription>{t('vaccination.vaccineLibrary.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {VACCINE_SCHEDULE.map(vaccine => (
                                <AccordionItem value={vaccine.id} key={vaccine.id}>
                                    <AccordionTrigger>{vaccine.name}</AccordionTrigger>
                                    <AccordionContent className="space-y-2">
                                        <p><span className="font-semibold">{t('vaccination.vaccineLibrary.protectsAgainst')}:</span> {vaccine.disease}</p>
                                        <p><span className="font-semibold">{t('vaccination.vaccineLibrary.targetGroup')}:</span> {vaccine.age}</p>
                                        <p className="text-muted-foreground">{vaccine.description}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                 </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

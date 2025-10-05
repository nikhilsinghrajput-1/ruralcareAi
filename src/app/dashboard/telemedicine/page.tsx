'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { createTelemedicineRoom } from '@/ai/flows/create-telemedicine-room';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video } from 'lucide-react';
import { TelemedicineSession, Specialist } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAppTranslation } from '@/contexts/TranslationContext';

const formSchema = z.object({
  specialistId: z.string().min(1, 'Specialist ID is required.'),
  description: z.string().min(10, 'Please describe the issue in at least 10 characters.'),
  sessionTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});


const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Completed':
      return <Badge variant="default" className="bg-green-700 hover:bg-green-700/90">{status}</Badge>;
    case 'Scheduled':
      return <Badge variant="secondary">{status}</Badge>;
    case 'Cancelled':
      return <Badge variant="destructive">{status}</Badge>;
    case 'Active':
        return <Badge variant="default" className="bg-blue-600 hover:bg-blue-600/90">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

interface TelemedicinePageProps {
  setPageTitle?: (title: string) => void;
}

export default function TelemedicinePage({ setPageTitle }: TelemedicinePageProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useAppTranslation();

  useEffect(() => {
    setPageTitle?.(t('telemedicine.header'));
  }, [t, setPageTitle]);

  const sessionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'telemedicine_sessions');
  }, [firestore, user]);

  const { data: sessions, isLoading } = useCollection<TelemedicineSession>(sessionsQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialistId: '',
      description: '',
      sessionTime: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!sessionsQuery || !user) {
        toast({
            variant: "destructive",
            title: t('telemedicine.toast.error.title'),
            description: t('telemedicine.toast.error.description')
        });
        return;
    };

    setIsSubmitting(true);
    
    try {
        // Check if specialist exists
        const specialistDocRef = doc(firestore, 'specialists', values.specialistId);
        const specialistDoc = await getDoc(specialistDocRef);
        if (!specialistDoc.exists()) {
             toast({ variant: "destructive", title: "Invalid Specialist ID", description: "The provided specialist ID does not exist." });
             setIsSubmitting(false);
             return;
        }

        // Create Daily.co room
        const room = await createTelemedicineRoom({ privacy: 'private' });

        const newSessionData: Omit<TelemedicineSession, 'id'> = {
            patientId: user.uid,
            chwId: '', // Will be populated by CHW later if needed
            specialistId: values.specialistId,
            sessionStartTime: new Date(values.sessionTime).toISOString(),
            sessionEndTime: new Date(new Date(values.sessionTime).getTime() + 30 * 60000).toISOString(), // Assume 30 min session
            status: 'Scheduled',
            roomUrl: room.url, // Save the room URL
        };
        
        // Save session to firestore
        addDocumentNonBlocking(sessionsQuery, newSessionData);
        
        toast({
            title: t('telemedicine.toast.sessionScheduled.title'),
            description: t('telemedicine.toast.sessionScheduled.description')
        });

        form.reset();
        setIsDialogOpen(false);
    } catch(error) {
        console.error("Error scheduling session:", error);
        toast({ variant: "destructive", title: "Scheduling Failed", description: "Could not create the video session. Please try again." });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleRowClick = (sessionId: string) => {
    router.push(`/dashboard/telemedicine/${sessionId}`);
  };

  return (
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>{t('telemedicine.sessions.title')}</CardTitle>
                <CardDescription>{t('telemedicine.sessions.description')}</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <Video className="mr-2 h-4 w-4"/>
                    {t('telemedicine.buttons.newSession')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('telemedicine.dialog.title')}</DialogTitle>
                  <DialogDescription>
                    {t('telemedicine.dialog.description')}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="specialistId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('telemedicine.form.specialistId.label')}</FormLabel>
                                <FormControl><Input placeholder={t('telemedicine.form.specialistId.placeholder')} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('telemedicine.form.reason.label')}</FormLabel>
                                <FormControl><Textarea placeholder={t('telemedicine.form.reason.placeholder')} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="sessionTime" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('telemedicine.form.dateTime.label')}</FormLabel>
                                <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">{t('telemedicine.buttons.cancel')}</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('telemedicine.buttons.schedule')}
                            </Button>
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
                  <TableHead className="hidden md:table-cell">{t('telemedicine.table.sessionId')}</TableHead>
                  <TableHead>{t('telemedicine.table.specialist')}</TableHead>
                  <TableHead>{t('telemedicine.table.startTime')}</TableHead>
                  <TableHead>{t('telemedicine.table.endTime')}</TableHead>
                  <TableHead>{t('telemedicine.table.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && sessions && sessions.length > 0 && sessions.map((session) => (
                  <TableRow key={session.id} onClick={() => handleRowClick(session.id)} className="cursor-pointer">
                    <TableCell className="font-medium hidden md:table-cell">{session.id}</TableCell>
                    <TableCell>{session.specialistId}</TableCell>
                    <TableCell>{new Date(session.sessionStartTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(session.sessionEndTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={session.status || 'Unknown'}/>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && (!sessions || sessions.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t('telemedicine.noSessions')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
  );
}

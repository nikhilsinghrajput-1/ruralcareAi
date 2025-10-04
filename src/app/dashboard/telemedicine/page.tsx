'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
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
import { AppHeader } from '@/components/common/AppHeader';
import { Loader2, Video } from 'lucide-react';
import { TelemedicineSession } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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

export default function TelemedicinePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'user_profiles', user.uid, 'telemedicine_sessions');
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
    if (!sessionsQuery) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not create session. User not authenticated."
        });
        return;
    };

    setIsSubmitting(true);

    const newSession = {
        patientId: user!.uid,
        chwId: '', // Will be populated by CHW later if needed
        specialistId: values.specialistId,
        sessionStartTime: new Date(values.sessionTime).toISOString(),
        sessionEndTime: new Date(new Date(values.sessionTime).getTime() + 30 * 60000).toISOString(), // Assume 30 min session
        status: 'Scheduled',
        chatTranscript: '',
        sessionOutcomes: '',
    };
    
    addDocumentNonBlocking(sessionsQuery, newSession)
    
    toast({
        title: "Session Scheduled",
        description: "Your telemedicine session has been successfully scheduled."
    });

    setIsSubmitting(false);
    form.reset();
    setIsDialogOpen(false);
  }

  const handleRowClick = (sessionId: string) => {
    router.push(`/dashboard/telemedicine/${sessionId}`);
  };

  return (
    <>
      <AppHeader pageTitle="Telemedicine" />
      <main className="flex-1 p-4 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Consultation Sessions</CardTitle>
                <CardDescription>Manage your video consultation sessions.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                    <Video className="mr-2 h-4 w-4"/>
                    Schedule New Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Session</DialogTitle>
                  <DialogDescription>
                    Fill in the details to schedule a new telemedicine session.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="specialistId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Specialist ID</FormLabel>
                                <FormControl><Input placeholder="Enter specialist's ID" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reason for Session</FormLabel>
                                <FormControl><Textarea placeholder="Briefly describe the health issue" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="sessionTime" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date and Time</FormLabel>
                                <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Schedule
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
                  <TableHead className="hidden md:table-cell">Session ID</TableHead>
                  <TableHead>Specialist</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Status</TableHead>
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
                      No telemedicine sessions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

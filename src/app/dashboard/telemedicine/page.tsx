'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
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

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Completed':
      return <Badge variant="default" className="bg-green-700 hover:bg-green-700/90">{status}</Badge>;
    case 'Scheduled':
      return <Badge variant="secondary">{status}</Badge>;
    case 'Cancelled':
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function TelemedicinePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const sessionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'user_profiles', user.uid, 'telemedicine_sessions');
  }, [firestore, user]);

  const { data: sessions, isLoading } = useCollection<TelemedicineSession>(sessionsQuery);

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
            <Button>
                <Video className="mr-2 h-4 w-4"/>
                Start New Session
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Specialist ID</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && sessions && sessions.length > 0 && sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.id}</TableCell>
                    <TableCell>{session.patientId}</TableCell>
                    <TableCell>{session.specialistId}</TableCell>
                    <TableCell>{new Date(session.sessionStartTime).toLocaleString()}</TableCell>
                    <TableCell>{new Date(session.sessionEndTime).toLocaleString()}</TableCell>
                    <TableCell>
                      {/* The status is not in the TelemedicineSession entity, will add it later */}
                      <Badge variant="secondary">Scheduled</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && (!sessions || sessions.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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


'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, Users, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface Patient {
    id: string;
    name: string;
    villageLocation: string;
    photoURL?: string;
}

interface ChwPatientsPageProps {
  setPageTitle?: (title: string) => void;
}

export default function ChwPatientsPage({ setPageTitle }: ChwPatientsPageProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    setPageTitle?.('My Patients');
  }, [setPageTitle]);

  const chwDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'user_profiles', user.uid);
  }, [user, firestore]);

  const { data: chwProfile, isLoading: isChwLoading } = useDoc(chwDocRef);

  const patientsQuery = useMemoFirebase(() => {
    if (!chwProfile?.assignedCoverageArea) return null;

    return query(
      collection(firestore, 'user_profiles'),
      where('role', '==', 'patient'),
      where('villageLocation', '==', chwProfile.assignedCoverageArea)
    );
  }, [firestore, chwProfile]);

  const { data: patients, isLoading: arePatientsLoading } = useCollection<Patient>(patientsQuery);

  const getInitials = (name: string = '') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  const isLoading = isChwLoading || arePatientsLoading;

  return (
    <main className="flex-1 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Patients</CardTitle>
          <CardDescription>
            A list of all patients in your assigned coverage area: <Badge>{chwProfile?.assignedCoverageArea || 'Loading...'}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Village / Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && patients && patients.length > 0 ? (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={patient.photoURL} />
                          <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{patient.villageLocation}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : !isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <p className="font-semibold">No patients found.</p>
                        <p className="text-muted-foreground text-sm">There are currently no patients assigned to your coverage area.</p>
                    </div>
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

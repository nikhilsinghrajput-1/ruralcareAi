'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Inbox, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Referral } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface SpecialistDashboardPageProps {
  setPageTitle?: (title: string) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">{status}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{status}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{status}</Badge>;
      case 'accepted':
          return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
};

export default function SpecialistDashboardPage({ setPageTitle }: SpecialistDashboardPageProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    setPageTitle?.('Referral Dashboard');
  }, [setPageTitle]);

  const referralsQuery = useMemoFirebase(() => {
    if (!user) return null;

    return query(
      collection(firestore, 'referrals'),
      where('specialistId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: referrals, isLoading } = useCollection<Referral>(referralsQuery);

  const updateReferralStatus = (referralId: string, status: 'accepted' | 'rejected' | 'completed') => {
    if (!firestore || !referralId) return;
    const referralRef = doc(firestore, 'referrals', referralId);
    updateDocumentNonBlocking(referralRef, { status });
  }

  const renderReferralsTable = (data: Referral[] | undefined, emptyMessage: string) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center border-dashed border-2 rounded-lg">
                <Inbox className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Referred</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div className="font-medium">{referral.patientName}</div>
                      <div className="text-sm text-muted-foreground">{referral.patientVillage}</div>
                    </TableCell>
                     <TableCell>
                      {referral.createdAt ? formatDistanceToNow(referral.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{referral.notes}</TableCell>
                    <TableCell><StatusBadge status={referral.status} /></TableCell>
                    <TableCell className="text-right">
                        {referral.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => updateReferralStatus(referral.id!, 'accepted')}><Check className="mr-2 h-4 w-4"/> Accept</Button>
                                <Button size="sm" variant="destructive" onClick={() => updateReferralStatus(referral.id!, 'rejected')}><X className="mr-2 h-4 w-4"/> Reject</Button>
                            </div>
                        )}
                        {referral.status === 'accepted' && (
                            <Button size="sm">View Case</Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
        </Table>
    );
  }

  const pendingReferrals = referrals?.filter(r => r.status === 'pending');
  const activeReferrals = referrals?.filter(r => r.status === 'accepted');
  const closedReferrals = referrals?.filter(r => r.status === 'completed' || r.status === 'rejected');


  return (
    <main className="flex-1 p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Incoming Referrals</CardTitle>
          <CardDescription>
            Manage new and ongoing patient consultations.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="flex items-center justify-center h-64">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                 </div>
            ) : (
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">
                            Pending
                            {pendingReferrals && pendingReferrals.length > 0 && <Badge className="ml-2">{pendingReferrals.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            Active Cases
                            {activeReferrals && activeReferrals.length > 0 && <Badge className="ml-2">{activeReferrals.length}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger value="closed">Closed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="pt-4">
                        {renderReferralsTable(pendingReferrals, 'No pending referrals.')}
                    </TabsContent>
                    <TabsContent value="active" className="pt-4">
                        {renderReferralsTable(activeReferrals, 'No active cases.')}
                    </TabsContent>
                    <TabsContent value="closed" className="pt-4">
                        {renderReferralsTable(closedReferrals, 'No closed cases.')}
                    </TabsContent>
                </Tabs>
            )}
        </CardContent>
      </Card>
    </main>
  );
}

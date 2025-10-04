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
import { Video } from 'lucide-react';

const sessions = [
  {
    id: 'SES-001',
    patient: 'John Doe',
    specialist: 'Dr. Emily Carter',
    specialty: 'Cardiology',
    date: '2024-08-15',
    status: 'Completed',
  },
  {
    id: 'SES-002',
    patient: 'Jane Smith',
    specialist: 'Dr. Ben Adams',
    specialty: 'Dermatology',
    date: '2024-08-20',
    status: 'Scheduled',
  },
  {
    id: 'SES-003',
    patient: 'Sam Wilson',
    specialist: 'Dr. Chloe Davis',
    specialty: 'Pediatrics',
    date: '2024-08-18',
    status: 'Scheduled',
  },
    {
    id: 'SES-004',
    patient: 'Maria Garcia',
    specialist: 'Dr. Frank Miller',
    specialty: 'Endocrinology',
    date: '2024-07-30',
    status: 'Completed',
  },
];

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
                  <TableHead>Patient</TableHead>
                  <TableHead>Specialist</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.id}</TableCell>
                    <TableCell>{session.patient}</TableCell>
                    <TableCell>{session.specialist}</TableCell>
                    <TableCell>{session.specialty}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={session.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

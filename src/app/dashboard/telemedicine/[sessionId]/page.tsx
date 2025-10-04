'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { AppHeader } from '@/components/common/AppHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TelemedicineSession } from '@/types';
import { Loader2, Send, Video, PhoneOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type ChatMessage = {
  id?: string;
  senderId: string;
  text: string;
  timestamp: any;
};

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

export default function SessionPage() {
  const { sessionId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sessionDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !sessionId) return null;
    // Assuming patient role for now. This will be updated for CHW/Specialist roles.
    return doc(firestore, 'user_profiles', user.uid, 'telemedicine_sessions', sessionId as string);
  }, [firestore, user, sessionId]);

  const { data: session, isLoading: isSessionLoading } = useDoc<TelemedicineSession>(sessionDocRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!sessionDocRef) return null;
    const messagesColRef = collection(sessionDocRef, 'messages');
    return query(messagesColRef, orderBy('timestamp', 'asc'));
  }, [sessionDocRef]);

  const { data: messages, isLoading: areMessagesLoading } = useCollection<ChatMessage>(messagesQuery);
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !sessionDocRef || !user) return;
    
    const messagesColRef = collection(sessionDocRef, 'messages');
    const messageData = {
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
    };
    
    addDocumentNonBlocking(messagesColRef, messageData);
    setNewMessage('');
  };

  if (isSessionLoading) {
    return (
      <div className="flex flex-col h-screen">
        <AppHeader pageTitle="Telemedicine Session" />
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col h-screen">
        <AppHeader pageTitle="Telemedicine Session" />
        <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Session not found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppHeader pageTitle="Telemedicine Session" />
      <main className="flex-1 p-4 md:p-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Live Consultation</span>
                        <StatusBadge status={session.status} />
                    </CardTitle>
                    <CardDescription>Specialist ID: {session.specialistId}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
                         <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
                         {hasCameraPermission === false && (
                            <Alert variant="destructive" className="absolute w-11/12 bottom-4">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>Please allow camera access to use this feature.</AlertDescription>
                            </Alert>
                         )}
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                             <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
                                 <Video />
                             </Button>
                              <Button size="icon" variant="destructive" className="rounded-full">
                                 <PhoneOff />
                             </Button>
                         </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <ScrollArea className="flex-1 h-96 pr-4" ref={chatContainerRef}>
              <div className="space-y-4">
                {areMessagesLoading && <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
                {messages?.map((msg) => (
                  <div key={msg.id} className={`flex gap-2.5 ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                    {msg.senderId !== user?.uid && <Avatar className="h-8 w-8"><AvatarFallback>S</AvatarFallback></Avatar>}
                    <div className={`rounded-lg px-3 py-2 text-sm max-w-[75%] ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {!areMessagesLoading && messages?.length === 0 && <p className="text-center text-sm text-muted-foreground pt-4">No messages yet. Start the conversation!</p>}
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-auto pt-4 border-t">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!user}
              />
              <Button onClick={handleSendMessage} disabled={!user || !newMessage.trim()}><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

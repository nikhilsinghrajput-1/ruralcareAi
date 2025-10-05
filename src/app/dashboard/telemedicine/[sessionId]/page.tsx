'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TelemedicineSession } from '@/types';
import { Loader2, Send, Mic, MicOff, Video, VideoOff, Phone, ScreenShare, ScreenShareOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Daily, { DailyCall, DailyParticipant, DailyEventObject } from '@daily-co/daily-js';

type ChatMessage = {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
};

const ParticipantTile = ({ participant }: { participant: DailyParticipant }) => {
    return (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {participant.video ? (
                <video
                    autoPlay
                    playsInline
                    muted={participant.local}
                    className="w-full h-full object-cover"
                    ref={videoEl => {
                        if (videoEl && participant.videoTrack) {
                            videoEl.srcObject = new MediaStream([participant.videoTrack]);
                        }
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                        <AvatarFallback className="text-3xl">{participant.user_name?.substring(0, 2) || '?'}</AvatarFallback>
                    </Avatar>
                </div>
            )}
             <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">{participant.user_name}</div>
        </div>
    );
};

export default function SessionPage() {
  const { sessionId } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [newMessage, setNewMessage] = useState('');
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [participants, setParticipants] = useState<Record<string, DailyParticipant>>({});
  const [callState, setCallState] = useState<'idle' | 'joining' | 'joined' | 'left' | 'error'>('idle');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sessionDocRef = useMemoFirebase(() => {
    if (!user || !firestore || !sessionId) return null;
    return doc(firestore, 'telemedicine_sessions', sessionId as string);
  }, [firestore, user, sessionId]);

  const { data: session, isLoading: isSessionLoading } = useDoc<TelemedicineSession>(sessionDocRef);

  const messagesQuery = useMemoFirebase(() => {
    if (!sessionDocRef) return null;
    return query(collection(sessionDocRef, 'messages'), orderBy('timestamp', 'asc'));
  }, [sessionDocRef]);

  const { data: messages, isLoading: areMessagesLoading } = useCollection<ChatMessage>(messagesQuery);
  
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const joinCall = useCallback(() => {
    if (!session?.roomUrl || !user?.displayName) return;

    setCallState('joining');

    const co = Daily.createCallObject();

    co.on('joined-meeting', (event) => {
        setCallState('joined');
        setParticipants(co.participants());
    });

    co.on('participant-joined', (event) => setParticipants(prev => ({...prev, [event.participant.session_id]: event.participant})));
    co.on('participant-updated', (event) => setParticipants(prev => ({...prev, [event.participant.session_id]: event.participant})));
    co.on('participant-left', (event) => setParticipants(prev => {
        const newParts = {...prev};
        delete newParts[event.participant.session_id];
        return newParts;
    }));

    co.on('left-meeting', () => {
        setCallState('left');
        co.destroy();
    });

    co.on('error', (event) => {
        console.error('Daily.co error:', event);
        setCallState('error');
        toast({ variant: 'destructive', title: 'Video Call Error', description: event.errorMsg });
    });

    co.join({ url: session.roomUrl, userName: user.displayName }).catch(err => {
        console.error('Failed to join call:', err);
        setCallState('error');
    });

    setCallObject(co);

  }, [session, user, toast]);

  const leaveCall = () => {
    callObject?.leave();
  }

  useEffect(() => {
    return () => {
      callObject?.destroy();
    }
  }, [callObject]);


  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !sessionDocRef || !user) return;
    
    const messagesColRef = collection(sessionDocRef, 'messages');
    const messageData = {
        senderId: user.uid,
        senderName: user.displayName || 'User',
        text: newMessage,
        timestamp: serverTimestamp(),
    };
    
    addDocumentNonBlocking(messagesColRef, messageData);
    setNewMessage('');
  };

  const localParticipant = Object.values(participants).find(p => p.local);
  const remoteParticipants = Object.values(participants).filter(p => !p.local);

  if (isSessionLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Session not found.</p>
      </main>
    );
  }


  return (
    <main className="flex-1 p-4 md:p-8 grid gap-8 md:grid-cols-3 h-[calc(100vh-4rem)]">
        <div className="md:col-span-2 flex flex-col gap-8">
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Live Consultation</span>
                    </CardTitle>
                    <CardDescription>Specialist ID: {session.specialistId}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center relative">
                    {callState === 'idle' || callState === 'left' ? (
                         <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">Session Ready</h3>
                            <p className="text-muted-foreground mb-4">Click below to join the video consultation.</p>
                            <Button onClick={joinCall} size="lg">Join Call</Button>
                         </div>
                    ) : callState === 'joining' ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p>Joining session...</p>
                        </div>
                    ) : callState === 'joined' ? (
                        <div className="w-full h-full grid grid-cols-2 gap-4">
                           {localParticipant && <ParticipantTile participant={localParticipant} />}
                           {remoteParticipants.map(p => <ParticipantTile key={p.session_id} participant={p} />)}
                           {remoteParticipants.length === 0 && <div className="bg-muted rounded-lg flex items-center justify-center"><p className="text-muted-foreground">Waiting for others to join...</p></div>}
                        </div>
                    ) : (
                         <Alert variant="destructive">
                            <AlertTitle>Connection Error</AlertTitle>
                            <AlertDescription>Could not connect to the video session. Please check your connection and try again.</AlertDescription>
                        </Alert>
                    )}
                     {callState === 'joined' && callObject && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-full">
                             <Button size="icon" variant="outline" className="rounded-full" onClick={() => callObject.setLocalAudio(!callObject.localAudio())}>
                                 {callObject.localAudio() ? <Mic /> : <MicOff />}
                             </Button>
                             <Button size="icon" variant="outline" className="rounded-full" onClick={() => callObject.setLocalVideo(!callObject.localVideo())}>
                                 {callObject.localVideo() ? <Video /> : <VideoOff />}
                             </Button>
                             <Button size="icon" variant="destructive" className="rounded-full" onClick={leaveCall}>
                                 <Phone />
                             </Button>
                         </div>
                     )}
                </CardContent>
            </Card>
        </div>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-4" ref={chatContainerRef}>
              <div className="space-y-4">
                {areMessagesLoading && <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
                {messages?.map((msg) => (
                  <div key={msg.id} className={`flex flex-col gap-1 ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}>
                     <p className="text-xs text-muted-foreground">{msg.senderName}</p>
                     <div className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${msg.senderId === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
                disabled={!user || callState !== 'joined'}
              />
              <Button onClick={handleSendMessage} disabled={!user || !newMessage.trim() || callState !== 'joined'}><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
    </main>
  );
}

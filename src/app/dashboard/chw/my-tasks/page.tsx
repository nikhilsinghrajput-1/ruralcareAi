'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, isPast } from 'date-fns';
import { CalendarIcon, ClipboardList, Flag, Loader2, Plus, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const taskSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  patientId: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.date().optional(),
  description: z.string().optional(),
});

const priorityMap = {
    High: { icon: Flag, color: 'text-red-500' },
    Medium: { icon: Flag, color: 'text-yellow-500' },
    Low: { icon: Flag, color: 'text-gray-400' },
};

interface ChwTasksPageProps {
  setPageTitle?: (title: string) => void;
}

export default function ChwTasksPage({ setPageTitle }: ChwTasksPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    setPageTitle?.('My Tasks');
  }, [setPageTitle]);

  const tasksQuery = useMemoFirebase(() => {
    if (!user) return null;
    const tasksCollection = collection(firestore, 'user_profiles', user.uid, 'tasks');
    return query(tasksCollection, orderBy('createdAt', 'desc'));
  }, [user, firestore]);

  const { data: tasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', priority: 'Medium' },
  });

  const handleTaskChecked = (task: Task, checked: boolean) => {
    if (!user || !task.id) return;
    const taskRef = doc(firestore, 'user_profiles', user.uid, 'tasks', task.id);
    updateDocumentNonBlocking(taskRef, { status: checked ? 'completed' : 'pending' });
  };

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!user) return;
    
    const tasksCollection = collection(firestore, 'user_profiles', user.uid, 'tasks');
    
    const newTask: Omit<Task, 'id'> = {
        ...values,
        status: 'pending',
        createdAt: serverTimestamp(),
    };
    
    addDocumentNonBlocking(tasksCollection, newTask);
    
    toast({ title: 'Task Created', description: 'The new task has been added to your list.' });
    form.reset({ title: '', priority: 'Medium' });
    setIsDialogOpen(false);
  }
  
  const pendingTasks = tasks?.filter(t => t.status === 'pending' && (!t.dueDate || !isPast(t.dueDate.toDate())));
  const overdueTasks = tasks?.filter(t => t.status === 'pending' && t.dueDate && isPast(t.dueDate.toDate()));
  const completedTasks = tasks?.filter(t => t.status === 'completed');

  const renderTaskList = (taskList: Task[] | undefined, emptyMessage: string) => {
    if (areTasksLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    if (!taskList || taskList.length === 0) return <div className="text-center text-muted-foreground p-8">{emptyMessage}</div>;

    return (
        <div className="space-y-3">
            {taskList.map(task => {
                const PriorityIcon = priorityMap[task.priority].icon;
                return (
                    <div key={task.id} className="flex items-center gap-4 p-3 bg-card rounded-md border">
                        <Checkbox 
                            id={`task-${task.id}`}
                            checked={task.status === 'completed'}
                            onCheckedChange={(checked) => handleTaskChecked(task, checked as boolean)}
                        />
                        <div className="flex-1">
                            <label htmlFor={`task-${task.id}`} className={cn("font-medium", task.status === 'completed' && 'line-through text-muted-foreground')}>{task.title}</label>
                            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                        </div>
                         <div className="flex items-center gap-4">
                            {task.dueDate && <Badge variant={isPast(task.dueDate.toDate()) && task.status !== 'completed' ? 'destructive' : 'outline'} className="hidden sm:flex">{format(task.dueDate.toDate(), 'MMM d')}</Badge>}
                            <PriorityIcon className={cn('h-5 w-5', priorityMap[task.priority].color)} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <main className="flex-1 p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Manage your daily activities and follow-ups.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Fill out the details for your new task.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="priority" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="dueDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date (Optional)</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}/>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Task</Button>
                    </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todo">
            <TabsList>
              <TabsTrigger value="todo">
                To-Do 
                {pendingTasks && pendingTasks.length > 0 && <Badge className="ml-2">{pendingTasks.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="overdue">
                <AlertCircle className="mr-2 h-4 w-4 text-destructive" /> Overdue
                 {overdueTasks && overdueTasks.length > 0 && <Badge variant="destructive" className="ml-2">{overdueTasks.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="todo" className="pt-4">
                {renderTaskList(pendingTasks, "You're all caught up!")}
            </TabsContent>
            <TabsContent value="overdue" className="pt-4">
                 {renderTaskList(overdueTasks, "No overdue tasks.")}
            </TabsContent>
            <TabsContent value="completed" className="pt-4">
                 {renderTaskList(completedTasks, "No tasks completed yet.")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
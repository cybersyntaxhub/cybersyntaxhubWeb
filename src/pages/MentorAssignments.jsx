import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ClipboardList, Plus, CheckCircle, Clock, Star, ExternalLink } from 'lucide-react';
import moment from 'moment';

export default function MentorAssignments() {
  const { currentUser } = useAppAuth();
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [studentId, setStudentId] = useState('');
  const [creating, setCreating] = useState(false);
  const [gradingId, setGradingId] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [asgn, studs] = await Promise.all([
      base44.entities.Assignment.filter({ mentor_id: currentUser.id }, '-created_date'),
      base44.entities.AppUser.filter({ role: 'student', status: 'accepted' }),
    ]);
    setAssignments(asgn);
    setStudents(studs);
    setLoading(false);
  };

  const handleCreate = async () => {
    setCreating(true);
    const student = students.find(s => s.id === studentId);
    await base44.entities.Assignment.create({
      title, description, due_date: dueDate || undefined,
      mentor_id: currentUser.id,
      student_id: studentId,
      student_name: student?.full_name || '',
    });
    toast({ title: 'Assignment created!' });
    setTitle(''); setDescription(''); setDueDate(''); setStudentId(''); setShowForm(false);
    setCreating(false);
    load();
  };

  const handleGrade = async (id) => {
    await base44.entities.Assignment.update(id, { status: 'graded', grade, feedback });
    toast({ title: 'Assignment graded!' });
    setGradingId(null); setGrade(''); setFeedback('');
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm">
          <Plus className="w-4 h-4 mr-1" /> Assign Work
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-white/5 bg-card mb-6 space-y-4">
          <div>
            <Label>Student</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger className="mt-1 bg-background border-white/10"><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Assignment title" className="mt-1 bg-background border-white/10" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the assignment..." className="mt-1 bg-background border-white/10 min-h-[80px]" />
          </div>
          <div>
            <Label>Due Date (optional)</Label>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="mt-1 bg-background border-white/10" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={creating || !title || !studentId || !description} className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm">
              {creating ? 'Creating...' : 'Create Assignment'}
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)} className="text-sm">Cancel</Button>
          </div>
        </motion.div>
      )}

      {assignments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No assignments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-white/5 bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-xs text-muted-foreground">Assigned to: {a.student_name} · {a.due_date ? `Due: ${moment(a.due_date).format('MMM D')}` : 'No due date'}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  a.status === 'assigned' ? 'bg-yellow-500/10 text-yellow-400' :
                  a.status === 'submitted' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {a.status === 'assigned' && <Clock className="w-3 h-3" />}
                  {a.status === 'submitted' && <CheckCircle className="w-3 h-3" />}
                  {a.status === 'graded' && <Star className="w-3 h-3" />}
                  {a.status}
                </span>
              </div>

              {a.status === 'submitted' && (
                <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-sm mb-1 font-medium text-blue-400">Student Submission</p>
                  <p className="text-sm text-muted-foreground">{a.submission_text}</p>
                  {a.submission_url && (
                    <a href={a.submission_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400 mt-2 hover:underline">
                      Attached file <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {gradingId === a.id ? (
                    <div className="mt-3 space-y-2">
                      <Input value={grade} onChange={e => setGrade(e.target.value)} placeholder="Grade (e.g., A+, 95%)" className="bg-background border-white/10 text-sm" />
                      <Textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Feedback..." className="bg-background border-white/10 text-sm min-h-[60px]" />
                      <div className="flex gap-2">
                        <Button onClick={() => handleGrade(a.id)} disabled={!grade} className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm">Submit Grade</Button>
                        <Button variant="ghost" onClick={() => setGradingId(null)} className="text-sm">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setGradingId(a.id)} className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm">Grade</Button>
                  )}
                </div>
              )}

              {a.status === 'graded' && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-sm font-medium text-emerald-400">Grade: {a.grade}</p>
                  {a.feedback && <p className="text-sm text-muted-foreground mt-1">{a.feedback}</p>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
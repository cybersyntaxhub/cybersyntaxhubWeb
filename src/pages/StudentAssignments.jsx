import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ClipboardList, Upload, CheckCircle, Clock, Star } from 'lucide-react';
import moment from 'moment';

export default function StudentAssignments() {
  const { currentUser } = useAppAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [submitText, setSubmitText] = useState('');
  const [submitFile, setSubmitFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const data = await base44.entities.Assignment.filter({ student_id: currentUser.id }, '-created_date');
    setAssignments(data);
    setLoading(false);
  };

  const handleSubmit = async (id) => {
    setSubmitting(true);
    let submission_url = '';
    if (submitFile) {
      const result = await base44.integrations.Core.UploadFile({ file: submitFile });
      submission_url = result.file_url;
    }
    await base44.entities.Assignment.update(id, {
      status: 'submitted',
      submission_text: submitText,
      submission_url,
    });
    toast({ title: 'Assignment Submitted!' });
    setExpandedId(null);
    setSubmitText('');
    setSubmitFile(null);
    setSubmitting(false);
    loadAssignments();
  };

  const statusBadge = (status) => {
    const styles = {
      assigned: 'bg-yellow-500/10 text-yellow-400',
      submitted: 'bg-blue-500/10 text-blue-400',
      graded: 'bg-emerald-500/10 text-emerald-400',
    };
    const icons = { assigned: Clock, submitted: CheckCircle, graded: Star };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="w-3 h-3" /> {status}
      </span>
    );
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Assignments</h1>
      {assignments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No assignments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/5 bg-card overflow-hidden"
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              >
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  {a.due_date && <p className="text-xs text-muted-foreground mt-1">Due: {moment(a.due_date).format('MMM D, YYYY')}</p>}
                </div>
                {statusBadge(a.status)}
              </div>

              {expandedId === a.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-4 pb-4 border-t border-white/5">
                  <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">{a.description}</p>

                  {a.status === 'graded' && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-sm font-medium text-emerald-400">Grade: {a.grade}</p>
                      {a.feedback && <p className="text-sm text-muted-foreground mt-1">{a.feedback}</p>}
                    </div>
                  )}

                  {a.status === 'assigned' && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        value={submitText} onChange={e => setSubmitText(e.target.value)}
                        placeholder="Your submission..." className="bg-background border-white/10 min-h-[80px]"
                      />
                      <div className="flex items-center gap-3">
                        <input type="file" onChange={e => setSubmitFile(e.target.files[0])} className="text-sm text-muted-foreground" />
                        <Button
                          onClick={() => handleSubmit(a.id)}
                          disabled={submitting || !submitText.trim()}
                          className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm"
                        >
                          {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
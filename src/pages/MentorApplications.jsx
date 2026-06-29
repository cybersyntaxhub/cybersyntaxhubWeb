import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UserCheck, UserX, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import moment from 'moment';

export default function MentorApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { toast } = useToast();

  useEffect(() => { loadApps(); }, []);

  const loadApps = async () => {
    const data = await base44.entities.AppUser.filter({ role: 'student', status: 'pending' }, '-created_date');
    setApplications(data);
    setLoading(false);
  };

  const handleDecision = async (id, status) => {
    await base44.entities.AppUser.update(id, { status });
    toast({ title: status === 'accepted' ? 'Student Accepted!' : 'Application Rejected' });
    loadApps();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Applications</h1>
      {applications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No pending applications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/5 bg-card overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                    {app.full_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">{app.full_name}</p>
                    <p className="text-xs text-muted-foreground">{app.email} · {moment(app.created_date).fromNow()}</p>
                  </div>
                </div>
                {expandedId === app.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>

              <AnimatePresence>
                {expandedId === app.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3">
                      {app.bio && <div><p className="text-xs text-muted-foreground mb-1">Bio</p><p className="text-sm">{app.bio}</p></div>}
                      {app.interests?.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Interests</p>
                          <div className="flex gap-2 flex-wrap">
                            {app.interests.map(i => (
                              <span key={i} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">{i}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {app.experience_level && <div><p className="text-xs text-muted-foreground mb-1">Experience</p><p className="text-sm capitalize">{app.experience_level}</p></div>}
                      {app.goals && <div><p className="text-xs text-muted-foreground mb-1">Goals</p><p className="text-sm">{app.goals}</p></div>}
                      {app.resume_url && (
                        <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline">
                          <FileText className="w-4 h-4" /> View Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {app.linkedin_url && <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="block text-sm text-cyan-400 hover:underline">LinkedIn ↗</a>}
                      {app.github_url && <a href={app.github_url} target="_blank" rel="noopener noreferrer" className="block text-sm text-cyan-400 hover:underline">GitHub ↗</a>}

                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => handleDecision(app.id, 'accepted')} className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm">
                          <UserCheck className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button onClick={() => handleDecision(app.id, 'rejected')} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm">
                          <UserX className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
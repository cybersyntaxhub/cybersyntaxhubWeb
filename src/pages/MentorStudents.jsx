import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MentorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    base44.entities.AppUser.filter({ role: 'student', status: 'accepted' }, '-created_date').then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const removeStudent = async (student) => {
    if (!confirm(`Remove ${student.full_name}? This will delete all their assignments, messages, course progress, and account data.`)) return;
    setRemoving(student.id);
    try {
      await Promise.all([
        base44.entities.Assignment.deleteMany({ student_id: student.id }),
        base44.entities.Message.deleteMany({ sender_id: student.id }),
        base44.entities.Message.deleteMany({ receiver_id: student.id }),
        base44.entities.CourseProgress.deleteMany({ student_id: student.id }),
      ]);
      await base44.entities.AppUser.delete(student.id);
      setStudents(prev => prev.filter(s => s.id !== student.id));
    } catch (e) {
      alert('Failed to remove student. Please try again.');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Accepted Students</h1>
      {students.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No accepted students yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl border border-white/5 bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">
                  {s.full_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{s.full_name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </div>
                <Button
                  variant="ghost" size="icon"
                  className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                  disabled={removing === s.id}
                  onClick={() => removeStudent(s)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {s.interests?.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {s.interests.map(int => (
                    <span key={int} className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">{int}</span>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground capitalize">{s.experience_level} level</p>
              {s.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.bio}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
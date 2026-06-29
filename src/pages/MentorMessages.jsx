import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import ChatPanel from '@/components/ChatPanel';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MentorMessages() {
  const { currentUser } = useAppAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.AppUser.filter({ role: 'student', status: 'accepted' }).then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  if (selectedStudent) {
    return (
      <div className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3rem)] rounded-xl border border-white/5 bg-card overflow-hidden">
        <ChatPanel otherUser={selectedStudent} onBack={() => setSelectedStudent(null)} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {students.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No students to message yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedStudent(s)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-card hover:border-white/10 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                {s.full_name?.[0]}
              </div>
              <div>
                <p className="font-medium">{s.full_name}</p>
                <p className="text-xs text-muted-foreground">{s.email}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import ChatPanel from '@/components/ChatPanel';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentMessages() {
  const { currentUser } = useAppAuth();
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.AppUser.filter({ role: 'mentor' }).then(data => {
      setMentors(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  if (selectedMentor) {
    return (
      <div className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3rem)] rounded-xl border border-white/5 bg-card overflow-hidden">
        <ChatPanel otherUser={selectedMentor} onBack={() => setSelectedMentor(null)} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {mentors.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No mentors available.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {mentors.map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedMentor(m)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-card hover:border-white/10 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                {m.full_name?.[0]}
              </div>
              <div>
                <p className="font-medium">{m.full_name}</p>
                <p className="text-xs text-muted-foreground">{m.email}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
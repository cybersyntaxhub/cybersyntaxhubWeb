import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import moment from 'moment';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Announcement.list('-created_date', 50).then(data => {
      setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>
      {announcements.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl border border-white/5 bg-card"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{a.title}</h3>
                <span className="text-xs text-muted-foreground">{moment(a.created_date).fromNow()}</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.content}</p>
              {a.image_url && (
                <img src={a.image_url} alt="" className="mt-4 rounded-lg max-w-full max-h-80 object-cover" />
              )}
              <p className="text-xs text-muted-foreground mt-3">— {a.mentor_name || 'Mentor'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
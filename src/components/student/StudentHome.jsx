import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, Megaphone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentHome() {
  const { currentUser } = useAppAuth();
  const [stats, setStats] = useState({ announcements: 0, assignments: 0, courses: 0, messages: 0 });

  useEffect(() => {
    const load = async () => {
      const [ann, asgn, courses, msgs] = await Promise.all([
        base44.entities.Announcement.list('-created_date', 100),
        base44.entities.Assignment.filter({ student_id: currentUser.id }),
        base44.entities.Course.filter({ published: true }),
        base44.entities.Message.filter({ receiver_id: currentUser.id, read: false }),
      ]);
      setStats({ announcements: ann.length, assignments: asgn.length, courses: courses.length, messages: msgs.length });
    };
    load();
  }, []);

  const cards = [
    { label: 'Announcements', count: stats.announcements, icon: Megaphone, path: '/student/announcements', color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Assignments', count: stats.assignments, icon: ClipboardList, path: '/student/assignments', color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Courses', count: stats.courses, icon: BookOpen, path: '/student/courses', color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Unread Messages', count: stats.messages, icon: MessageCircle, path: '/student/messages', color: 'text-yellow-400 bg-yellow-500/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {currentUser?.full_name?.split(' ')[0]}</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening in your program.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Link key={card.label} to={card.path}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl border border-white/5 bg-card hover:border-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{card.count}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
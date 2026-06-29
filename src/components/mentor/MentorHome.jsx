import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { motion } from 'framer-motion';
import { UserCheck, Users, Megaphone, BookOpen, ClipboardList, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MentorHome() {
  const { currentUser } = useAppAuth();
  const [stats, setStats] = useState({ pending: 0, accepted: 0, announcements: 0, courses: 0, assignments: 0 });

  useEffect(() => {
    const load = async () => {
      const [pending, accepted, ann, courses, asgn] = await Promise.all([
        base44.entities.AppUser.filter({ role: 'student', status: 'pending' }),
        base44.entities.AppUser.filter({ role: 'student', status: 'accepted' }),
        base44.entities.Announcement.filter({ mentor_id: currentUser.id }),
        base44.entities.Course.filter({ mentor_id: currentUser.id }),
        base44.entities.Assignment.filter({ mentor_id: currentUser.id }),
      ]);
      setStats({ pending: pending.length, accepted: accepted.length, announcements: ann.length, courses: courses.length, assignments: asgn.length });
    };
    load();
  }, []);

  const cards = [
    { label: 'Pending Apps', count: stats.pending, icon: UserCheck, path: '/mentor/applications', color: 'text-yellow-400 bg-yellow-500/10' },
    { label: 'Active Students', count: stats.accepted, icon: Users, path: '/mentor/students', color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Announcements', count: stats.announcements, icon: Megaphone, path: '/mentor/announcements', color: 'text-cyan-400 bg-cyan-500/10' },
    { label: 'Courses', count: stats.courses, icon: BookOpen, path: '/mentor/courses', color: 'text-purple-400 bg-purple-500/10' },
    { label: 'Assignments', count: stats.assignments, icon: ClipboardList, path: '/mentor/assignments', color: 'text-blue-400 bg-blue-500/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your students, courses, and content.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <Link key={card.label} to={card.path}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
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
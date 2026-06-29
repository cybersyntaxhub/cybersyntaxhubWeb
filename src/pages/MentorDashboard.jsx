import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppAuth } from '@/lib/appAuth.jsx';
import DashboardSidebar from '@/components/DashboardSidebar';
import MobileSidebar from '@/components/MobileSidebar';
import { LayoutDashboard, UserCheck, Megaphone, ClipboardList, BookOpen, Users, MessageCircle } from 'lucide-react';
import MentorHome from '@/components/mentor/MentorHome';

const sidebarItems = [
  { path: '/mentor', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/mentor/applications', label: 'Applications', icon: UserCheck },
  { path: '/mentor/students', label: 'Students', icon: Users },
  { path: '/mentor/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/mentor/assignments', label: 'Assignments', icon: ClipboardList },
  { path: '/mentor/courses', label: 'Courses', icon: BookOpen },
  { path: '/mentor/messages', label: 'Messages', icon: MessageCircle },
];

export default function MentorDashboard() {
  const { currentUser, loading } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) navigate('/signin');
    if (!loading && currentUser?.role !== 'mentor') navigate('/student');
  }, [loading, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isRoot = location.pathname === '/mentor';

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <DashboardSidebar items={sidebarItems} />
      </div>
      <MobileSidebar items={sidebarItems} />
      <main className="flex-1 md:p-6 p-4 pt-16 md:pt-6 overflow-y-auto">
        {isRoot ? <MentorHome /> : <Outlet />}
      </main>
    </div>
  );
}
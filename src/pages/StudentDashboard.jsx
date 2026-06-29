import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppAuth } from '@/lib/appAuth.jsx';
import DashboardSidebar from '@/components/DashboardSidebar';
import MobileSidebar from '@/components/MobileSidebar';
import { LayoutDashboard, Megaphone, BookOpen, ClipboardList, MessageCircle } from 'lucide-react';
import StudentHome from '@/components/student/StudentHome';

const sidebarItems = [
  { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/student/courses', label: 'Courses', icon: BookOpen },
  { path: '/student/assignments', label: 'Assignments', icon: ClipboardList },
  { path: '/student/messages', label: 'Messages', icon: MessageCircle },
];

export default function StudentDashboard() {
  const { currentUser, loading, refreshUser } = useAppAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) navigate('/signin');
    if (!loading && currentUser?.role === 'mentor') navigate('/mentor');
  }, [loading, currentUser]);

  useEffect(() => {
    if (currentUser) refreshUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser?.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Pending</h2>
          <p className="text-muted-foreground">Your application is being reviewed by a mentor. You'll get access once accepted.</p>
          <button onClick={() => { refreshUser(); }} className="mt-6 text-cyan-400 text-sm hover:underline">Refresh Status</button>
        </div>
      </div>
    );
  }

  if (currentUser?.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-400">Application Not Accepted</h2>
          <p className="text-muted-foreground">Unfortunately your application was not accepted at this time.</p>
        </div>
      </div>
    );
  }

  const isRoot = location.pathname === '/student';

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <DashboardSidebar items={sidebarItems} />
      </div>
      <MobileSidebar items={sidebarItems} />
      <main className="flex-1 md:p-6 p-4 pt-16 md:pt-6 overflow-y-auto">
        {isRoot ? <StudentHome /> : <Outlet />}
      </main>
    </div>
  );
}
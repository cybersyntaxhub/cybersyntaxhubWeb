import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppAuth } from '@/lib/appAuth.jsx';
import DashboardSidebar from '@/components/DashboardSidebar';
import MobileSidebar from '@/components/MobileSidebar';
import { useToast } from '@/components/ui/use-toast';
import { LayoutDashboard, Megaphone, BookOpen, ClipboardList, MessageCircle, House, LogOut } from 'lucide-react';
import StudentHome from '@/components/student/StudentHome';

const sidebarItems = [
  { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/student/courses', label: 'Courses', icon: BookOpen },
  { path: '/student/assignments', label: 'Assignments', icon: ClipboardList },
  { path: '/student/messages', label: 'Messages', icon: MessageCircle },
];

export default function StudentDashboard() {
  const { currentUser, loading, refreshUser, logout, updateUser } = useAppAuth();
  const [reapplying, setReapplying] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) navigate('/signin');
    if (!loading && currentUser?.role === 'mentor') navigate('/mentor');
  }, [loading, currentUser, navigate]);

  useEffect(() => {
    if (currentUser) refreshUser();
  }, [currentUser, refreshUser]);

  const handleReapply = async () => {
    if (!currentUser) return;
    setReapplying(true);
    try {
      await updateUser(currentUser.id, { status: 'pending' });
      toast({ title: 'Reapplication Submitted', description: 'Your application has been reopened and is pending review.' });
    } catch (err) {
      toast({ title: 'Could not reapply', description: err.message || 'Please try again later.' });
    } finally {
      setReapplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser?.status === 'pending' || currentUser?.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {currentUser?.status === 'rejected' ? 'Application Not Accepted' : 'Application Pending'}
          </h2>
          <p className="text-muted-foreground">
            {currentUser?.status === 'rejected'
              ? 'Your application was not accepted at this time, but you can still explore the public site while we review next steps.'
              : 'Your student portal is still being reviewed. You can continue exploring the public site while mentors finish their review.'}
          </p>
          {currentUser?.status === 'rejected' && (
            <p className="mt-4 text-sm text-cyan-300">You can reopen your application and submit it for review again.</p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {currentUser?.status === 'rejected' && (
              <button
                onClick={handleReapply}
                disabled={reapplying}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm hover:bg-cyan-500/15 disabled:opacity-50"
              >
                {reapplying ? 'Reapplying…' : 'Reapply'}
              </button>
            )}
            <button onClick={() => { logout(); window.location.href = '/'; }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <button onClick={() => { window.location.href = '/'; }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
              <House className="w-4 h-4" /> Return Home
            </button>
          </div>
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
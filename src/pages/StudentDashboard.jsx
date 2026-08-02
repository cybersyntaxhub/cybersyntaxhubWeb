import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { currentCohort } from '@/lib/cohort';
import { base44 } from '@/api/base44Client';
import DashboardSidebar from '@/components/DashboardSidebar';
import MobileSidebar from '@/components/MobileSidebar';
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
  const { currentUser, loading, refreshUser, logout } = useAppAuth();
  const [reapplyLoading, setReapplyLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) navigate('/signin');
    if (!loading && currentUser?.role === 'mentor') navigate('/mentor');
  }, [loading, currentUser, navigate]);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleReapply = async () => {
    if (!currentUser) return;
    setReapplyLoading(true);
    try {
      await base44.entities.AppUser.update(currentUser.id, {
        status: 'pending',
        applied_cohort: currentCohort,
        next_cohort_eligible: false,
      });
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setReapplyLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) refreshUser();
  }, [currentUser, refreshUser]);

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
          <p className="text-muted-foreground mb-4">
            {currentUser?.status === 'rejected' ? (
              currentUser?.next_cohort_eligible ?
                `Your ${currentCohort} application was not accepted, but you have been marked eligible to reapply for the next cohort once it opens. Use the button below to resubmit your application.` :
                `Your ${currentCohort} application was not accepted at this time. Mentors may mark you eligible for a future cohort, and cohort updates will be shared through Announcements.`
            ) : 'Your student portal is still being reviewed. You can continue exploring the public site while mentors finish their review.'}
          </p>
          {currentUser?.status === 'rejected' && currentUser?.next_cohort_eligible && (
            <button
              onClick={handleReapply}
              disabled={reapplyLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-200 hover:bg-cyan-500/15 transition-colors"
            >
              {reapplyLoading ? 'Submitting...' : `Reapply for ${currentCohort}`}
            </button>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
              <House className="w-4 h-4" /> Return Home
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
              <LogOut className="w-4 h-4" /> Sign Out
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
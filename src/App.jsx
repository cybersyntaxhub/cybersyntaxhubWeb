import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { AppAuthProvider } from '@/lib/appAuth.jsx';

import Landing from '@/pages/Landing';
import Signup from '@/pages/Signup';
import Signin from '@/pages/Signin';
import StudentDashboard from '@/pages/StudentDashboard';
import StudentAnnouncements from '@/pages/StudentAnnouncements';
import StudentAssignments from '@/pages/StudentAssignments';
import StudentMessages from '@/pages/StudentMessages';
import StudentCourses from '@/pages/StudentCourses';
import MentorDashboard from '@/pages/MentorDashboard';
import MentorApplications from '@/pages/MentorApplications';
import MentorStudents from '@/pages/MentorStudents';
import MentorAnnouncements from '@/pages/MentorAnnouncements';
import MentorAssignments from '@/pages/MentorAssignments';
import MentorMessages from '@/pages/MentorMessages';
import MentorCourses from '@/pages/MentorCourses';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

      <Route path="/student" element={<StudentDashboard />}>
        <Route path="announcements" element={<StudentAnnouncements />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="courses" element={<StudentCourses />} />
      </Route>

      <Route path="/mentor" element={<MentorDashboard />}>
        <Route path="applications" element={<MentorApplications />} />
        <Route path="students" element={<MentorStudents />} />
        <Route path="announcements" element={<MentorAnnouncements />} />
        <Route path="assignments" element={<MentorAssignments />} />
        <Route path="messages" element={<MentorMessages />} />
        <Route path="courses" element={<MentorCourses />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppAuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AppAuthProvider>
    </AuthProvider>
  )
}

export default App
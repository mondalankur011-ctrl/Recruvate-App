import { useEffect } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppShell from '@/components/app/AppShell';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Onboarding from '@/pages/Onboarding';
import OnboardingDetails from '@/pages/onboarding/Details';
import OnboardingSocials from '@/pages/onboarding/Socials';
import OnboardingVideo from '@/pages/onboarding/Video';
import Landing from '@/pages/Landing';
import EmployerLogin from '@/pages/EmployerLogin';
import EmployerOnboarding from '@/pages/EmployerOnboarding';
import EmployerDashboard from '@/pages/EmployerDashboard';

const AuthenticatedApp = () => {
  const { user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Render the main app
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/employer/login" element={<EmployerLogin />} />
      <Route path="/employer/onboarding" element={<EmployerOnboarding />} />
      <Route path="/employer/dashboard" element={<EmployerDashboard />} />
      <Route path="/employer" element={<Navigate to="/employer/dashboard" replace />} />

      {/* Candidate Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* When not authenticated, visiting root shows Landing Page */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Landing />} />}>
        <Route path="/onboarding" element={<Onboarding />}>
          <Route index element={<Navigate to="details" replace />} />
          <Route path="details" element={<OnboardingDetails />} />
          <Route path="socials" element={<OnboardingSocials />} />
          <Route path="video" element={<OnboardingVideo />} />
        </Route>
        <Route element={<AppShell />}>
          <Route path="/" element={<></>} />
          <Route path="/process" element={<></>} />
          <Route path="/profile" element={<></>} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => document.documentElement.classList.toggle('dark', mql.matches);
    applyTheme();
    mql.addEventListener?.('change', applyTheme);
    return () => mql.removeEventListener?.('change', applyTheme);
  }, []);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

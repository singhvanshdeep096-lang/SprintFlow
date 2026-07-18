import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/common/Loader/Loader';

// Lazy-loaded pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Workspaces = lazy(() => import('../pages/workspace/Workspaces'));
const Projects = lazy(() => import('../pages/projects/Projects'));
const ProjectDetail = lazy(() => import('../pages/projects/ProjectDetail'));
const Board = lazy(() => import('../pages/board/Board'));
const Tasks = lazy(() => import('../pages/task/Tasks'));
const Notifications = lazy(() => import('../pages/notifications/Notifications'));
const Reports = lazy(() => import('../pages/reports/Reports'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const Settings = lazy(() => import('../pages/settings/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <Loader size="lg" text="Loading..." />
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/board" element={<Board />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

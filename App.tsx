import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/Admin';
import { Onboarding } from './components/Onboarding';
import { User, UserRole } from './types';
import { api } from './services/api';
import { AppointmentProvider } from './context/AppointmentContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Check for persisted session (Mock)
  useEffect(() => {
    const checkSession = async () => {
      // In a real app, verify JWT here
      setLoadingUser(false);
    };
    checkSession();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Check if user needs onboarding
    if (!loggedInUser.hasOnboarded && loggedInUser.role === UserRole.CLIENT) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = async () => {
    if (user) {
      await api.completeOnboarding(user.id);
      setUser({ ...user, hasOnboarded: true });
      setShowOnboarding(false);
    }
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // In real app, this would also PATCH to API
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loadingUser) return <div className="h-screen bg-darkveil-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <AppointmentProvider>
      <Router>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        
        <Routes>
          <Route 
            path="/" 
            element={
              !user ? (
                <Login onLogin={handleLogin} />
              ) : user.role === UserRole.ADMIN ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              user && user.role === UserRole.CLIENT ? (
                <Dashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          <Route 
            path="/admin" 
            element={
              user && user.role === UserRole.ADMIN ? (
                <AdminDashboard user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppointmentProvider>
  );
};

export default App;
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./pages/Login";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentJoin } from "./pages/StudentJoin";
import { Classroom } from "./pages/Classroom";
import { Navbar } from "./components/Navbar";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { User } from "./types";

const queryClient = new QueryClient();

type AppState = {
  currentView: 'login' | 'teacher-dashboard' | 'student-join' | 'classroom';
  currentClassId?: string;
}

const App = () => {
  const [user, setUser] = useLocalStorage<User | null>("currentUser", null);
  const [appState, setAppState] = useState<AppState>({
    currentView: user ? (user.role === 'teacher' ? 'teacher-dashboard' : 'student-join') : 'login'
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAppState({
      currentView: userData.role === 'teacher' ? 'teacher-dashboard' : 'student-join'
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAppState({ currentView: 'login' });
  };

  const handleJoinClass = (classId: string) => {
    setAppState({ 
      currentView: 'classroom',
      currentClassId: classId
    });
  };

  const handleLeaveClass = () => {
    if (user) {
      setAppState({
        currentView: user.role === 'teacher' ? 'teacher-dashboard' : 'student-join'
      });
    }
  };

  const renderCurrentView = () => {
    switch (appState.currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      
      case 'teacher-dashboard':
        return user ? (
          <TeacherDashboard user={user} onJoinClass={handleJoinClass} />
        ) : null;
      
      case 'student-join':
        return user ? (
          <StudentJoin user={user} onJoinClass={handleJoinClass} />
        ) : null;
      
      case 'classroom':
        return user && appState.currentClassId ? (
          <Classroom 
            user={user} 
            classId={appState.currentClassId} 
            onLeaveClass={handleLeaveClass}
          />
        ) : null;
      
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen">
          {user && appState.currentView !== 'login' && (
            <Navbar user={user} onLogout={handleLogout} />
          )}
          {renderCurrentView()}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

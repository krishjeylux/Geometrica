import { useState } from 'react';
import { User } from '../../App';
import { UserDashboard } from './user/UserDashboard';
import { UserMap } from './user/UserMap';
import { UserUpload } from './user/UserUpload';
import { UserReports } from './user/UserReports';
import { UserLeaderboard } from './user/UserLeaderboard';
import { UserProfile } from './user/UserProfile';
import { Home, Map, Upload, FileText, Trophy, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface UserPortalProps {
  user: User;
  onLogout: () => void;
}

type UserView = 'dashboard' | 'map' | 'upload' | 'reports' | 'leaderboard' | 'profile';

export function UserPortal({ user, onLogout }: UserPortalProps) {
  const [currentView, setCurrentView] = useState<UserView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard' as UserView, label: 'Home', icon: Home },
    { id: 'map' as UserView, label: 'Map', icon: Map },
    { id: 'upload' as UserView, label: 'Upload', icon: Upload },
    { id: 'reports' as UserView, label: 'My Reports', icon: FileText },
    { id: 'leaderboard' as UserView, label: 'Leaderboard', icon: Trophy },
    { id: 'profile' as UserView, label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-70 backdrop-blur-xl bg-white/5 border-r border-cyan-500/20 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-cyan-400">GEOMETRICA</h2>
                  <p className="text-xs text-gray-400">User Portal</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-cyan-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-cyan-500/20">
              <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400">Score: {user.credibilityScore}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={onLogout}
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="backdrop-blur-xl bg-white/5 border-b border-cyan-500/20 p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-cyan-400 hover:bg-cyan-500/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="text-xl text-white">
            {menuItems.find(item => item.id === currentView)?.label}
          </h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {currentView === 'dashboard' && <UserDashboard user={user} />}
          {currentView === 'map' && <UserMap />}
          {currentView === 'upload' && <UserUpload user={user} />}
          {currentView === 'reports' && <UserReports user={user} />}
          {currentView === 'leaderboard' && <UserLeaderboard currentUser={user} />}
          {currentView === 'profile' && <UserProfile user={user} />}
        </main>
      </div>
    </div>
  );
}

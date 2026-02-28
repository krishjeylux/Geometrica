import { useState } from 'react';
import { User } from '../../App';
import { AdminDashboard } from './admin/AdminDashboard';
import { AIVerification } from './admin/AIVerification';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { AdminAbout } from './admin/AdminAbout';
import { Home, Brain, BarChart3, Info, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPortalProps {
  user: User;
  onLogout: () => void;
}

type AdminView = 'dashboard' | 'verification' | 'analytics' | 'about';

export function AdminPortal({ user, onLogout }: AdminPortalProps) {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: Home },
    { id: 'verification' as AdminView, label: 'AI Verification', icon: Brain },
    { id: 'analytics' as AdminView, label: 'Analytics', icon: BarChart3 },
    { id: 'about' as AdminView, label: 'About Us', icon: Info },
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
            className="w-70 backdrop-blur-xl bg-white/5 border-r border-purple-500/20 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-purple-400">GEOMETRICA</h2>
                  <p className="text-xs text-gray-400">Admin Portal</p>
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
                        ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-purple-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400">System Admin</p>
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
        <header className="backdrop-blur-xl bg-white/5 border-b border-purple-500/20 p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-purple-400 hover:bg-purple-500/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="text-xl text-white">
            {menuItems.find(item => item.id === currentView)?.label}
          </h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {currentView === 'dashboard' && <AdminDashboard />}
          {currentView === 'verification' && <AIVerification />}
          {currentView === 'analytics' && <AdminAnalytics />}
          {currentView === 'about' && <AdminAbout />}
        </main>
      </div>
    </div>
  );
}

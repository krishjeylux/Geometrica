import { User } from '../../../App';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Award, TrendingUp, MapPin, CheckCircle, Trophy, Edit } from 'lucide-react';
import { motion } from 'motion/react';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const activityData = [
    { month: 'Jan', reports: 3 },
    { month: 'Feb', reports: 5 },
    { month: 'Mar', reports: 4 },
    { month: 'Apr', reports: 7 },
    { month: 'May', reports: 5 },
  ];

  const maxReports = Math.max(...activityData.map(d => d.reports));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-4xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h2 className="text-3xl text-white">{user.name}</h2>
                <Button variant="ghost" size="icon" className="text-cyan-400 hover:bg-cyan-500/10">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-400 mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className={
                      badge === 'gold'
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        : badge === 'silver'
                        ? 'bg-gray-400/20 text-gray-400 hover:bg-gray-400/20'
                        : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/20'
                    }
                  >
                    {badge} badge
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl text-cyan-400 mb-1">{user.credibilityScore}</div>
              <p className="text-gray-400">Credibility Score</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">{user.totalReports}</div>
            <p className="text-gray-400">Total Reports</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">{user.verifiedReports}</div>
            <p className="text-gray-400">Verified</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">{user.badges.length}</div>
            <p className="text-gray-400">Badges</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">#15</div>
            <p className="text-gray-400">Rank</p>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl text-white">Activity Graph</h3>
            </div>
            <div className="h-[200px] flex items-end justify-between gap-4">
              {activityData.map((data, index) => (
                <motion.div
                  key={data.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.reports / maxReports) * 100}%` }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg mb-2 relative group">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.reports} reports
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{data.month}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Badges Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl text-white">Badges & Achievements</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Bronze Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="aspect-square rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-600/20 border border-orange-500/30 flex flex-col items-center justify-center p-4"
              >
                <div className="text-4xl mb-2">🥉</div>
                <p className="text-xs text-orange-400 text-center">Bronze Reporter</p>
              </motion.div>

              {/* Silver Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
                className="aspect-square rounded-xl bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/30 flex flex-col items-center justify-center p-4"
              >
                <div className="text-4xl mb-2">🥈</div>
                <p className="text-xs text-gray-400 text-center">Silver Contributor</p>
              </motion.div>

              {/* Locked Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="aspect-square rounded-xl bg-white/5 border border-gray-600/30 flex flex-col items-center justify-center p-4 opacity-50"
              >
                <div className="text-4xl mb-2">🔒</div>
                <p className="text-xs text-gray-500 text-center">Gold Master</p>
              </motion.div>

              {/* Quick Reporter */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: 'spring' }}
                className="aspect-square rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex flex-col items-center justify-center p-4"
              >
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-xs text-cyan-400 text-center">Quick Reporter</p>
              </motion.div>

              {/* Accurate Eye */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
                className="aspect-square rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex flex-col items-center justify-center p-4"
              >
                <div className="text-4xl mb-2">👁️</div>
                <p className="text-xs text-purple-400 text-center">Accurate Eye</p>
              </motion.div>

              {/* Locked Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, type: 'spring' }}
                className="aspect-square rounded-xl bg-white/5 border border-gray-600/30 flex flex-col items-center justify-center p-4 opacity-50"
              >
                <div className="text-4xl mb-2">🔒</div>
                <p className="text-xs text-gray-500 text-center">Community Hero</p>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

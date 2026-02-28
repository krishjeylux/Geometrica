import { User } from '../../../App';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface UserLeaderboardProps {
  currentUser: User;
}

const mockLeaders = [
  { id: 1, name: 'Sarah Johnson', score: 2450, reports: 89, badge: 'gold', avatar: '🏆' },
  { id: 2, name: 'Mike Chen', score: 2180, reports: 76, badge: 'gold', avatar: '🥇' },
  { id: 3, name: 'Emma Davis', score: 1950, reports: 68, badge: 'silver', avatar: '🥈' },
  { id: 4, name: 'Alex Kumar', score: 1720, reports: 61, badge: 'silver', avatar: '⭐' },
  { id: 5, name: 'Lisa Anderson', score: 1580, reports: 55, badge: 'silver', avatar: '🌟' },
  { id: 6, name: 'John Smith', score: 1420, reports: 49, badge: 'bronze', avatar: '🥉' },
  { id: 7, name: 'Maria Garcia', score: 1280, reports: 45, badge: 'bronze', avatar: '💫' },
  { id: 8, name: 'David Lee', score: 1150, reports: 42, badge: 'bronze', avatar: '✨' },
  { id: 9, name: 'Sophie Martin', score: 980, reports: 38, badge: 'bronze', avatar: '🎖️' },
  { id: 10, name: 'Ryan Taylor', score: 850, reports: 32, badge: 'bronze', avatar: '🏅' },
];

export function UserLeaderboard({ currentUser }: UserLeaderboardProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-2xl text-white">Credibility Score Board</h2>
            <p className="text-gray-400">Top community contributors</p>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 items-end max-w-3xl mx-auto">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-gray-400/10 to-gray-500/10 border border-gray-400/30 p-6 text-center">
            <div className="text-4xl mb-2">{mockLeaders[1].avatar}</div>
            <div className="text-5xl mb-2">🥈</div>
            <h3 className="text-white mb-1">{mockLeaders[1].name}</h3>
            <p className="text-gray-400 text-sm mb-2">{mockLeaders[1].reports} reports</p>
            <p className="text-2xl text-gray-400">{mockLeaders[1].score}</p>
          </Card>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-amber-400/20 to-yellow-500/20 border border-amber-400/50 p-8 text-center relative">
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-8 h-8 text-amber-400" />
            </motion.div>
            <div className="text-5xl mb-2">{mockLeaders[0].avatar}</div>
            <div className="text-6xl mb-2">👑</div>
            <h3 className="text-white mb-1">{mockLeaders[0].name}</h3>
            <p className="text-amber-400 text-sm mb-2">{mockLeaders[0].reports} reports</p>
            <p className="text-3xl text-amber-400">{mockLeaders[0].score}</p>
          </Card>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-orange-400/10 to-amber-600/10 border border-orange-400/30 p-6 text-center">
            <div className="text-4xl mb-2">{mockLeaders[2].avatar}</div>
            <div className="text-5xl mb-2">🥉</div>
            <h3 className="text-white mb-1">{mockLeaders[2].name}</h3>
            <p className="text-gray-400 text-sm mb-2">{mockLeaders[2].reports} reports</p>
            <p className="text-2xl text-orange-400">{mockLeaders[2].score}</p>
          </Card>
        </motion.div>
      </div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20">
          <div className="p-6 border-b border-cyan-500/20">
            <h3 className="text-xl text-white">All Rankings</h3>
          </div>
          <div className="divide-y divide-cyan-500/10">
            {mockLeaders.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`p-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${
                  index < 3 ? 'bg-white/5' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500' :
                  index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-600' :
                  'bg-gradient-to-br from-cyan-500 to-purple-500'
                }`}>
                  {index < 3 ? leader.avatar : `#${index + 1}`}
                </div>

                <div className="flex-1">
                  <h4 className="text-white">{leader.name}</h4>
                  <p className="text-sm text-gray-400">{leader.reports} reports</p>
                </div>

                <div className="text-right">
                  <p className="text-xl text-cyan-400">{leader.score}</p>
                  <Badge
                    className={
                      leader.badge === 'gold'
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        : leader.badge === 'silver'
                        ? 'bg-gray-400/20 text-gray-400 hover:bg-gray-400/20'
                        : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/20'
                    }
                  >
                    {leader.badge}
                  </Badge>
                </div>

                {index < 3 && (
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Current User Position */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xl">{currentUser.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h4 className="text-white">Your Rank: #15</h4>
                <p className="text-sm text-gray-400">{currentUser.totalReports} reports</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl text-cyan-400">{currentUser.credibilityScore}</p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +50 this week
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

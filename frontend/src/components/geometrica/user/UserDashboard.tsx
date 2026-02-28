import { User } from '../../../App';
import { Card } from '../../ui/card';
import { MapPin, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface UserDashboardProps {
  user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const stats = [
    {
      label: 'Total Reports',
      value: user.totalReports,
      icon: MapPin,
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      label: 'Verified Reports',
      value: user.verifiedReports,
      icon: CheckCircle,
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      label: 'Credibility Score',
      value: user.credibilityScore,
      icon: TrendingUp,
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      label: 'Pending',
      value: user.totalReports - user.verifiedReports,
      icon: AlertTriangle,
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-500/20 to-orange-500/20',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      message: 'Pothole reported on Main Street',
      time: '2 hours ago',
      status: 'verified',
    },
    {
      id: 2,
      type: 'badge',
      message: 'Earned Silver Badge',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'repair',
      message: 'Pothole on 5th Avenue marked as repaired',
      time: '2 days ago',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-8"
      >
        <h2 className="text-3xl text-white mb-2">
          Welcome back, {user.name}! 👋
        </h2>
        <p className="text-gray-400">
          You're making a difference in your community. Keep reporting!
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient} border border-cyan-500/20 p-6 hover:scale-105 transition-transform`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Map Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
          <h3 className="text-xl text-white mb-4">Nearby Potholes</h3>
          <div className="h-[300px] bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl flex items-center justify-center border border-cyan-500/10">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
              <p className="text-gray-400">Map view with interactive pins</p>
              <p className="text-sm text-gray-500">Red = Pending • Green = Fixed</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
          <h3 className="text-xl text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-cyan-500/10 hover:bg-white/10 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'verified' ? 'bg-cyan-400' :
                  activity.status === 'completed' ? 'bg-green-400' :
                  'bg-amber-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white">{activity.message}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

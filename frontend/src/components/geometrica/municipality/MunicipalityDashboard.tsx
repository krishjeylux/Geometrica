import { Card } from '../../ui/card';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function MunicipalityDashboard() {
  const stats = [
    {
      label: 'Total Reports',
      value: 156,
      icon: AlertTriangle,
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-500/20 to-orange-500/20',
      change: '+12',
    },
    {
      label: 'Completed',
      value: 89,
      icon: CheckCircle,
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/20',
      change: '+8',
    },
    {
      label: 'In Progress',
      value: 34,
      icon: Clock,
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-500/20 to-blue-500/20',
      change: '+5',
    },
    {
      label: 'Pending',
      value: 33,
      icon: TrendingUp,
      gradient: 'from-red-400 to-pink-500',
      bgGradient: 'from-red-500/20 to-pink-500/20',
      change: '-1',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-8"
      >
        <h2 className="text-3xl text-white mb-2">Municipality Dashboard</h2>
        <p className="text-gray-400">Overview of pothole reports and repairs</p>
      </motion.div>

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
              <Card className={`backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient} border border-amber-500/20 p-6 hover:scale-105 transition-transform`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} this week
                  </span>
                </div>
                <div className="text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

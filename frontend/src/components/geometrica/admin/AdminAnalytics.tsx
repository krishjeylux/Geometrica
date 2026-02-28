import { Card } from '../../ui/card';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminAnalytics() {
  const monthlyData = [
    { month: 'Jan', reports: 120, verified: 110, completed: 95 },
    { month: 'Feb', reports: 145, verified: 138, completed: 120 },
    { month: 'Mar', reports: 165, verified: 155, completed: 140 },
    { month: 'Apr', reports: 180, verified: 172, completed: 158 },
    { month: 'May', reports: 156, verified: 148, completed: 135 },
  ];

  const maxValue = Math.max(...monthlyData.flatMap(d => [d.reports, d.verified, d.completed]));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl text-white">Analytics Dashboard</h2>
            <p className="text-gray-400">System-wide performance metrics</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Detection Rate</p>
                <p className="text-3xl text-white">95.2%</p>
              </div>
            </div>
            <p className="text-sm text-cyan-400">↑ 2.3% from last month</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
                <p className="text-3xl text-white">2.4 days</p>
              </div>
            </div>
            <p className="text-sm text-purple-400">↓ 0.5 days improved</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Completion Rate</p>
                <p className="text-3xl text-white">86.5%</p>
              </div>
            </div>
            <p className="text-sm text-green-400">↑ 3.1% from last month</p>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 p-6">
          <h3 className="text-xl text-white mb-6">Monthly Trends</h3>
          <div className="h-[300px] flex items-end justify-between gap-6">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end" style={{ height: '250px' }}>
                  {/* Reports */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.reports / maxValue) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Reports: {data.reports}
                    </div>
                  </motion.div>

                  {/* Verified */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.verified / maxValue) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Verified: {data.verified}
                    </div>
                  </motion.div>

                  {/* Completed */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.completed / maxValue) * 100}%` }}
                    transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                    className="flex-1 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg relative group"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Completed: {data.completed}
                    </div>
                  </motion.div>
                </div>
                <span className="text-sm text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-purple-500/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded" />
              <span className="text-sm text-gray-400">Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
              <span className="text-sm text-gray-400">Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded" />
              <span className="text-sm text-gray-400">Completed</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

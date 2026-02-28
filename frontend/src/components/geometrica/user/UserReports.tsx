import { User } from '../../../App';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { MapPin, Calendar, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface UserReportsProps {
  user: User;
}

const mockReports = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    location: 'Main Street & 5th Avenue',
    date: '2025-11-05',
    status: 'verified',
    severity: 'high',
    credibilityPoints: 10,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400',
    location: '42nd Street',
    date: '2025-11-04',
    status: 'pending',
    severity: 'medium',
    credibilityPoints: 5,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
    location: 'Park Avenue',
    date: '2025-11-03',
    status: 'completed',
    severity: 'low',
    credibilityPoints: 5,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    location: 'Broadway',
    date: '2025-11-02',
    status: 'in-progress',
    severity: 'high',
    credibilityPoints: 10,
  },
];

export function UserReports({ user }: UserReportsProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6"
      >
        <h2 className="text-2xl text-white mb-2">My Reports</h2>
        <p className="text-gray-400">Track all your pothole reports and their status</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 overflow-hidden hover:scale-105 transition-transform">
              <div className="relative h-48">
                <img
                  src={report.image}
                  alt="Pothole"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge
                    className={
                      report.status === 'pending'
                        ? 'bg-red-500/90 text-white hover:bg-red-500/90'
                        : report.status === 'completed'
                        ? 'bg-green-500/90 text-white hover:bg-green-500/90'
                        : report.status === 'in-progress'
                        ? 'bg-amber-500/90 text-white hover:bg-amber-500/90'
                        : 'bg-cyan-500/90 text-white hover:bg-cyan-500/90'
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{report.location}</span>
                  </div>
                  <Badge
                    className={
                      report.severity === 'high'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/20'
                        : report.severity === 'medium'
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                    }
                  >
                    {report.severity}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(report.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cyan-500/10">
                  <span className="text-cyan-400 text-sm">
                    +{report.credibilityPoints} points
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

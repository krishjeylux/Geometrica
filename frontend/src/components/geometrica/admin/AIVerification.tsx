import { useState } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Brain, CheckCircle, XCircle, MapPin, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface PendingReport {
  id: number;
  image: string;
  location: string;
  reportedBy: string;
  date: string;
  aiConfidence: number;
  aiSeverity: 'high' | 'medium' | 'low';
  aiInsights: {
    depth: number;
    width: number;
    riskScore: number;
  };
}

const mockPendingReports: PendingReport[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    location: 'Main Street & 5th Avenue',
    reportedBy: 'Sarah Johnson',
    date: '2025-11-06',
    aiConfidence: 96,
    aiSeverity: 'high',
    aiInsights: {
      depth: 5.05,
      width: 45.2,
      riskScore: 92,
    },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?w=400',
    location: '42nd Street',
    reportedBy: 'Mike Chen',
    date: '2025-11-06',
    aiConfidence: 94,
    aiSeverity: 'high',
    aiInsights: {
      depth: 5.50,
      width: 52.8,
      riskScore: 95,
    },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
    location: 'Park Avenue',
    reportedBy: 'Emma Davis',
    date: '2025-11-05',
    aiConfidence: 89,
    aiSeverity: 'medium',
    aiInsights: {
      depth: 3.85,
      width: 32.4,
      riskScore: 68,
    },
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    location: 'Broadway',
    reportedBy: 'Alex Kumar',
    date: '2025-11-05',
    aiConfidence: 85,
    aiSeverity: 'low',
    aiInsights: {
      depth: 2.95,
      width: 28.1,
      riskScore: 45,
    },
  },
];

export function AIVerification() {
  const [reports, setReports] = useState(mockPendingReports);

  const handleVerify = (id: number) => {
    setReports(reports.filter(r => r.id !== id));
    toast.success('Report verified and assigned to municipality');
  };

  const handleReject = (id: number) => {
    setReports(reports.filter(r => r.id !== id));
    toast.error('Report rejected and removed from queue');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-400" />
          <div>
            <h2 className="text-2xl text-white">AI Verification Queue</h2>
            <p className="text-gray-400">{reports.length} reports pending review</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 overflow-hidden hover:scale-105 transition-transform">
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={report.image}
                  alt="Pothole"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    className={`${
                      report.aiConfidence >= 90
                        ? 'bg-green-500/90 text-white hover:bg-green-500/90'
                        : report.aiConfidence >= 80
                        ? 'bg-amber-500/90 text-white hover:bg-amber-500/90'
                        : 'bg-red-500/90 text-white hover:bg-red-500/90'
                    }`}
                  >
                    {report.aiConfidence}% Confidence
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Location */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-white text-sm">{report.location}</p>
                      <p className="text-xs text-gray-400">{report.reportedBy}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      report.aiSeverity === 'high'
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/20'
                        : report.aiSeverity === 'medium'
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                    }
                  >
                    {report.aiSeverity}
                  </Badge>
                </div>

                {/* AI Insights */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400 mb-1">Depth</p>
                    <p className="text-sm text-cyan-400">{report.aiInsights.depth}cm</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400 mb-1">Width</p>
                    <p className="text-sm text-purple-400">{report.aiInsights.width}cm</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400 mb-1">Risk</p>
                    <p className="text-sm text-red-400">{report.aiInsights.riskScore}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-purple-500/10">
                  <Button
                    onClick={() => handleVerify(report.id)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                  <Button
                    onClick={() => handleReject(report.id)}
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {reports.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 p-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400">No reports pending AI verification</p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

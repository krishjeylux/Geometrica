import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

const mockPotholes = [
  { id: 1, lat: 40.7128, lng: -74.006, status: 'pending', severity: 'high', address: 'Main St & 5th Ave' },
  { id: 2, lat: 40.7138, lng: -74.007, status: 'verified', severity: 'medium', address: '42nd Street' },
  { id: 3, lat: 40.7118, lng: -74.005, status: 'completed', severity: 'low', address: 'Park Avenue' },
  { id: 4, lat: 40.7148, lng: -74.008, status: 'in-progress', severity: 'high', address: 'Broadway' },
  { id: 5, lat: 40.7108, lng: -74.004, status: 'pending', severity: 'medium', address: '7th Street' },
];

export function UserMap() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6"
      >
        <h2 className="text-2xl text-white mb-2">Pothole Map</h2>
        <p className="text-gray-400">Interactive map showing all reported potholes in your area</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6 h-[600px]">
            <div className="h-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl flex items-center justify-center border border-cyan-500/10 relative overflow-hidden">
              {/* Map Placeholder with Grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                    linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Mock Pins */}
              {mockPotholes.map((pothole, index) => (
                <motion.div
                  key={pothole.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 3) * 20}%`,
                  }}
                >
                  <MapPin
                    className={`w-8 h-8 ${
                      pothole.status === 'pending'
                        ? 'text-red-500'
                        : pothole.status === 'completed'
                        ? 'text-green-500'
                        : pothole.status === 'in-progress'
                        ? 'text-amber-500'
                        : 'text-cyan-500'
                    } drop-shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                  />
                </motion.div>
              ))}

              <div className="text-center z-10">
                <Navigation className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-gray-400">Interactive Map View</p>
                <p className="text-sm text-gray-500 mt-2">
                  Red = Pending • Cyan = Verified • Amber = In Progress • Green = Fixed
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Pothole List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
            <h3 className="text-xl text-white mb-4">Nearby Potholes</h3>
            <div className="space-y-3 max-h-[520px] overflow-y-auto custom-scrollbar">
              {mockPotholes.map((pothole) => (
                <div
                  key={pothole.id}
                  className="p-4 rounded-xl bg-white/5 border border-cyan-500/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">{pothole.address}</span>
                    </div>
                    <Badge
                      className={
                        pothole.status === 'pending'
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/20'
                          : pothole.status === 'completed'
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                          : pothole.status === 'in-progress'
                          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
                      }
                    >
                      {pothole.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        pothole.severity === 'high'
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/20'
                          : pothole.severity === 'medium'
                          ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                      }
                    >
                      {pothole.severity}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {pothole.lat.toFixed(4)}, {pothole.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
}

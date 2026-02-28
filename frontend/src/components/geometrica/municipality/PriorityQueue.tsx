import React, { useEffect, useState } from "react";
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { AlertTriangle, MapPin, Calendar, Brain, Ruler, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { fetchEvents } from "../../../lib/eventsApi";

interface BackendPotholeEvent {
  _id: string;
  location: {
    lat: number;
    lon: number;
  };
  vision: {
    avg_depth_est_cm: number;
  };
  priority: "high" | "medium" | "low";
  status: "pending" | "assigned" | "in-progress";
  createdAt: string;
}

// UI Model - frontend-only display shape
interface PotholeRowData {
  id: string;
  priority: "high" | "medium" | "low";
  location: string; // "lat, lon"
  aiInsights: string; // "Disparity: X"
  disparity: number;
  severity: "Low" | "Moderate" | "Severe";
  status: "pending" | "assigned" | "in-progress";
  date: string; // formatted date string
}

// Legacy interface for dialog (keeping for compatibility)
interface PotholeData {
  id: number;
  backendId?: string; // Backend _id for matching
  location: {
  lat: number;
  lon: number;
};
  address: string;
  reportedBy: string;
  date: string;
  status: 'pending' | 'assigned' | 'in-progress';
  severity: 'high' | 'medium' | 'low';
  image: string;
  aiVerified: boolean;
  aiInsights: {
    depth: number;
    width: number;
    confidence: number;
    damageLevel: string;
    estimatedRepairTime: string;
    riskScore: number;
  };
  priority?: "high" | "medium";
  vision?: {
    avg_depth_est_cm: number;
  };
  createdAt?: string;
}



export function PriorityQueue() {

  console.log("🔥 PriorityQueue component mounted");
  const [events, setEvents] = useState<BackendPotholeEvent[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedPothole, setSelectedPothole] =useState<PotholeData | null>(null);

  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'in-progress'>('all');
  useEffect(() => {
    console.log("🔄 useEffect: Fetching events...");
    fetchEvents()
      .then((data) => {
        console.log("📥 RAW API RESPONSE:", data);
        console.log("📥 API RESPONSE TYPE:", typeof data);
        console.log("📥 API RESPONSE IS ARRAY:", Array.isArray(data));
        console.log("📥 API RESPONSE LENGTH:", Array.isArray(data) ? data.length : "NOT AN ARRAY");
        if (Array.isArray(data) && data.length > 0) {
          console.log("📥 FIRST EVENT SAMPLE:", JSON.stringify(data[0], null, 2));
        }
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch events", err);
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

// Map backend events to UI model with safe optional chaining
console.log("🔍 MAPPING: events.length =", events.length);
console.log("🔍 MAPPING: events =", events);

const mappedPotholeRows: PotholeRowData[] = events
  .filter((e) => {
    const isValid = !!(e?._id && e?.location && e?.vision);
    if (!isValid) {
      console.warn("⚠️ Filtered out invalid event:", e);
    }
    return isValid;
  })
  .map((e) => {
    // Treat backend avg_depth_est_cm as disparity value
    const disparity = e?.vision?.avg_depth_est_cm ?? 0;
    const lat = e?.location?.lat ?? 0;
    const lon = e?.location?.lon ?? 0;
    const priority = e?.priority ?? "medium";
    // Normalize status - handle any string variations
    const rawStatus = (e?.status ?? "pending").toString().toLowerCase().trim();
    let status: "pending" | "assigned" | "in-progress";
    if (rawStatus === "assigned") {
      status = "assigned";
    } else if (rawStatus === "in-progress" || rawStatus === "in_progress") {
      status = "in-progress";
    } else {
      status = "pending";
    }
    const createdAt = e?.createdAt ?? new Date().toISOString();

    // Map disparity to severity
    let severity: "Low" | "Moderate" | "Severe";
    if (disparity > 8) {
      severity = "Severe";
    } else if (disparity > 5) {
      severity = "Moderate";
    } else {
      severity = "Low";
    }

    // Format date - handle both string and Date object from MongoDB
    let dateStr: string;
    try {
      if (createdAt instanceof Date) {
        dateStr = createdAt.toLocaleDateString();
      } else if (typeof createdAt === 'string') {
        dateStr = new Date(createdAt).toLocaleDateString();
      } else {
        dateStr = new Date().toLocaleDateString();
      }
    } catch (e) {
      console.warn("⚠️ Date parsing error for event:", e._id, createdAt);
      dateStr = new Date().toLocaleDateString();
    }

    return {
      id: e._id,
      priority,
      location: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      aiInsights: `Disparity: ${disparity.toFixed(2)}`,
      disparity,
      severity,
      status,
      date: dateStr,
    };
  });

console.log("🔍 MAPPED ROWS COUNT:", mappedPotholeRows.length);
console.log("🔍 MAPPED ROWS:", mappedPotholeRows);

const filteredPotholeRows = mappedPotholeRows.filter(
  (p) => {
    const matches = filter === "all" || p.status === filter;
    if (!matches) {
      console.log(`🔍 FILTERED OUT: status=${p.status}, filter=${filter}`);
    }
    return matches;
  }
);

console.log("🔍 FILTERED ROWS COUNT:", filteredPotholeRows.length);
console.log("🔍 CURRENT FILTER:", filter);

const sortedPotholeRows = [...filteredPotholeRows].sort((a, b) => {
  // Sort by disparity (higher first)
  return b.disparity - a.disparity;
});

console.log("🔍 SORTED ROWS COUNT:", sortedPotholeRows.length);
console.log("🔍 FINAL ROWS FOR RENDER:", sortedPotholeRows);

// Legacy mapping for dialog compatibility
const mappedPotholes: PotholeData[] = events
  .filter((e) => e?._id && e?.location && e?.vision)
  .map((e, index) => ({
    id: index + 1,
    backendId: e?._id,
    location: {
      lat: e?.location?.lat ?? 0,
      lon: e?.location?.lon ?? 0,
    },
    address: "Reported Location",
    reportedBy: "System",
    date: e?.createdAt ?? new Date().toISOString(),
    status: (e?.status ?? "pending") as "pending" | "assigned" | "in-progress",
    severity: (e?.priority ?? "medium") as "high" | "medium" | "low",
    image: "",
    aiVerified: true,
    aiInsights: {
      depth: e?.vision?.avg_depth_est_cm ?? 0, // now treated as disparity
      width: 0,
      confidence: 95,
      damageLevel: e?.priority === "high" ? "Critical" : "Moderate",
      estimatedRepairTime: "TBD",
      riskScore: e?.priority === "high" ? 90 : 65,
    },
    priority: e?.priority,
    vision: e?.vision,
    createdAt: e?.createdAt,
  }));






if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading pothole data...
      </div>
    );
  }
console.log("🟢 EVENTS:", events);
console.log("🟢 MAPPED ROWS:", mappedPotholeRows);
console.log("🟢 FILTERED ROWS:", filteredPotholeRows);
console.log("🟢 SORTED ROWS:", sortedPotholeRows);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-400" />
            <div>
              <h2 className="text-2xl text-white">Priority Queue</h2>
              <p className="text-gray-400">AI-sorted by risk level and severity</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'assigned', 'in-progress'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className={filter === status ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-500/30 text-amber-400'}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Priority Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-amber-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-amber-500/20">
                <tr>
                  <th className="text-left p-4 text-gray-400">Priority</th>
                  <th className="text-left p-4 text-gray-400">Location</th>
                  <th className="text-left p-4 text-gray-400">AI Insights (Disparity)</th>
                  <th className="text-left p-4 text-gray-400">Severity</th>
                  <th className="text-left p-4 text-gray-400">Status</th>
                  <th className="text-left p-4 text-gray-400">Date</th>
                  <th className="text-left p-4 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10">
            {sortedPotholeRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-amber-400/50" />
                    <p>No pothole events found</p>
                    <p className="text-xs">Events: {events.length} | Mapped: {mappedPotholeRows.length} | Filtered: {filteredPotholeRows.length} | Sorted: {sortedPotholeRows.length}</p>
                    <p className="text-xs">Filter: {filter}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedPotholeRows.map((row, index) => {
                // Find corresponding legacy data for dialog by backend ID
                const legacyData = mappedPotholes.find((p) => p.backendId === row.id) || mappedPotholes[0];
                
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedPothole(legacyData)}
                  >
                    {/* Priority Number */}
                    <td className="p-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index < 3 
                          ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white'
                          : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400'
                      }`}>
                        #{index + 1}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <div>
                          <p className="text-white">{row.location}</p>
                          <p className="text-xs text-gray-400">Reported via AI Detection</p>
                        </div>
                      </div>
                    </td>

                    {/* AI Insights */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-gray-400">{row.aiInsights}</span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="p-4">
                      <Badge
                        className={
                          row.severity === 'Severe'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/20'
                            : row.severity === 'Moderate'
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/20'
                        }
                      >
                        {row.severity}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <Badge
                        className={
                          row.status === 'pending'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/20'
                            : row.status === 'assigned'
                            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
                            : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{row.date}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPothole(legacyData);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedPothole} onOpenChange={() => setSelectedPothole(null)}>
        <DialogContent className="bg-[#1a1625] border-amber-500/30 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-amber-400">Pothole Details</DialogTitle>
          </DialogHeader>

                {selectedPothole && (
        <div className="space-y-6">

          {/* Location Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Location (GPS)</p>
              <p className="text-white">
                {selectedPothole.location.lat.toFixed(5)},{" "}
                {selectedPothole.location.lon.toFixed(5)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Reported On</p>
              <p className="text-white">
                {new Date(selectedPothole.createdAt ?? selectedPothole.date).toLocaleString()}
              </p>
            </div>
          </div>

          {/* AI Analysis */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg text-purple-400">AI Analysis</h3>

              <Badge className="bg-green-500/20 text-green-400 ml-auto">
                Verified
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-400">Disparity</span>
                </div>
                <p className="text-2xl text-cyan-400">
                  {(selectedPothole.vision?.avg_depth_est_cm ?? selectedPothole.aiInsights?.depth ?? 0).toFixed(2)}
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-400">Priority</span>
                </div>
                <p className="text-2xl text-red-400">
                  {(selectedPothole.priority ?? "medium").toUpperCase()}
                </p>
              </div>
            </div>
          </Card>

          {/* Status */}
          <div className="flex items-center gap-3">
            <Badge
              className={
                selectedPothole.status === "pending"
                  ? "bg-red-500/20 text-red-400"
                  : selectedPothole.status === "assigned"
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-amber-500/20 text-amber-400"
              }
            >
              {selectedPothole.status}
            </Badge>
          </div>

        </div>
      )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

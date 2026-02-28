import { useEffect, useState, useMemo } from 'react';
import { Card } from '../../ui/card';
import { MapPin, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchEvents, PotholeEvent } from '../../../lib/eventsApi';

// Fix for default marker icons in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker colors based on priority
const getMarkerColor = (priority: string | undefined): string => {
  switch (priority) {
    case 'high':
      return '#ef4444'; // red
    case 'medium':
      return '#f97316'; // orange
    case 'low':
      return '#22c55e'; // green
    default:
      return '#6b7280'; // gray
  }
};

// Create custom colored icon
const createColoredIcon = (color: string, rank: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">#${rank}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to auto-fit map bounds
function MapBounds({ events }: { events: PotholeEvent[] }) {
  const map = useMap();

  useEffect(() => {
    if (events.length > 0) {
      const bounds = L.latLngBounds(
        events.map((e) => [e.location.lat, e.location.lon] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [events, map]);

  return null;
}

export function MunicipalityMap() {
  const [events, setEvents] = useState<PotholeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch events for map', err);
        setError('Failed to load pothole data');
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Sort events by disparity (higher first)
  const sortedEvents = useMemo(() => {
    return [...events]
      .filter((e) => e?._id && e?.location && e?.vision)
      .sort((a, b) => {
        return (b.vision?.avg_depth_est_cm ?? 0) - (a.vision?.avg_depth_est_cm ?? 0);
      });
  }, [events]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="backdrop-blur-xl bg-white/5 border border-amber-500/20 p-6 h-[600px]">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading map data...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="backdrop-blur-xl bg-white/5 border border-amber-500/20 p-6 h-[600px]">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="backdrop-blur-xl bg-white/5 border border-amber-500/20 p-6 h-[600px]">
          <div className="h-full bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl flex items-center justify-center border border-amber-500/10">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-amber-400 mx-auto mb-2" />
              <p className="text-gray-400">No pothole data available</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Default center (will be overridden by MapBounds)
  const defaultCenter: [number, number] = sortedEvents[0]
    ? [sortedEvents[0].location.lat, sortedEvents[0].location.lon]
    : [0, 0];

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="backdrop-blur-xl bg-white/5 border border-amber-500/20 p-6 h-[600px] overflow-hidden">
        <div className="h-full rounded-xl overflow-hidden">
          <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBounds events={sortedEvents} />
            {sortedEvents.map((event, index) => {
              const rank = index + 1;
              const color = getMarkerColor(event.priority ?? 'medium');
              const icon = createColoredIcon(color, rank);
              // Treat avg_depth_est_cm as disparity value
              const disparity = event.vision?.avg_depth_est_cm ?? 0;
              const date = event.createdAt
                ? new Date(event.createdAt).toLocaleDateString()
                : 'Unknown';

              return (
                <Marker
                  key={event._id}
                  position={[event.location.lat, event.location.lon]}
                  icon={icon}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                        <h3 className="font-bold text-lg">Pothole #{rank}</h3>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-semibold">Disparity:</span>{' '}
                          {disparity.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-semibold">Priority:</span>{' '}
                          <span className="uppercase">{event.priority ?? 'medium'}</span>
                        </p>
                        <p>
                          <span className="font-semibold">Status:</span>{' '}
                          {event.status ?? 'pending'}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span> {date}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {event.location.lat.toFixed(4)}, {event.location.lon.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </Card>
    </div>
  );
}

// frontend/src/lib/eventsApi.ts

export interface PotholeEvent {
  _id: string;
  location: {
    lat: number;
    lon: number;
  };
  vision: {
    avg_depth_est_cm: number;
  };
  priority: "high" | "medium" | "low";
  status: string;
  createdAt: string;
}

type ExtendedOid = { $oid?: string } | { oid?: string } | { id?: string };
type ExtendedDate = { $date?: string } | { date?: string };

function unwrapId(id: unknown): string | undefined {
  if (typeof id === "string") return id;
  if (id && typeof id === "object") {
    const maybe = id as ExtendedOid;
    return maybe.$oid ?? maybe.oid ?? maybe.id;
  }
  return undefined;
}

function unwrapDate(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object") {
    const maybe = value as ExtendedDate;
    return maybe.$date ?? maybe.date;
  }
  return undefined;
}

function normalizeEvent(raw: any): PotholeEvent | null {
  const _id = unwrapId(raw?._id);
  const lat = raw?.location?.lat;
  const lon = raw?.location?.lon;
  const depth = raw?.vision?.avg_depth_est_cm;

  if (typeof _id !== "string") return null;
  if (typeof lat !== "number" || typeof lon !== "number") return null;
  if (typeof depth !== "number") return null;

  const priorityRaw = (raw?.priority ?? "low").toString().toLowerCase().trim();
  const priority: "high" | "medium" | "low" =
    priorityRaw === "high" ? "high" : priorityRaw === "medium" ? "medium" : "low";

  const status = (raw?.status ?? "pending").toString();
  const createdAt = unwrapDate(raw?.createdAt) ?? unwrapDate(raw?.timestamp) ?? new Date().toISOString();

  return {
    _id,
    location: { lat, lon },
    vision: { avg_depth_est_cm: depth },
    priority,
    status,
    createdAt,
  };
}

export async function fetchEvents(): Promise<PotholeEvent[]> {
  const res = await fetch("http://localhost:5000/api/events");

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const json = await res.json();
  const rawEvents = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
  return rawEvents.map(normalizeEvent).filter(Boolean) as PotholeEvent[];
}

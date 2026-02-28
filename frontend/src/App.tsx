import { useState } from 'react';
import { LandingPage } from './components/geometrica/LandingPage';
import { UserPortal } from './components/geometrica/UserPortal';
import { MunicipalityPortal } from './components/geometrica/MunicipalityPortal';
import { AdminPortal } from './components/geometrica/AdminPortal';
import { Toaster } from './components/ui/sonner';
import { useEffect } from "react";

export type UserRole = 'user' | 'municipality' | 'admin' | null;

export interface PotholeReport {
  id: string;
  userId: string;
  userName: string;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  status: 'pending' | 'verified' | 'assigned' | 'in-progress' | 'completed' | 'rejected';
  severity: 'low' | 'medium' | 'high';
  aiVerified: boolean;
  aiInsights?: {
    depth: number;
    width: number;
    confidence: number;
    damageLevel: string;
  };
  credibilityPoints: number;
  manualCapture: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credibilityScore: number;
  totalReports: number;
  verifiedReports: number;
  badges: string[];
  avatar?: string;
}
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

export default function App() {
  useEffect(() => {
  const user = getUserFromToken();
  if (user) {
    setCurrentUser({
      id: user.id,
      name: "Restored User",
      email: "",
      role: user.role,
      credibilityScore: 0,
      totalReports: 0,
      verifiedReports: 0,
      badges: [],
    });
    setCurrentPortal(user.role);
  }
}, []);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPortal, setCurrentPortal] = useState<UserRole>(null);

const handleLogin = (role: UserRole, email: string) => {
  const tokenUser = getUserFromToken();
  if (!tokenUser) return;

  setCurrentUser({
    id: tokenUser.id,
    name: email.split("@")[0],
    email,
    role,
    credibilityScore: 0,
    totalReports: 0,
    verifiedReports: 0,
    badges: [],
  });

  setCurrentPortal(role);
};


  const handleLogout = () => {
  localStorage.removeItem("token");
  setCurrentUser(null);
  setCurrentPortal(null);
};


  if (!currentUser || !currentPortal) {
    return <LandingPage onLogin={handleLogin} />;
  }
  const isAllowed = (requiredRole: UserRole) => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === requiredRole;
  } catch {
    return false;
  }
};
if (currentPortal && !isAllowed(currentPortal)) {
  handleLogout();
  return <LandingPage onLogin={handleLogin} />;
}


  return (
    <>
      {currentPortal === "user" && isAllowed("user") && (
  <UserPortal user={currentUser} onLogout={handleLogout} />
)}

      {currentPortal === "municipality" && isAllowed("municipality") && (
  <MunicipalityPortal user={currentUser} onLogout={handleLogout} />
)}

{currentPortal === "admin" && isAllowed("admin") && (
  <AdminPortal user={currentUser} onLogout={handleLogout} />
)}

      <Toaster />
    </>
  );
}

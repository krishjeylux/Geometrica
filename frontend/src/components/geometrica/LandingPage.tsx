import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { MapPin, Brain, Shield } from 'lucide-react';
import { UserRole } from '../../App';
import { motion } from 'motion/react';


interface LandingPageProps {
  onLogin: (role: UserRole, email: string) => void;
}

const API_URL = "http://localhost:5000";

export function LandingPage({ onLogin }: LandingPageProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'municipality' | 'admin'>('user');
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

// 🔁 MAP ADMIN → COMPANY FOR BACKEND


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const endpoint = activeTab === "signup" ? "/signup" : "/login";

    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role: selectedRole,

      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // 🔑 THIS IS THE MOST IMPORTANT PART
    // ✅ SIGNUP FLOW (NO TOKEN EXPECTED)
if (activeTab === "signup") {
  alert("Signup successful. Please login.");
  setActiveTab("login");
  return;
}

// ✅ LOGIN FLOW (TOKEN REQUIRED)
if (!data.token) {
  alert("Login failed: token not received");
  return;
}

localStorage.setItem("token", data.token);
console.log("✅ Token stored:", data.token);

// ✅ Redirect after successful login
onLogin(selectedRole, email);
setShowAuthDialog(false);

  } catch (error) {
    console.error("Login error:", error);
    alert("Server error");
  }
};




  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>


      {/* Geometric Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </div>


      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-20 h-20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-indigo-600 rounded-2xl transform rotate-45" />
              <div className="absolute inset-2 bg-[#0F0C29] rounded-xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-cyan-400" />
              </div>
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            GEOMETRICA
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-gray-300 mb-2"
          >
            Reimagining Road Safety with AI
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-400"
          >
            Where AI meets Asphalt. Detect. Report. Repair. Smarter.
          </motion.p>
        </motion.div>


        {/* CTA Buttons */}
        {/* CTA Buttons HIDDEN */}
        <div style={{ display: 'none' }} className="flex flex-col sm:flex-row gap-4 mb-16" />



        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        >
          {/* User Portal Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="backdrop-blur-lg bg-white/5 border border-cyan-500/30 rounded-2xl p-6 shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer"
            onClick={() => {
              setSelectedRole('user');
              setShowAuthDialog(true);
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl text-cyan-400 mb-2">User Portal</h3>
            <p className="text-gray-400 text-sm">
              Report potholes, earn credibility points, and track repairs in your area.
            </p>
          </motion.div>


          {/* Municipality Portal Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="backdrop-blur-lg bg-white/5 border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:shadow-amber-500/50 transition-all duration-300 cursor-pointer"
            onClick={() => {
              setSelectedRole('municipality');
              setShowAuthDialog(true);
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl text-amber-400 mb-2">Municipality Portal</h3>
            <p className="text-gray-400 text-sm">
              Manage reports, prioritize repairs, and coordinate with contractors.
            </p>
          </motion.div>


          {/* Admin Portal Card */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="backdrop-blur-lg bg-white/5 border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer"
            onClick={() => {
              setSelectedRole('admin');
              setShowAuthDialog(true);
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl text-purple-400 mb-2">Admin Portal</h3>
            <p className="text-gray-400 text-sm">
              AI verification, analytics dashboard, and system-wide management.
            </p>
          </motion.div>
        </motion.div>


        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="text-gray-300">
            <div className="text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              10,000+
            </div>
            <div className="text-sm text-gray-500">Potholes Detected</div>
          </div>
          <div className="text-gray-300">
            <div className="text-3xl bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              95%
            </div>
            <div className="text-sm text-gray-500">AI Accuracy</div>
          </div>
          <div className="text-gray-300">
            <div className="text-3xl bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              500+
            </div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
        </motion.div>
      </div>


      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="bg-[#1a1625] border-purple-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Geometrica
            </DialogTitle>
          </DialogHeader>


          <Tabs
          defaultValue="login"
             className="w-full"
                  onValueChange={(value) =>
                     setActiveTab(value as "login" | "signup")}>

            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>


            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="role" className="text-gray-300">Select Portal</Label>
                  <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                    <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1625] border-purple-500/30 text-white">
                      <SelectItem value="user">User Portal</SelectItem>
                      <SelectItem value="municipality">Municipality Portal</SelectItem>
                      <SelectItem value="admin">Admin Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@geometrica.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>


                <div>
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>


                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                >
                  Login
                </Button>
              </form>
            </TabsContent>


            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="signup-role" className="text-gray-300">Select Portal</Label>
                  <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                    <SelectTrigger className="bg-white/5 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1625] border-purple-500/30 text-white">
                      <SelectItem value="user">User Portal</SelectItem>
                      <SelectItem value="municipality">Municipality Portal</SelectItem>
                      <SelectItem value="admin">Admin Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div>
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="user@geometrica.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>


                <div>
                  <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-purple-500/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>


                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

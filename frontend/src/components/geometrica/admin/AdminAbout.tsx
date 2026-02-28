import { Card } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Target, Users, Zap, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminAbout() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-8 text-center"
      >
        <h1 className="text-4xl bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          GEOMETRICA
        </h1>
        <p className="text-xl text-gray-300 mb-2">Where AI meets Asphalt</p>
        <p className="text-gray-400">Detect. Report. Repair. Smarter.</p>
      </motion.div>

      <Tabs defaultValue="vision" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="vision">Vision & Mission</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="vision">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl text-white">Our Vision</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                To revolutionize infrastructure maintenance through AI-powered detection and community collaboration, 
                creating safer roads and more responsive governance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-lg text-cyan-400 mb-2">Accuracy</h3>
                  <p className="text-gray-400 text-sm">95%+ AI detection accuracy for reliable pothole identification</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-lg text-purple-400 mb-2">Speed</h3>
                  <p className="text-gray-400 text-sm">Real-time processing and instant municipality notifications</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                  <div className="text-4xl mb-3">🤝</div>
                  <h3 className="text-lg text-amber-400 mb-2">Community</h3>
                  <p className="text-gray-400 text-sm">Empowering citizens to improve their neighborhoods</p>
                </div>
              </div>
            </Card>

            <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-amber-400" />
                <h2 className="text-2xl text-white">Our Mission</h2>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span>Deploy cutting-edge AI technology to detect and classify road hazards with unprecedented accuracy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span>Create a transparent, gamified platform that encourages civic participation and accountability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span>Streamline communication between citizens, municipalities, and repair contractors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 text-xl">•</span>
                  <span>Reduce infrastructure maintenance costs through predictive analytics and optimized repair scheduling</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="tech">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 p-8">
              <h2 className="text-2xl text-white mb-6">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-purple-500/10">
                  <h3 className="text-lg text-purple-400 mb-4">AI & Machine Learning</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• TensorFlow & PyTorch</li>
                    <li>• Computer Vision (CNN)</li>
                    <li>• Deep Learning Models</li>
                    <li>• Real-time Image Processing</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-cyan-500/10">
                  <h3 className="text-lg text-cyan-400 mb-4">Frontend</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• React & TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Motion (Framer Motion)</li>
                    <li>• WebGL for 3D visualization</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-amber-500/10">
                  <h3 className="text-lg text-amber-400 mb-4">Backend</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Node.js & Express</li>
                    <li>• Python (FastAPI)</li>
                    <li>• PostgreSQL & MongoDB</li>
                    <li>• Redis for caching</li>
                  </ul>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-green-500/10">
                  <h3 className="text-lg text-green-400 mb-4">Infrastructure</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Cloud Computing (AWS/GCP)</li>
                    <li>• Docker & Kubernetes</li>
                    <li>• CI/CD Pipelines</li>
                    <li>• Real-time WebSockets</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="impact">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 p-8">
              <h2 className="text-2xl text-white mb-6">Our Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                  <div className="text-4xl text-cyan-400 mb-2">10,000+</div>
                  <p className="text-gray-400">Potholes Detected</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <div className="text-4xl text-green-400 mb-2">8,500+</div>
                  <p className="text-gray-400">Repairs Completed</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-4xl text-purple-400 mb-2">50+</div>
                  <p className="text-gray-400">Cities Served</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                  <div className="text-4xl text-amber-400 mb-2">500+</div>
                  <p className="text-gray-400">Active Users</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-6 border border-purple-500/10">
                  <h3 className="text-lg text-white mb-2">Reduced Response Time</h3>
                  <p className="text-gray-400">Average repair time decreased from 14 days to 2.4 days</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-cyan-500/10">
                  <h3 className="text-lg text-white mb-2">Cost Savings</h3>
                  <p className="text-gray-400">Municipalities save an average of 35% on infrastructure maintenance costs</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-amber-500/10">
                  <h3 className="text-lg text-white mb-2">Safety Improvement</h3>
                  <p className="text-gray-400">45% reduction in pothole-related accidents in covered areas</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="contact">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-purple-500/20 p-8">
              <h2 className="text-2xl text-white mb-6">Contact & Support</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">Email</h3>
                      <p className="text-gray-400">support@geometrica.ai</p>
                      <p className="text-gray-400">partners@geometrica.ai</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">Phone</h3>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                      <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white mb-1">Headquarters</h3>
                      <p className="text-gray-400">123 Innovation Drive</p>
                      <p className="text-gray-400">Tech City, TC 12345</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-white mb-4">Quick Links</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        → Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        → API Reference
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        → Partnership Opportunities
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        → Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        → Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

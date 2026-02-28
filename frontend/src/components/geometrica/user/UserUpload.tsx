import { useState, useRef } from 'react';
import { User } from '../../../App';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Progress } from '../../ui/progress';
import { Camera, Upload, MapPin, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface UserUploadProps {
  user: User;
}

export function UserUpload({ user }: UserUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [manualCapture, setManualCapture] = useState(false);
  const [autoGPS, setAutoGPS] = useState(true);
  const [location, setLocation] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          
          const credibilityGain = manualCapture ? 10 : 5;
          toast.success(`Upload successful! +${credibilityGain} credibility points`, {
            description: 'Your report is being verified by our AI system.',
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setManualCapture(false);
    setLocation('');
  };

  const credibilityBonus = manualCapture ? 10 : 5;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6"
      >
        <h2 className="text-2xl text-white mb-2">Report a Pothole</h2>
        <p className="text-gray-400 mb-4">
          Help improve your community by reporting road hazards. Earn credibility points with each verified report!
        </p>
        <div className="flex items-center gap-2 text-cyan-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>Manual capture: +10 points • Auto capture: +5 points</span>
        </div>
      </motion.div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {!uploadComplete ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-8">
              {!selectedImage ? (
                <div className="space-y-6">
                  {/* Capture Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="p-8 border-2 border-dashed border-cyan-500/30 rounded-2xl hover:border-cyan-500 hover:bg-cyan-500/5 transition-all group"
                    >
                      <Camera className="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white mb-2">Capture Photo</h3>
                      <p className="text-sm text-gray-400">Use your camera to take a photo</p>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-8 border-2 border-dashed border-purple-500/30 rounded-2xl hover:border-purple-500 hover:bg-purple-500/5 transition-all group"
                    >
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-white mb-2">Upload Photo</h3>
                      <p className="text-sm text-gray-400">Choose from your gallery</p>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Pothole"
                      className="w-full h-[300px] object-cover rounded-xl"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReset}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 rounded-xl bg-white/5 border border-cyan-500/20">
                      <Checkbox
                        id="manual"
                        checked={manualCapture}
                        onCheckedChange={(checked) => setManualCapture(checked as boolean)}
                        className="border-cyan-500"
                      />
                      <Label htmlFor="manual" className="text-white cursor-pointer">
                        Captured manually? (+10 credibility points)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 rounded-xl bg-white/5 border border-cyan-500/20">
                      <Checkbox
                        id="gps"
                        checked={autoGPS}
                        onCheckedChange={(checked) => setAutoGPS(checked as boolean)}
                        className="border-cyan-500"
                      />
                      <Label htmlFor="gps" className="text-white cursor-pointer flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Auto-fetch GPS location
                      </Label>
                    </div>

                    {!autoGPS && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <Label htmlFor="location" className="text-white">
                          Location Address
                        </Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter location..."
                          className="bg-white/5 border-cyan-500/30 text-white placeholder:text-gray-500"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Uploading...</span>
                        <span className="text-cyan-400">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1 border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : `Upload (+${credibilityBonus} points)`}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl text-white mb-4">Upload Successful!</h2>
              <p className="text-gray-400 mb-2">
                Your report has been submitted and is being verified by our AI system.
              </p>
              <p className="text-cyan-400 mb-8">
                +{credibilityBonus} Credibility Points
              </p>
              <Button
                onClick={handleReset}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                Report Another Pothole
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 p-6">
          <h3 className="text-xl text-white mb-4">Tips for Better Reports</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Take clear, well-lit photos from multiple angles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Ensure the pothole is clearly visible in the frame</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Enable GPS for accurate location tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>Manual captures earn extra credibility points</span>
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}

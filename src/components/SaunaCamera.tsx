import { useState } from 'react';
import { Button } from './ui/button';
import { SaunaHeatmap } from './SaunaHeatmap';
import { Camera, X, RefreshCw } from 'lucide-react';

const SaunaCamera = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isShuttering, setIsShuttering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    setShowCamera(true);
    // For demo purposes, we'll just use a static image.
    // In a real scenario, you would use navigator.mediaDevices.getUserMedia
  };

  const takePicture = () => {
    setIsShuttering(true);
    setTimeout(() => {
      setShowCamera(false);
      setIsShuttering(false);
      setIsLoading(true);

      // Simulate a delay for loading the heatmap
      setTimeout(() => {
        setImageData('/sauna.jpg');
        setPhotoTaken(true);
        setIsLoading(false);
      }, 2000); // 2 second loading time
    }, 500); // Match shutter animation duration
  };

  if (isLoading) {
    return (
      <>
        <style>{`
            @keyframes rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            .animate-spin {
              animation: rotate 1s linear infinite;
            }
          `}</style>
        <div className="aspect-[4/3] bg-white/60 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
          <RefreshCw className="w-12 h-12 text-[#8B7355] mb-4 animate-spin" />
          <h4 className="text-[#3E2723] mb-2">Generating Heatmap...</h4>
          <p className="text-[#5C4033]/80 text-sm">
            Please wait a moment while we analyze your sauna.
          </p>
        </div>
      </>
    );
  }

  if (photoTaken && imageData) {
    return <SaunaHeatmap />;
  }

  return (
    <>
      <div className="aspect-[4/3] bg-white/60 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <Camera className="w-12 h-12 text-[#8B7355] mb-4" />
        <h4 className="text-[#3E2723] mb-2">Map Your Sauna</h4>
        <p className="text-[#5C4033]/80 text-sm mb-4">
          Take a picture of your sauna's floor plan to generate a custom heat map.
        </p>
        <Button
          size="lg"
          onClick={startCamera}
          className="bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white"
        >
          Take Picture of Sauna
        </Button>
      </div>
      {showCamera && (
        <div className="absolute inset-0 w-full h-full bg-black z-50">
          <style>{`
            @keyframes liveView {
              0% { transform: scale(1.05) translate(-4px, 1px); }
              50% { transform: scale(1.05) translate(4px, -1px); }
              100% { transform: scale(1.05) translate(-4px, 1px); }
            }
            .live-view {
              animation: liveView 10s ease-in-out infinite;
            }
            @keyframes iris {
              from {
                clip-path: circle(150% at 50% 50%);
              }
              to {
                clip-path: circle(0% at 50% 50%);
              }
            }
            .shutter {
              animation: iris 0.5s ease-in-out forwards;
            }
          `}</style>
          <div className={`relative w-full h-screen z-2000 ${isShuttering ? 'shutter' : ''}`}>
            <img src="/sauna.jpg" alt="Sauna Preview" className="w-full h-full object-cover live-view" />
            {/* Viewfinder UI */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
              <div className="flex justify-between items-start text-white">
                <div className="bg-black/50 p-2 rounded">AF-C</div>
                <Button onClick={() => setShowCamera(false)} size="icon" className="bg-black/50 hover:bg-black/75">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex justify-between items-end text-white">
                <div className="bg-black/50 p-2 rounded">ISO 200</div>
                <div className="bg-black/50 p-2 rounded">1/125s</div>
              </div>
            </div>
            {/* Shutter Button */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <Button
                onClick={takePicture}
                className="w-20 h-20 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center"
              >
                <Camera className="w-10 h-10" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaunaCamera;

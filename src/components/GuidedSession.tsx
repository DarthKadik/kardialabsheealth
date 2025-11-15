import { Button } from "./ui/button";
import { 
  Clock, 
  Info,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Step {
  id: number;
  title: string;
  duration?: string;
  description: string;
  info: string;
  image: string;
  type: "prep" | "interval" | "cooldown" | "hydration" | "steam";
}

const guidedSteps: Step[] = [
  {
    id: 1,
    title: "Pre-Sauna Shower",
    duration: "5 min",
    description: "Take a warm shower and cleanse your body before entering the sauna",
    info: "Showering removes dirt, oils, and lotions from your skin, which helps your body sweat more efficiently and maintains sauna hygiene for all users.",
    image: "https://images.unsplash.com/photo-1604771983240-606a1044a380?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG93ZXIlMjB3YXRlciUyMHdlbGxuZXNzfGVufDF8fHx8MTc2MzE5NzIzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "prep",
  },
  {
    id: 2,
    title: "Hydration Check",
    description: "Drink 250-500ml of water before starting",
    info: "Pre-hydration is crucial as you'll lose significant fluids through sweating. Starting well-hydrated helps maintain blood pressure and prevents dizziness.",
    image: "https://images.unsplash.com/photo-1565256080583-df488fd02195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGdsYXNzJTIwaHlkcmF0aW9ufGVufDF8fHx8MTc2MzEyNDk4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "hydration",
  },
  {
    id: 3,
    title: "Optional: Stove Setup Tutorial",
    duration: "2 min",
    description: "Learn how to configure your Harvia stove settings",
    info: "Understanding your stove controls allows you to customize temperature, timer settings, and safety features for an optimal experience.",
    image: "https://images.unsplash.com/photo-1660809965901-9cb9d425a8cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b3ZlJTIwZmlyZXxlbnwxfHx8fDE3NjMxOTcyMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "prep",
  },
  {
    id: 4,
    title: "Interval 1: Gentle Start",
    duration: "7.5 min",
    description: "Enter sauna, sit on lower bench, relax and breathe",
    info: "Starting on the lower bench where it's cooler allows your body to gradually adjust to the heat. This prevents overwhelming your cardiovascular system.",
    image: "https://images.unsplash.com/photo-1759216852720-540b165c55f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWxheGluZyUyMHNhdW5hfGVufDF8fHx8MTc2MzE5NzIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "interval",
  },
  {
    id: 5,
    title: "Cool Down 1",
    duration: "10 min",
    description: "Exit sauna, cool down gradually - start standing, then sit outside",
    info: "Gradual cooling prevents sudden drops in blood pressure. Standing first helps circulation adjust, then sitting allows for comfortable cooling.",
    image: "https://images.unsplash.com/photo-1762931669614-4cd482b5af96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY29vbGluZyUyMG5hdHVyZXxlbnwxfHx8fDE3NjMxOTcyMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "cooldown",
  },
  {
    id: 6,
    title: "Hydration Break",
    description: "Drink 250ml of water",
    info: "Regular hydration between intervals replaces lost fluids and electrolytes, helping maintain energy levels and preventing dehydration symptoms.",
    image: "https://images.unsplash.com/photo-1565256080583-df488fd02195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGdsYXNzJTIwaHlkcmF0aW9ufGVufDF8fHx8MTc2MzEyNDk4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "hydration",
  },
  {
    id: 7,
    title: "Interval 2: Build Heat",
    duration: "7.5 min",
    description: "Re-enter sauna, try middle bench. Add water to stones for steam (optional)",
    info: "Throwing water (löyly) on hot stones creates steam, increasing humidity and perceived heat. This enhances sweating and provides a traditional Finnish experience.",
    image: "https://images.unsplash.com/photo-1741601272577-fc2c46f87d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0ZWFtJTIwc3RvbmVzfGVufDF8fHx8MTc2MzE5NzIzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "steam",
  },
  {
    id: 8,
    title: "Cool Down 2",
    duration: "10 min",
    description: "Cool down outside, take a cool shower if desired, walk around gently",
    info: "Moving gently during cooldown promotes circulation and helps your body regulate temperature. A cool shower can accelerate the cooling process.",
    image: "https://images.unsplash.com/photo-1762931669614-4cd482b5af96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY29vbGluZyUyMG5hdHVyZXxlbnwxfHx8fDE3NjMxOTcyMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "cooldown",
  },
  {
    id: 9,
    title: "Hydration Break",
    description: "Drink 250ml of water",
    info: "Continued hydration is essential. By this point, you've lost significant fluids, and maintaining intake prevents fatigue and headaches.",
    image: "https://images.unsplash.com/photo-1565256080583-df488fd02195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGdsYXNzJTIwaHlkcmF0aW9ufGVufDF8fHx8MTc2MzEyNDk4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "hydration",
  },
  {
    id: 10,
    title: "Interval 3: Full Experience",
    duration: "7.5 min",
    description: "Final round - try upper bench. Add steam for peak intensity",
    info: "The upper bench is hottest due to heat rising. Your body is now acclimatized and can handle the increased temperature for maximum benefits.",
    image: "https://images.unsplash.com/photo-1759216852720-540b165c55f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWxheGluZyUyMHNhdW5hfGVufDF8fHx8MTc2MzE5NzIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "steam",
  },
  {
    id: 11,
    title: "Final Cool Down",
    duration: "15 min",
    description: "Cool down completely - shower, sit, and relax until body temperature normalizes",
    info: "A longer final cooldown allows your body to fully recover. Complete cooling before getting dressed prevents continued sweating and ensures comfort.",
    image: "https://images.unsplash.com/photo-1762931669614-4cd482b5af96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwY29vbGluZyUyMG5hdHVyZXxlbnwxfHx8fDE3NjMxOTcyMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "cooldown",
  },
  {
    id: 12,
    title: "Post-Sauna Hydration",
    description: "Drink 500ml of water over the next 30 minutes",
    info: "Post-sauna hydration helps restore fluid balance and supports recovery. Spread intake over time for better absorption.",
    image: "https://images.unsplash.com/photo-1565256080583-df488fd02195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGdsYXNzJTIwaHlkcmF0aW9ufGVufDF8fHx8MTc2MzEyNDk4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "hydration",
  },
];

export function GuidedSession({ onBack }: { onBack: () => void }) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Prep steps are the first 3, session steps are the rest
  const prepSteps = guidedSteps.slice(0, 3);
  const sessionSteps = guidedSteps.slice(3);
  const allPrepComplete = prepSteps.every(step => completedSteps.includes(step.id));

  // Timer logic
  useEffect(() => {
    if (!isPlaying || !sessionStarted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next step
          const nextIndex = currentStepIndex + 1;
          const totalSteps = guidedSteps.length;
          
          if (nextIndex >= totalSteps) {
            // Session complete
            setIsPlaying(false);
            return 0;
          }
          
          // Mark current step as complete
          const currentStep = guidedSteps[currentStepIndex];
          setCompletedSteps((prev) => [...prev, currentStep.id]);
          setCurrentStepIndex(nextIndex);
          
          // Set time for next step
          const nextStep = guidedSteps[nextIndex];
          if (nextStep.duration) {
            const minutes = parseFloat(nextStep.duration.split(" ")[0]);
            return minutes * 60;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, sessionStarted]);

  const toggleStep = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(stepId => stepId !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
      
      // If timer is running and this is the current step, move to next
      if (isPlaying && sessionStarted) {
        const stepIndex = guidedSteps.findIndex(s => s.id === id);
        if (stepIndex === currentStepIndex) {
          const nextIndex = currentStepIndex + 1;
          if (nextIndex < guidedSteps.length) {
            setCurrentStepIndex(nextIndex);
            const nextStep = guidedSteps[nextIndex];
            if (nextStep.duration) {
              const minutes = parseFloat(nextStep.duration.split(" ")[0]);
              setTimeRemaining(minutes * 60);
            } else {
              setTimeRemaining(0);
            }
          } else {
            setIsPlaying(false);
            setTimeRemaining(0);
          }
        }
      }
    }
  };

  const toggleInfo = (id: number) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  const startSession = () => {
    setSessionStarted(true);
    setIsPlaying(true);
    setCurrentStepIndex(3); // Start from first session step (index 3)
    const firstSessionStep = guidedSteps[3];
    if (firstSessionStep.duration) {
      const minutes = parseFloat(firstSessionStep.duration.split(" ")[0]);
      setTimeRemaining(minutes * 60);
    }
  };

  const pauseSession = () => {
    setIsPlaying(false);
  };

  const resetSession = () => {
    setIsPlaying(false);
    setSessionStarted(false);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = guidedSteps
    .filter(step => step.duration)
    .reduce((acc, step) => {
      const minutes = parseFloat(step.duration?.split(" ")[0] || "0");
      return acc + minutes;
    }, 0);

  return (
    <div className="min-h-full bg-[#FFEBCD]">
      {/* Header with natural tones */}
      <div className="relative bg-gradient-to-br from-[#8B7355] to-[#5C4033] px-6 pt-12 pb-8 text-white">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Smart Sauna</span>
        </button>
        
        <div className="mb-3">
          <h1 className="text-white mb-2">Beginner's Guided Session</h1>
          <p className="text-white/90">
            Your complete introduction to sauna wellness
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm bg-[#5C4033]/40 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>~{totalDuration} minutes</span>
          </div>
          <div className="w-px h-4 bg-white/30"></div>
          <span>3 × 7.5 min intervals</span>
        </div>
      </div>

      {/* Steps with images */}
      <div className="px-6 py-6 space-y-4">
        {/* Prep Steps Section */}
        <div className="space-y-4">
          {prepSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            
            // Render compact version if completed
            if (isCompleted) {
              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className="bg-[#8B7355] rounded-xl p-4 shadow-md cursor-pointer hover:bg-[#6D5A47] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFEBCD] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-[#3E2723]">{index + 1}</span>
                    </div>
                    <h4 className="text-white flex-1">{step.title}</h4>
                    <CheckCircle2 className="w-5 h-5 text-[#FFEBCD] flex-shrink-0" />
                  </div>
                </div>
              );
            }
            
            // Render full version for uncompleted steps
            return (
              <div
                key={step.id}
                className="relative rounded-2xl overflow-hidden shadow-lg transition-all"
              >
                {/* Background Image with Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/95 via-[#3E2723]/70 to-transparent"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    {/* Step number badge */}
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#FFEBCD] flex items-center justify-center shadow-md">
                      <span className="text-sm text-[#3E2723]">{index + 1}</span>
                    </div>

                    {/* Title and duration */}
                    <div className="mb-2">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-white">{step.title}</h3>
                        {step.duration && (
                          <span className="text-[#FFEBCD] text-sm flex-shrink-0 bg-[#5C4033]/60 px-2 py-1 rounded-md backdrop-blur-sm">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-white/90 text-sm">{step.description}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => toggleInfo(step.id)}
                        className="flex items-center gap-2 text-xs text-[#FFEBCD] hover:text-white transition-colors bg-[#5C4033]/60 px-3 py-1.5 rounded-md backdrop-blur-sm"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Why this matters</span>
                      </button>
                      
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="ml-auto flex items-center gap-2 text-xs bg-[#8B7355] hover:bg-[#6D5A47] text-white px-3 py-1.5 rounded-md transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info expansion */}
                {expandedStep === step.id && (
                  <div className="bg-[#F5DEB3] p-4 border-t-2 border-[#8B7355]">
                    <p className="text-[#3E2723] text-sm leading-relaxed">
                      {step.info}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Begin Session Button */}
        {!sessionStarted && (
          <div className="py-4">
            <div className="bg-gradient-to-br from-[#8B7355] to-[#6D5A47] rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <h3 className="text-white mb-2">Ready to Begin?</h3>
                <p className="text-white/80 text-sm">
                  {allPrepComplete 
                    ? "Great! You've completed all preparation steps. Start your timed sauna session now."
                    : "Complete the preparation steps above, or start the session now if you're ready."}
                </p>
              </div>
              <Button
                onClick={startSession}
                className="w-full bg-white hover:bg-[#FFEBCD] text-[#5C4033] py-4 shadow-lg transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Begin Timed Session
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Session Steps Section */}
        {sessionStarted && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-l-4 border-orange-500 rounded-lg p-3">
              <p className="text-[#3E2723] text-sm">
                <strong>Timed Session Active</strong> - Follow along or manually complete steps as you go.
              </p>
            </div>
            
            {sessionSteps.map((step, index) => {
              const actualIndex = index + 3; // Offset by prep steps
              const isCompleted = completedSteps.includes(step.id);
              const isCurrentStep = isPlaying && currentStepIndex === actualIndex;
              
              // Render compact version if completed
              if (isCompleted && !isCurrentStep) {
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className="bg-[#8B7355] rounded-xl p-4 shadow-md cursor-pointer hover:bg-[#6D5A47] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FFEBCD] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-[#3E2723]">{actualIndex + 1}</span>
                      </div>
                      <h4 className="text-white flex-1">{step.title}</h4>
                      <CheckCircle2 className="w-5 h-5 text-[#FFEBCD] flex-shrink-0" />
                    </div>
                  </div>
                );
              }
              
              // Render full version for uncompleted steps
              return (
                <div
                  key={step.id}
                  className={`relative rounded-2xl overflow-hidden shadow-lg transition-all ${
                    isCurrentStep ? "ring-4 ring-orange-400" : ""
                  }`}
                >
                  {/* Background Image with Overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/95 via-[#3E2723]/70 to-transparent"></div>
                    
                    {/* Timer overlay for current step */}
                    {isCurrentStep && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-mono">{formatTime(timeRemaining)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Content overlay */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      {/* Step number badge */}
                      <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#FFEBCD] flex items-center justify-center shadow-md">
                        <span className="text-sm text-[#3E2723]">{actualIndex + 1}</span>
                      </div>

                      {/* Title and duration */}
                      <div className="mb-2">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h3 className="text-white">{step.title}</h3>
                          {step.duration && !isCurrentStep && (
                            <span className="text-[#FFEBCD] text-sm flex-shrink-0 bg-[#5C4033]/60 px-2 py-1 rounded-md backdrop-blur-sm">
                              {step.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-white/90 text-sm">{step.description}</p>
                      </div>

                      {/* Action buttons - always show manual complete during session */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInfo(step.id);
                          }}
                          className="flex items-center gap-2 text-xs text-[#FFEBCD] hover:text-white transition-colors bg-[#5C4033]/60 px-3 py-1.5 rounded-md backdrop-blur-sm"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Why this matters</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStep(step.id);
                          }}
                          className="ml-auto flex items-center gap-2 text-xs bg-[#8B7355] hover:bg-[#6D5A47] text-white px-3 py-1.5 rounded-md transition-colors"
                        >
                          {isCurrentStep ? "Skip & Continue" : "Mark Complete"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info expansion */}
                  {expandedStep === step.id && (
                    <div className="bg-[#F5DEB3] p-4 border-t-2 border-[#8B7355]">
                      <p className="text-[#3E2723] text-sm leading-relaxed">
                        {step.info}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-br from-[#DEB887] to-[#D2B48C] rounded-2xl p-5 shadow-lg border border-[#8B7355]/20">
          <h4 className="text-[#3E2723] mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#5C4033]" />
            Session Overview
          </h4>
          <div className="space-y-2 text-sm text-[#3E2723]">
            <p>• <strong>Total time:</strong> ~{totalDuration} minutes including breaks</p>
            <p>• <strong>Total water:</strong> 1.25-1.75 liters recommended</p>
            <p>• <strong>Heat progression:</strong> Gradual increase from lower to upper bench</p>
            <p>• <strong>Steam timing:</strong> Introduce during intervals 2 & 3 only</p>
            <p className="pt-2 text-xs text-[#5C4033]">
              💡 Tip: Listen to your body. If you feel dizzy or uncomfortable, exit the sauna immediately and cool down.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-8">
        {!isPlaying ? (
          <div className="space-y-3">
            <Button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white py-6 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Start Guided Session
              </span>
            </Button>
            {completedSteps.length > 0 && (
              <Button
                onClick={resetSession}
                variant="outline"
                className="w-full border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white"
              >
                <span className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset Progress
                </span>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={pauseSession}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <Pause className="w-5 h-5" />
                Pause Session
              </span>
            </Button>
            <Button
              onClick={resetSession}
              variant="outline"
              className="border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white px-6"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
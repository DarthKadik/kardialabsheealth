import { useState, useEffect } from "react";

export interface Interval {
  id: number;
  type: "sauna" | "break";
  duration: number;
  temperature?: "mellow" | "warm" | "hot" | "intense";
}

export interface Action {
  id: number;
  name: string;
  type: "prep" | "post";
  time?: number;
}

export interface SavedProgram {
  id: number;
  name: string;
  intervals: Interval[];
  soundscape: string;
  lighting: { r: number; g: number; b: number };
  actions: Action[];
}

export function useSessionState() {
  // Get current time for initial values
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [duration, setDuration] = useState([20]);
  const [heatLevel, setHeatLevel] = useState([85]);
  const [humidity, setHumidity] = useState([40]);
  
  // Session tracking state
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  // Load persisted configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('saunaSessionConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setDuration(config.duration || [20]);
        setHeatLevel(config.heatLevel || [85]);
        setHumidity(config.humidity || [40]);
      } catch (e) {
        console.error('Failed to load saved configuration:', e);
      }
    }
  }, []);

  // Persist configuration whenever it changes
  useEffect(() => {
    const config = {
      duration: duration,
      heatLevel: heatLevel,
      humidity: humidity,
    };
    localStorage.setItem('saunaSessionConfig', JSON.stringify(config));
  }, [duration, heatLevel, humidity]);

  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>([]);

  // Load saved programs from local storage on mount
  useEffect(() => {
    const storedPrograms = localStorage.getItem('savedSaunaPrograms');
    if (storedPrograms) {
      try {
        setSavedPrograms(JSON.parse(storedPrograms));
      } catch (e) {
        console.error('Failed to load saved programs:', e);
      }
    }
  }, []);

  // Persist saved programs whenever they change
  useEffect(() => {
    localStorage.setItem('savedSaunaPrograms', JSON.stringify(savedPrograms));
  }, [savedPrograms]);

  const addProgram = (program: Omit<SavedProgram, 'id'>) => {
    setSavedPrograms(prev => [
      ...prev,
      { ...program, id: Date.now() }
    ]);
  };

  const updateProgram = (program: SavedProgram) => {
    setSavedPrograms(prev => prev.map(p => p.id === program.id ? program : p));
  };

  const deleteProgram = (programId: number) => {
    setSavedPrograms(prev => prev.filter(p => p.id !== programId));
  };
  
  // Session scheduling state
  const [isSessionScheduled, setIsSessionScheduled] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilStart, setTimeUntilStart] = useState(0); // in seconds
  
  // Program execution state
  const [currentProgram, setCurrentProgram] = useState<SavedProgram | null>(null);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [intervalStartTime, setIntervalStartTime] = useState<number | null>(null);

  // Timer effect for running sessions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionRunning && sessionStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setElapsedTime(elapsed);
        
        // Handle interval progression for programs
        if (currentProgram && intervalStartTime) {
          const currentInterval = getCurrentInterval();
          if (currentInterval) {
            const intervalElapsed = Math.floor((now - intervalStartTime) / 1000);
            const intervalDuration = currentInterval.duration * 60; // convert to seconds
            
            // Move to next interval if current one is complete
            if (intervalElapsed >= intervalDuration) {
              if (currentIntervalIndex < currentProgram.intervals.length - 1) {
                setCurrentIntervalIndex(prev => prev + 1);
                setIntervalStartTime(now);
              } else {
                // Program complete
                stopProgram();
              }
            }
          }
        } else if (!currentProgram) {
          // Check if simple session is complete
          const totalSeconds = duration[0] * 60;
          if (elapsed >= totalSeconds) {
            stopSession();
          }
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionRunning, sessionStartTime, currentProgram, currentIntervalIndex, intervalStartTime, duration]);

  // Current time and scheduled session check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Check if we should auto-start a scheduled session
      if (isSessionScheduled && scheduledStartTime && !isSessionRunning) {
        const [hours, minutes] = scheduledStartTime.split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // If current time matches or passed scheduled time (within 1 minute window)
        const timeDiff = scheduledTime.getTime() - now.getTime();
        setTimeUntilStart(Math.max(0, Math.floor(timeDiff / 1000)));
        
        if (timeDiff <= 0 && timeDiff > -60000) {
          // Auto-start the session
          startSession();
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSessionScheduled, scheduledStartTime, isSessionRunning]);

  // Calculate time until scheduled start
  useEffect(() => {
    if (isSessionScheduled && scheduledStartTime) {
      const [hours, minutes] = scheduledStartTime.split(':').map(Number);
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      const timeDiff = scheduledTime.getTime() - currentTime.getTime();
      setTimeUntilStart(Math.max(0, Math.floor(timeDiff / 1000)));
    }
  }, [isSessionScheduled, scheduledStartTime, currentTime]);

  const startSession = () => {
    setIsSessionRunning(true);
    setSessionStartTime(Date.now());
    setElapsedTime(0);
    setIsSessionScheduled(false);
    setScheduledStartTime("");
  };

  const stopSession = () => {
    setIsSessionRunning(false);
    setSessionStartTime(null);
    setElapsedTime(0);
  };
  
  const scheduleSession = (time: string) => {
    setIsSessionScheduled(true);
    setScheduledStartTime(time);
  };
  
  const cancelSchedule = () => {
    setIsSessionScheduled(false);
    setScheduledStartTime("");
  };
  
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Program execution functions
  const loadProgram = (program: SavedProgram) => {
    setCurrentProgram(program);
    setCurrentIntervalIndex(0);
  };
  
  const startProgramNow = (program: SavedProgram) => {
    loadProgram(program);
    setIsSessionRunning(true);
    setSessionStartTime(Date.now());
    setIntervalStartTime(Date.now());
    setElapsedTime(0);
    setCurrentIntervalIndex(0);
  };
  
  const scheduleProgramForLater = (program: SavedProgram, time: string) => {
    loadProgram(program);
    setIsSessionScheduled(true);
    setScheduledStartTime(time);
  };
  
  const stopProgram = () => {
    setIsSessionRunning(false);
    setSessionStartTime(null);
    setIntervalStartTime(null);
    setElapsedTime(0);
    setCurrentProgram(null);
    setCurrentIntervalIndex(0);
  };
  
  const getCurrentInterval = () => {
    if (!currentProgram || !currentProgram.intervals.length) return null;
    return currentProgram.intervals[currentIntervalIndex];
  };
  
  const getTotalProgramDuration = (program: SavedProgram) => {
    return program.intervals.reduce((sum, interval) => sum + interval.duration, 0);
  };
  
  const getIntervalElapsedTime = () => {
    if (!intervalStartTime) return 0;
    return Math.floor((Date.now() - intervalStartTime) / 1000);
  };

  return {
    // Config state
    duration,
    setDuration,
    heatLevel,
    setHeatLevel,
    humidity,
    setHumidity,
    
    // Session state
    isSessionRunning,
    sessionStartTime,
    elapsedTime,
    
    // Scheduling state
    isSessionScheduled,
    scheduledStartTime,
    currentTime,
    timeUntilStart,
    
    // Program state
    currentProgram,
    currentIntervalIndex,
    intervalStartTime,
    
    // Saved Programs
    savedPrograms,
    
    // Actions
    addProgram,
    updateProgram,
    deleteProgram,
    startSession,
    stopSession,
    scheduleSession,
    cancelSchedule,
    startProgramNow,
    scheduleProgramForLater,
    stopProgram,
    loadProgram,
    
    // Helpers
    getCurrentInterval,
    getTotalProgramDuration,
    getIntervalElapsedTime,
    formatCountdown,
    formatElapsedTime,
    getCurrentTime,
  };
}

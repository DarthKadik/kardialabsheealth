import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Thermometer, 
  Activity,
  Droplets,
  Flame,
  TrendingUp,
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  Edit,
  Save
} from "lucide-react";

interface SessionData {
  id: string;
  date: Date;
  duration: number; // minutes
  avgTemp: number;
  tempRange: { min: number; max: number };
  recoveryScore: number;
  intervals: number;
  intervalLength: number; // minutes
  humidity: number; // percentage
  waterThrows: number;
  waterThrowInterval: number; // minutes
  heartRate: { avg: number; max: number; min: number };
  caloriesBurned: number;
  notes: string;
  summary: string;
}

// Mock session data
const mockSessions: SessionData[] = [
  {
    id: "1",
    date: new Date(2025, 10, 10), // Nov 10, 2025
    duration: 45,
    avgTemp: 85,
    tempRange: { min: 78, max: 92 },
    recoveryScore: 87,
    intervals: 3,
    intervalLength: 12,
    humidity: 25,
    waterThrows: 8,
    waterThrowInterval: 5.5,
    heartRate: { avg: 125, max: 142, min: 98 },
    caloriesBurned: 320,
    notes: "Felt amazing today. Started with lower bench and gradually moved up. The steam during the second interval was perfect. Body felt loose after the cooldown. Sleep should be great tonight.",
    summary: "Excellent progressive session with optimal steam timing and great recovery indicators.",
  },
  {
    id: "2",
    date: new Date(2025, 10, 8), // Nov 8, 2025
    duration: 30,
    avgTemp: 82,
    tempRange: { min: 80, max: 86 },
    recoveryScore: 78,
    intervals: 2,
    intervalLength: 12,
    humidity: 20,
    waterThrows: 4,
    waterThrowInterval: 7,
    heartRate: { avg: 115, max: 130, min: 95 },
    caloriesBurned: 210,
    notes: "Shorter session today due to time constraints. Still felt refreshed. Focused on breathing exercises and mindfulness. Good recovery session after yesterday's workout.",
    summary: "Gentle recovery session with moderate heat and good mindfulness practice.",
  },
  {
    id: "3",
    date: new Date(2025, 10, 5), // Nov 5, 2025
    duration: 50,
    avgTemp: 88,
    tempRange: { min: 82, max: 95 },
    recoveryScore: 92,
    intervals: 3,
    intervalLength: 15,
    humidity: 30,
    waterThrows: 12,
    waterThrowInterval: 4,
    heartRate: { avg: 135, max: 155, min: 102 },
    caloriesBurned: 380,
    notes: "Peak performance session. Pushed myself with higher temperatures and more frequent steam. The cold shower between intervals was invigorating. Noticed improved flexibility in my hamstrings.",
    summary: "High-intensity session with excellent cardiovascular response and mobility improvements.",
  },
  {
    id: "4",
    date: new Date(2025, 10, 3), // Nov 3, 2025
    duration: 25,
    avgTemp: 80,
    tempRange: { min: 78, max: 84 },
    recoveryScore: 72,
    intervals: 2,
    intervalLength: 10,
    humidity: 18,
    waterThrows: 3,
    waterThrowInterval: 8,
    heartRate: { avg: 108, max: 120, min: 92 },
    caloriesBurned: 175,
    notes: "Easy day. Just wanted to relax and let the stress melt away. Brought a book but ended up just meditating. Sometimes the simple sessions are the best.",
    summary: "Relaxing stress-relief session with minimal intensity and focus on mental wellness.",
  },
];

export function SaunaJournal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFullDetail, setShowFullDetail] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  // Check if date has session
  const getSessionForDate = (day: number) => {
    return mockSessions.find((session) => {
      const sessionDate = session.date;
      return (
        sessionDate.getDate() === day &&
        sessionDate.getMonth() === currentDate.getMonth() &&
        sessionDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const openSessionDetail = (session: SessionData) => {
    setSelectedSession(session);
    setEditedNotes(session.notes);
    setShowPreview(false);
    setShowFullDetail(false);
    setShowDetails(false);
    setIsEditingNotes(false);
  };

  const openSessionPreview = (session: SessionData) => {
    setSelectedSession(session);
    setEditedNotes(session.notes);
    setShowPreview(true);
    setShowFullDetail(false);
    setShowDetails(false);
    setIsEditingNotes(false);
  };

  const openFullDetail = () => {
    setShowPreview(false);
    setShowFullDetail(true);
  };

  const closeSessionDetail = () => {
    setSelectedSession(null);
    setShowPreview(false);
    setShowFullDetail(false);
    setShowDetails(false);
    setIsEditingNotes(false);
  };

  const handleSaveNotes = () => {
    if (selectedSession) {
      // In a real app, this would update the backend
      selectedSession.notes = editedNotes;
      setIsEditingNotes(false);
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-[#FFEBCD]/90" />
        
        <div className="relative p-2">
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-900 text-xs">Session Calendar</h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <div className="text-center min-w-[100px]">
                  <p className="text-gray-900 text-xs">{monthName} {year}</p>
                </div>
                <button
                  onClick={goToNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-0.5">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-[8px] text-gray-500 py-0.5">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const session = getSessionForDate(day);
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => session && openSessionPreview(session)}
                    className={`aspect-square flex items-center justify-center rounded text-[10px] relative transition-colors ${
                      session
                        ? "bg-gradient-to-br from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 cursor-pointer"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    } ${isToday ? "ring-1 ring-orange-400" : ""}`}
                  >
                    {day}
                    {session && (
                      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 text-[8px] text-gray-500 pt-1.5 border-t">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded bg-gradient-to-br from-orange-500 to-red-600"></div>
              <span>Session logged</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded ring-1 ring-orange-400"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Preview Popup */}
      {selectedSession && showPreview && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={openFullDetail}
            className="w-full bg-white rounded-2xl shadow-2xl p-5 border-2 border-orange-200 hover:border-orange-400 transition-all"
          >
            {/* Date Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900">
                {selectedSession.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeSessionDetail();
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Recovery Score */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Recovery Score</span>
                </div>
                <span className="text-xl">{selectedSession.recoveryScore}/100</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Clock className="w-3 h-3 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-gray-900 text-sm">{selectedSession.duration} min</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Thermometer className="w-3 h-3 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Temp</p>
                <p className="text-gray-900 text-sm">{selectedSession.avgTemp}°C</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <Flame className="w-3 h-3 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Calories</p>
                <p className="text-gray-900 text-sm">{selectedSession.caloriesBurned}</p>
              </div>
            </div>

            {/* AI Summary Preview */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-600 mb-1">AI Summary</p>
              <p className="text-gray-700 text-xs italic line-clamp-2">
                {selectedSession.summary}
              </p>
            </div>

            {/* Tap to view more hint */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">Tap to view full details</p>
            </div>
          </button>
        </div>
      )}

      {/* Full Detail Modal */}
      {selectedSession && showFullDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-t-2xl text-white">
              <button
                onClick={closeSessionDetail}
                className="mb-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </button>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white mb-1">
                    {selectedSession.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <p className="text-white/80 text-sm">Session Summary</p>
                </div>
                <button
                  onClick={closeSessionDetail}
                  className="text-white/80 hover:text-white text-2xl leading-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Recovery Score Badge */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 inline-flex items-center gap-2">
                <Activity className="w-5 h-5" />
                <div>
                  <p className="text-xs text-white/80">Recovery Score</p>
                  <p className="text-xl text-white">{selectedSession.recoveryScore}/100</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* AI Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
                <p className="text-xs text-purple-600 mb-1">AI Summary</p>
                <p className="text-gray-700 text-sm italic">{selectedSession.summary}</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Clock className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-gray-900">{selectedSession.duration} min</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Thermometer className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Avg Temp</p>
                  <p className="text-gray-900">{selectedSession.avgTemp}°C</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Flame className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Calories</p>
                  <p className="text-gray-900">{selectedSession.caloriesBurned}</p>
                </div>
              </div>

              {/* Show More Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-lg p-3 mb-4 transition-colors"
              >
                <span className="text-sm text-gray-700">Detailed Statistics</span>
                {showDetails ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {/* Detailed Stats (Expandable) */}
              {showDetails && (
                <div className="space-y-3 mb-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-600 mb-1">Temperature Range</p>
                      <p className="text-gray-900 text-sm">
                        {selectedSession.tempRange.min}°C - {selectedSession.tempRange.max}°C
                      </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-600 mb-1">Intervals</p>
                      <p className="text-gray-900 text-sm">
                        {selectedSession.intervals} × {selectedSession.intervalLength} min
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Humidity</p>
                      <p className="text-gray-900 text-sm">{selectedSession.humidity}%</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 mb-1">Water Throws</p>
                      <p className="text-gray-900 text-sm">
                        {selectedSession.waterThrows} (every {selectedSession.waterThrowInterval} min)
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <p className="text-xs text-red-600">Heart Rate Data</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Avg</p>
                        <p className="text-gray-900 text-sm">{selectedSession.heartRate.avg} bpm</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Max</p>
                        <p className="text-gray-900 text-sm">{selectedSession.heartRate.max} bpm</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Min</p>
                        <p className="text-gray-900 text-sm">{selectedSession.heartRate.min} bpm</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-purple-600">Biometric Data</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Synced from wearable device • Apple Watch Series 9
                    </p>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gray-900">Session Notes</h4>
                  {!isEditingNotes ? (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveNotes}
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingNotes(false);
                          setEditedNotes(selectedSession.notes);
                        }}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditingNotes ? (
                  <Textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="min-h-[120px] text-sm"
                    placeholder="Add notes about your session..."
                  />
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                    {selectedSession.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
              <Button
                onClick={closeSessionDetail}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
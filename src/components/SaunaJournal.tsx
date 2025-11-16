import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
import { DataService } from "../utils/dataUtils";
import type { SaunaSession } from "../types";

const dataService = new DataService();

interface SessionData {
  id: string;
  date: Date;
  duration: number; // minutes
  avgTemp: number;
  tempRange: { min: number; max: number };
  recoveryScore: number;
  avgHumidity: number;
  heartRate: { avg: number; max: number; min: number };
  relaxationScore: number;
  enjoymentScore: number;
  notes: string;
  timeSeries: Array<{ time_minutes: number; temperature_celsius: number; humidity_percent: number }>;
}

// Convert SaunaSession to SessionData
function convertSessionToSessionData(session: SaunaSession): SessionData {
  const sessionDate = new Date(session.timestamp);
  
  // Calculate temperature stats from time series
  const temps = session.time_series.map(ts => ts.temperature_celsius);
  const avgTemp = temps.length > 0 
    ? Math.round(temps.reduce((sum, t) => sum + t, 0) / temps.length)
    : 0;
  const tempRange = temps.length > 0
    ? { min: Math.round(Math.min(...temps)), max: Math.round(Math.max(...temps)) }
    : { min: 0, max: 0 };
  
  // Calculate humidity stats
  const humidities = session.time_series.map(ts => ts.humidity_percent);
  const avgHumidity = humidities.length > 0
    ? Math.round(humidities.reduce((sum, h) => sum + h, 0) / humidities.length)
    : 0;
  
  // Calculate heart rate stats
  const heartRates = session.time_series.map(ts => ts.heart_rate_bpm);
  const heartRate = heartRates.length > 0
    ? {
        avg: Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length),
        max: Math.round(Math.max(...heartRates)),
        min: Math.round(Math.min(...heartRates))
      }
    : { avg: 0, max: 0, min: 0 };
  
  return {
    id: session.session_id,
    date: sessionDate,
    duration: session.duration_minutes,
    avgTemp,
    tempRange,
    recoveryScore: session.recovery_score,
    avgHumidity,
    heartRate,
    relaxationScore: session.relaxation_score,
    enjoymentScore: session.enjoyment_score,
    notes: "", // Notes can be added/edited by user
    timeSeries: session.time_series.map(ts => ({
      time_minutes: ts.time_minutes,
      temperature_celsius: ts.temperature_celsius,
      humidity_percent: ts.humidity_percent
    }))
  };
}

export function SaunaJournal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFullDetail, setShowFullDetail] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState("");

  // Get sessions for the current month
  const sessionsForMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const sessions = dataService.getMonthlySaunaSessions(year, month);
    return sessions.map(convertSessionToSessionData);
  }, [currentDate]);

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
    // Convert Sunday (0) to 6, and shift all other days by 1 to start week on Monday
    const dayOfWeek = firstDay.getDay();
    const startingDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    return { daysInMonth, startingDayOfWeek };
  };

  // Check if date has session
  const getSessionForDate = (day: number) => {
    return sessionsForMonth.find((session) => {
      const sessionDate = session.date;
      return (
        sessionDate.getDate() === day &&
        sessionDate.getMonth() === currentDate.getMonth() &&
        sessionDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const openSessionPreview = (session: SessionData) => {
    setSelectedSession(session);
    setEditedNotes(session.notes);
    setShowPreview(true);
    setShowFullDetail(false);
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

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
                <Droplets className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-gray-900 text-sm">{selectedSession.avgHumidity}%</p>
              </div>
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
                  <Droplets className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Humidity</p>
                  <p className="text-gray-900">{selectedSession.avgHumidity}%</p>
                </div>
              </div>

              {/* Time Series Chart */}
              <div className="mb-4">
                <h4 className="text-gray-900 text-sm mb-2">Temperature & Humidity Over Time</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <ResponsiveContainer width="100%" height={200} debounce={300}>
                    <LineChart data={selectedSession.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="time_minutes" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="temp"
                        orientation="left"
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="humidity"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip />
                      <Line 
                        yAxisId="temp"
                        type="monotone" 
                        dataKey="temperature_celsius" 
                        stroke="#f97316" 
                        strokeWidth={3}
                        dot={false}
                        name="Temperature (°C)"
                        isAnimationActive={false}
                      />
                      <Line 
                        yAxisId="humidity"
                        type="monotone" 
                        dataKey="humidity_percent" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={false}
                        name="Humidity (%)"
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

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
                  <div className="space-y-3">
                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                      {selectedSession.notes || "No notes added yet."}
                    </p>
                    
                    {/* Relaxation and Enjoyment Scores */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <p className="text-xs text-purple-600">Relaxation Score</p>
                        </div>
                        <p className="text-gray-900 text-lg font-semibold">{selectedSession.relaxationScore}/5</p>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-4 h-4 text-pink-600" />
                          <p className="text-xs text-pink-600">Enjoyment Score</p>
                        </div>
                        <p className="text-gray-900 text-lg font-semibold">{selectedSession.enjoymentScore}/5</p>
                      </div>
                    </div>
                  </div>
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
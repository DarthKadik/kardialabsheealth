import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, TrendingUp, Activity, Flame, BookOpen } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SaunaJournal } from "./SaunaJournal";

const weeklyData = [
  { day: "Mon", sessions: 1, duration: 25, avgTemp: 85 },
  { day: "Tue", sessions: 2, duration: 40, avgTemp: 82 },
  { day: "Wed", sessions: 1, duration: 20, avgTemp: 88 },
  { day: "Thu", sessions: 0, duration: 0, avgTemp: 0 },
  { day: "Fri", sessions: 2, duration: 35, avgTemp: 85 },
  { day: "Sat", sessions: 1, duration: 30, avgTemp: 90 },
  { day: "Sun", sessions: 1, duration: 25, avgTemp: 87 },
];

const heartRateData = [
  { time: "0", bpm: 72 },
  { time: "5", bpm: 95 },
  { time: "10", bpm: 118 },
  { time: "15", bpm: 132 },
  { time: "20", bpm: 128 },
  { time: "25", bpm: 105 },
  { time: "30", bpm: 78 },
];

export function DataTracking() {
  return (
    <div className="min-h-full bg-[#FFEBCD]">
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-4 pb-2">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3E2723]/95 to-[#5C4033]/90" />
        <div className="relative">
          <h1 className="text-white">Stats & Analytics</h1>
        </div>
      </div>

      <div className="px-6 py-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="relative overflow-hidden rounded-2xl shadow-lg h-20">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/90 to-[#6D5A47]/90" />
            <div className="relative p-3 h-full flex flex-col justify-between">
              <p className="text-[#FFEBCD] text-xs">Total Sessions</p>
              <p className="text-white text-2xl">142</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl shadow-lg h-20">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#6D5A47]/90 to-[#5C4033]/90" />
            <div className="relative p-3 h-full flex flex-col justify-between">
              <p className="text-[#FFEBCD] text-xs">Total Time</p>
              <p className="text-white text-2xl">54.3h</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl shadow-lg h-20">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1741601272577-fc2c46f87d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b25lcyUyMHN0ZWFtfGVufDF8fHx8MTc2MzIwMDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 to-red-700/80" />
            <div className="relative p-3 h-full flex flex-col justify-between">
              <p className="text-white/90 text-xs">Avg Temperature</p>
              <p className="text-white text-2xl">85°C</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-2xl shadow-lg h-20">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#5C4033]/90 to-[#3E2723]/90" />
            <div className="relative p-3 h-full flex flex-col justify-between">
              <p className="text-[#FFEBCD] text-xs">Avg Duration</p>
              <p className="text-white text-2xl">23min</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="journal" className="space-y-3">
          <TabsList className="w-full">
            <TabsTrigger value="journal" className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="week" className="flex-1">Week</TabsTrigger>
            <TabsTrigger value="year" className="flex-1">2025 Wrapped</TabsTrigger>
          </TabsList>

          <TabsContent value="journal">
            <SaunaJournal />
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            {/* Session Frequency */}
            <Card className="p-4">
              <h3 className="text-gray-900 mb-4">Sessions This Week</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Heart Rate Trend */}
            <Card className="p-4">
              <h3 className="text-gray-900 mb-4">Heart Rate Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} label={{ value: 'Minutes', position: 'insideBottom', offset: -5 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bpm" stroke="#f97316" strokeWidth={3} dot={{ fill: "#f97316", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Temperature Trend */}
            <Card className="p-4">
              <h3 className="text-gray-900 mb-4">Temperature Preferences</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="avgTemp" fill="url(#tempGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="year" className="space-y-3 pb-6">
            {/* Year in Review - Spotify Wrapped Style */}
            
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/95 to-red-700/95" />
              <div className="relative p-8 text-center">
                <p className="text-white/80 text-sm mb-2">Your 2025</p>
                <h2 className="text-white mb-4">Sauna Wrapped</h2>
                <div className="space-y-1">
                  <p className="text-white text-5xl">142</p>
                  <p className="text-white/90">Sessions This Year</p>
                </div>
              </div>
            </div>

            {/* GitHub-style Activity Map */}
            <Card className="p-4">
              <p className="text-gray-700 text-sm mb-3">Your Sauna Year</p>
              <div className="space-y-4">
                {/* First Half: Jan-Jun */}
                <div>
                  {/* Month labels */}
                  <div className="flex gap-2 mb-1">
                    <div className="w-[28px]"></div> {/* Space for day labels */}
                    <div className="flex-1 overflow-x-auto">
                      <div className="flex gap-1">
                        {(() => {
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                          const weeksPerMonth = [4, 4, 5, 4, 4, 5]; // Total = 26 weeks
                          
                          return months.map((month, idx) => {
                            const weekSpan = weeksPerMonth[idx];
                            const width = weekSpan * 12; // 8px per dot + 4px gap
                            return (
                              <div key={month} style={{ width: `${width}px` }}>
                                <span className="text-[9px] text-gray-500">{month}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Day rows */}
                  <div className="space-y-0.5">
                    {(() => {
                      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                      const saunaDays = new Set([
                        3, 5, 8, 12, 15, 19, 22, 26, 29, 33, 36, 40, 43, 47, 50, 54, 57, 61, 64, 68,
                        71, 75, 78, 82, 85, 89, 92, 96, 99, 103, 106, 110, 113, 117, 120, 124, 127, 131,
                        134, 138, 141, 145, 148, 152, 155, 159, 162, 166, 169, 173, 176, 180
                      ]);

                      return daysOfWeek.map((dayName, dayIndex) => (
                        <div key={dayName} className="flex gap-2 items-center">
                          {/* Day label */}
                          <div className="w-[28px]">
                            <span className="text-[9px] text-gray-500 leading-none">{dayName}</span>
                          </div>
                          
                          {/* Dots for this day across all weeks */}
                          <div className="flex gap-1">
                            {Array.from({ length: 26 }).map((_, weekIndex) => {
                              const dayOfYear = weekIndex * 7 + dayIndex;
                              const hasSauna = saunaDays.has(dayOfYear);
                              return (
                                <div
                                  key={weekIndex}
                                  className={`w-[8px] h-[8px] rounded-sm ${
                                    hasSauna
                                      ? 'bg-gradient-to-br from-orange-500 to-red-600'
                                      : 'bg-gray-200'
                                  }`}
                                  title={`${dayName} week ${weekIndex + 1}: ${hasSauna ? 'Sauna day' : 'No session'}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Second Half: Jul-Dec */}
                <div>
                  {/* Month labels */}
                  <div className="flex gap-2 mb-1">
                    <div className="w-[28px]"></div> {/* Space for day labels */}
                    <div className="flex-1 overflow-x-auto">
                      <div className="flex gap-1">
                        {(() => {
                          const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                          const weeksPerMonth = [4, 4, 5, 4, 4, 5]; // Total = 26 weeks
                          
                          return months.map((month, idx) => {
                            const weekSpan = weeksPerMonth[idx];
                            const width = weekSpan * 12; // 8px per dot + 4px gap
                            return (
                              <div key={month} style={{ width: `${width}px` }}>
                                <span className="text-[9px] text-gray-500">{month}</span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Day rows */}
                  <div className="space-y-0.5">
                    {(() => {
                      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                      const saunaDays = new Set([
                        183, 187, 190, 194, 197, 201, 204, 208, 211, 215, 218, 222, 225, 229, 232, 236, 
                        239, 243, 246, 250, 253, 257, 260, 264, 267, 271, 274, 278, 281, 285, 288, 292, 
                        295, 299, 302, 306, 309, 313, 316, 320, 323, 327, 330, 334, 337, 341, 344, 348, 
                        351, 355, 358, 362
                      ]);

                      return daysOfWeek.map((dayName, dayIndex) => (
                        <div key={dayName} className="flex gap-2 items-center">
                          {/* Day label */}
                          <div className="w-[28px]">
                            <span className="text-[9px] text-gray-500 leading-none">{dayName}</span>
                          </div>
                          
                          {/* Dots for this day across all weeks */}
                          <div className="flex gap-1">
                            {Array.from({ length: 26 }).map((_, weekIndex) => {
                              const dayOfYear = (weekIndex + 26) * 7 + dayIndex;
                              const hasSauna = saunaDays.has(dayOfYear);
                              return (
                                <div
                                  key={weekIndex}
                                  className={`w-[8px] h-[8px] rounded-sm ${
                                    hasSauna
                                      ? 'bg-gradient-to-br from-orange-500 to-red-600'
                                      : 'bg-gray-200'
                                  }`}
                                  title={`${dayName} week ${weekIndex + 27}: ${hasSauna ? 'Sauna day' : 'No session'}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3">
                <span className="text-xs text-gray-500">Less</span>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-200" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-orange-300" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                  <div className="w-2.5 h-2.5 rounded-sm bg-red-600" />
                </div>
                <span className="text-xs text-gray-500">More</span>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/90 to-[#6D5A47]/90" />
                <div className="relative p-5 text-center">
                  <p className="text-[#FFEBCD] text-xs mb-2">Total Hours</p>
                  <p className="text-white text-3xl mb-1">54.3</p>
                  <p className="text-[#FFEBCD]/80 text-xs">That's 2.3 days!</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1741601272577-fc2c46f87d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b25lcyUyMHN0ZWFtfGVufDF8fHx8MTc2MzIwMDU1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/90 to-orange-700/90" />
                <div className="relative p-5 text-center">
                  <p className="text-white/90 text-xs mb-2">Hottest Session</p>
                  <p className="text-white text-3xl mb-1">92°C</p>
                  <p className="text-white/80 text-xs">You like it hot!</p>
                </div>
              </div>
            </div>

            {/* Favorite Day */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#5C4033]/90 to-[#3E2723]/90" />
              <div className="relative p-5 text-center">
                <p className="text-[#FFEBCD] text-xs mb-2">Your Favorite Day</p>
                <p className="text-white text-3xl mb-1">Saturday</p>
                <p className="text-[#FFEBCD]/80 text-xs">42 sessions on Saturdays</p>
              </div>
            </div>

            {/* Achievement */}
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 to-yellow-700/90" />
              <div className="relative p-5 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-white mb-1">Top 5% of Harvia Users</p>
                <p className="text-white/80 text-sm">You're a sauna champion!</p>
              </div>
            </div>

            {/* Social Sharing */}
            <Card className="p-5">
              <p className="text-center text-gray-700 mb-4">Share Your Sauna Year</p>
              <div className="grid grid-cols-4 gap-2">
                <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 transition-all shadow-md">
                  <svg className="w-6 h-6 text-white mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path fill="none" stroke="white" strokeWidth="2" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line fill="none" stroke="white" strokeWidth="2" x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="text-white text-xs">Instagram</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all shadow-md">
                  <svg className="w-6 h-6 text-white mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-white text-xs">Facebook</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-gray-800 to-black hover:from-gray-900 hover:to-gray-950 transition-all shadow-md">
                  <svg className="w-6 h-6 text-white mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-white text-xs">X</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition-all shadow-md">
                  <svg className="w-6 h-6 text-white mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-white text-xs">WhatsApp</span>
                </button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
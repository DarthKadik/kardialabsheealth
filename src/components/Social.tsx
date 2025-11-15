import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const posts = [
  {
    id: 1,
    user: "Marcus J.",
    avatar: "MJ",
    time: "2h ago",
    content: "Just finished an amazing 20-minute session at 90°C! Feeling rejuvenated and ready for the weekend. 🔥",
    stats: { duration: "20 min", temp: "90°C", hr: "135 bpm" },
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    user: "Emma S.",
    avatar: "ES",
    time: "5h ago",
    content: "Hit my 30-day streak today! The Harvia app has been a game changer for my wellness routine. 💪",
    stats: { duration: "15 min", temp: "85°C", hr: "128 bpm" },
    likes: 42,
    comments: 8,
  },
  {
    id: 3,
    user: "David L.",
    avatar: "DL",
    time: "1d ago",
    content: "Found this incredible public sauna near the lake using the app. The view was spectacular!",
    stats: { duration: "25 min", temp: "88°C", hr: "132 bpm" },
    likes: 36,
    comments: 12,
  },
];

const challenges = [
  { name: "7-Day Streak", participants: 1243 },
  { name: "Community Hour", participants: 856 },
];

export function Social() {
  return (
    <div className="min-h-full bg-[#FFEBCD]">
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-12 pb-6 sticky top-0 z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3E2723]/95 to-[#5C4033]/90" />
        
        <div className="relative">
          <h1 className="text-white mb-4">Community</h1>
          
          {/* Challenges */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
            {challenges.map((challenge, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-[#8B7355]/60 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[200px]"
              >
                <p className="text-white mb-1">{challenge.name}</p>
                <p className="text-white/70 text-sm">{challenge.participants.toLocaleString()} participants</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="px-6 py-6 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="relative overflow-hidden rounded-2xl shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-[#FFEBCD]/95" />
            
            <div className="relative p-5">
              <div className="flex items-start gap-3 mb-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-[#8B7355] to-[#6D5A47] text-white">
                    {post.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[#3E2723]">{post.user}</p>
                    <span className="text-[#6D5A47] text-sm">{post.time}</span>
                  </div>
                </div>
              </div>

              <p className="text-[#3E2723] mb-3 leading-relaxed">{post.content}</p>

              {/* Session Stats */}
              <div className="bg-[#8B7355]/20 backdrop-blur-sm rounded-xl p-3 mb-3 flex items-center justify-around border border-[#8B7355]/30">
                <div className="text-center">
                  <p className="text-[#6D5A47] text-xs">Duration</p>
                  <p className="text-[#3E2723]">{post.stats.duration}</p>
                </div>
                <div className="w-px h-8 bg-[#8B7355]/40"></div>
                <div className="text-center">
                  <p className="text-[#6D5A47] text-xs">Temperature</p>
                  <p className="text-[#3E2723]">{post.stats.temp}</p>
                </div>
                <div className="w-px h-8 bg-[#8B7355]/40"></div>
                <div className="text-center">
                  <p className="text-[#6D5A47] text-xs">Heart Rate</p>
                  <p className="text-[#3E2723]">{post.stats.hr}</p>
                </div>
              </div>

              {/* Interactions */}
              <div className="flex items-center gap-6 text-sm text-[#6D5A47]">
                <button className="hover:text-[#3E2723] transition-colors">
                  {post.likes} likes
                </button>
                <button className="hover:text-[#3E2723] transition-colors">
                  {post.comments} comments
                </button>
                <button className="hover:text-[#3E2723] transition-colors ml-auto">
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
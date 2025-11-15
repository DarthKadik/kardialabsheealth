import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapPin, Star, Navigation, Clock, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const saunas = [
  {
    id: 1,
    name: "Nordic Wellness Center",
    distance: "0.8 km",
    rating: 4.8,
    reviews: 124,
    address: "123 Spa Street, Downtown",
    available: true,
    capacity: "3/8 spots",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 10 PM",
  },
  {
    id: 2,
    name: "Lakeside Sauna House",
    distance: "2.3 km",
    rating: 4.9,
    reviews: 89,
    address: "456 Lake Road, Waterfront",
    available: true,
    capacity: "5/10 spots",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open 24/7",
  },
  {
    id: 3,
    name: "City Spa & Sauna",
    distance: "3.1 km",
    rating: 4.6,
    reviews: 203,
    address: "789 Urban Ave, City Center",
    available: false,
    capacity: "Full (8/8)",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 11 PM",
  },
];

export function FindSaunas() {
  return (
    <div className="min-h-full bg-[#FFEBCD]">
      {/* Header with Search */}
      <div className="relative overflow-hidden px-6 pt-12 pb-6">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500921453272-f9ae405da3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjBsb2NhdGlvbiUyMG5hdHVyZXxlbnwxfHx8fDE3NjMyMDA1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3E2723]/95 to-[#5C4033]/90" />
        
        <div className="relative">
          <h1 className="text-white mb-4">Find Saunas</h1>
          
          <div className="relative">
            <Input
              placeholder="Search location..."
              className="pl-4 bg-white/90 backdrop-blur-sm border-white/40 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 border-b border-gray-200 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1754299096069-d73ae7fc95b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjBsb2NhdGlvbiUyMHBpbnxlbnwxfHx8fDE3NjMwNzg0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Map"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-700 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            3 saunas nearby
          </div>
        </div>
      </div>

      {/* Sauna List */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#3E2723]">Nearby Saunas</h3>
          <span className="text-[#6D5A47] text-sm">{saunas.length} results</span>
        </div>

        <div className="space-y-4">
          {saunas.map((sauna) => (
            <div key={sauna.id} className="relative overflow-hidden rounded-2xl shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-[#FFEBCD]/90" />
              
              <div className="relative">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={sauna.image}
                    alt={sauna.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-[#3E2723]">
                    {sauna.distance}
                  </div>
                  {sauna.available ? (
                    <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                      Available
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-gray-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                      Full
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h4 className="text-[#3E2723] mb-2">{sauna.name}</h4>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                      <span className="text-[#3E2723] text-sm">{sauna.rating}</span>
                      <span className="text-[#8B7355] text-sm">({sauna.reviews})</span>
                    </div>
                    <div className="w-px h-4 bg-[#8B7355]/40"></div>
                    <div className="text-sm text-[#6D5A47]">
                      {sauna.capacity}
                    </div>
                  </div>

                  <p className="text-[#6D5A47] text-sm mb-2">{sauna.address}</p>
                  
                  <div className="text-sm text-[#6D5A47] mb-4">
                    {sauna.hours}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-2 border-[#8B7355] text-[#5C4033] hover:bg-[#FFEBCD]"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#8B7355] to-[#6D5A47] hover:from-[#6D5A47] hover:to-[#5C4033] text-white"
                      disabled={!sauna.available}
                    >
                      {sauna.available ? "Book Now" : "Full"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Map from "./Map";
import { Input } from "./ui/input";
import { MapPin, Star, Navigation, Clock, Users, Globe, Flame, Sparkles, ShoppingBag, Package, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useRef, RefObject, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Sauna } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const saunas: Sauna[] = [
  {
    id: 1,
    name: "Sannan sauna",
    distance: "2.1 km",
    rating: 4.5,
    reviews: 78,
    address: "14 Sauna Tie, Helsinki",
    available: true,
    capacity: "4/6 spots",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 9 PM",
    longitude: 25.1290025,
    latitude: 60.1983846
  },
  {
    id: 2,
    name: "Löyly Helsinki",
    distance: "0.5 km",
    rating: 4.9,
    reviews: 1340,
    address: "1 Hernesaarenranta, Helsinki",
    available: true,
    capacity: "15/20 spots",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 11 PM",
    longitude: 24.9302737,
    latitude: 60.1520656
  },
  {
    id: 3,
    name: "Kotiharjun Sauna",
    distance: "1.2 km",
    rating: 4.7,
    reviews: 432,
    address: "28 Harjutorinkatu, Helsinki",
    available: false,
    capacity: "Full (10/10)",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 10 PM",
    longitude: 24.9572906,
    latitude: 60.1864693
  },
  {
    id: 4,
    name: "Sompasauna",
    distance: "3.5 km",
    rating: 4.8,
    reviews: 612,
    address: "Sompasaari, Helsinki",
    available: true,
    capacity: "Open (public)",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open 24/7",
    longitude: 24.9848992,
    latitude: 60.1940822
  },
  {
    id: 5,
    name: "Pasilan Saunatilat Oy",
    distance: "1.8 km",
    rating: 4.3,
    reviews: 45,
    address: "52 Radiokatu, Helsinki",
    available: true,
    capacity: "2/8 spots",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "By reservation",
    longitude: 24.9282172,
    latitude: 60.1971449
  },
  {
    id: 6,
    name: "Uusi Sauna",
    distance: "0.9 km",
    rating: 4.6,
    reviews: 230,
    address: "1 Pieni Roobertinkatu, Helsinki",
    available: true,
    capacity: "6/12 spots",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 11 PM",
    longitude: 24.9178012,
    latitude: 60.1594188
  },
  {
    id: 7,
    name: "Saunat.fi",
    distance: "0.4 km",
    rating: 4.4,
    reviews: 92,
    address: "10 Merimiehenkatu, Helsinki",
    available: true,
    capacity: "7/10 spots",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 10 PM",
    longitude: 24.9104929,
    latitude: 60.1639178
  },
  {
    id: 8,
    name: "Saunat.fi City",
    distance: "0.2 km",
    rating: 4.5,
    reviews: 115,
    address: "22 Kalevankatu, Helsinki",
    available: true,
    capacity: "5/8 spots",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzA3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 11 PM",
    longitude: 24.9379625,
    latitude: 60.1674171
  },
  {
    id: 9,
    name: "Sompasauna Helsinki",
    distance: "3.7 km",
    rating: 4.9,
    reviews: 750,
    address: "Sompasaari (new location), Helsinki",
    available: true,
    capacity: "Open (public)",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open 24/7",
    longitude: 24.9990499,
    latitude: 60.1806529
  },
  {
    id: 10,
    name: "Herttoniemi Sauna & Pool",
    distance: "5.1 km",
    rating: 4.2,
    reviews: 67,
    address: "3 Kettutie, Helsinki",
    available: false,
    capacity: "Full (5/5)",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzA3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 9 PM",
    longitude: 25.0305278,
    latitude: 60.1931718
  },
  {
    id: 11,
    name: "Löylykontti Sörnäinen",
    distance: "2.8 km",
    rating: 4.0,
    reviews: 31,
    address: "9 Vilhonvuorenkatu, Helsinki",
    available: true,
    capacity: "3/6 spots",
    image: "https://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib.rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 8 PM",
    longitude: 24.9633132,
    latitude: 60.1823069
  },
  {
    id: 12,
    name: "Original SkySauna",
    distance: "1.0 km",
    rating: 4.8,
    reviews: 320,
    address: "2 Katajanokanlaituri, Helsinki",
    available: true,
    capacity: "4/6 spots",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzA3ww&ixlib.rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "By reservation",
    longitude: 24.9594512,
    latitude: 60.166672
  },
  {
    id: 13,
    name: "Talin Sauna",
    distance: "6.2 km",
    rating: 4.3,
    reviews: 55,
    address: "15 Talin Puistotie, Helsinki",
    available: true,
    capacity: "5/12 spots",
    image: "httpss://images.unsplash.com/photo-1757940113920-69e3686438d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYSUyMGludGVyaW9yfGVufDF8fHx8MTc2MzE0NjY2Mnww&ixlib.rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "Open until 9 PM",
    longitude: 24.8599904,
    latitude: 60.2142492
  },
  {
    id: 14,
    name: "Saunasaari",
    distance: "4.0 km (by boat)",
    rating: 4.7,
    reviews: 180,
    address: "Saunasaari Island, Helsinki",
    available: true,
    capacity: "10/25 spots",
    image: "https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzA3ww&ixlib.rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    hours: "By reservation",
    longitude: 25.0109584,
    latitude: 60.1563315
  }
];

interface FindSaunasProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
}

export function FindSaunas({ scrollContainerRef }: FindSaunasProps) {
  const [activeTab, setActiveTab] = useState<"find" | "tbd">("find");
  const [selectedSauna, setSelectedSauna] = useState<number | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMap, setShowMap] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [visitedSaunas, setVisitedSaunas] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSaunas = saunas.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.trim().toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      (s.distance && s.distance.toLowerCase().includes(q))
    );
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [centerSignal, setCenterSignal] = useState(0);

  const detectLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation not supported in this browser');
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(coords);
        // also center map immediately
        setCenterSignal((s) => s + 1);
      },
      (err) => {
        setLocating(false);
        setLocationError(err.message || 'Unable to get location');
      },
      { enableHighAccuracy: true, maximumAge: 1000 * 60 * 5 }
    );
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('visitedSaunas');
      if (raw) setVisitedSaunas(JSON.parse(raw));
    } catch (e) {
      // ignore malformed data
    }
  }, []);

  const toggleVisited = (saunaId: number) => {
    setVisitedSaunas(prev => {
      const exists = prev.includes(saunaId);
      const next = exists ? prev.filter((id) => id !== saunaId) : [...prev, saunaId];
      try {
        localStorage.setItem('visitedSaunas', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleSaunaClick = (saunaId: number) => {
    setShowMap(false);
    setSelectedSauna(saunaId);
    const targetElement = document.getElementById(`sauna-card-${saunaId}`);
    const scrollContainer = scrollContainerRef.current;

    if (targetElement && scrollContainer) {
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const targetTop = targetElement.getBoundingClientRect().top;
      const currentScrollTop = scrollContainer.scrollTop;
      const scrollToPosition = targetTop - containerTop + currentScrollTop - 16;
      scrollContainer.scrollTo({
        top: scrollToPosition > 0 ? scrollToPosition : 0,
        behavior: 'smooth'
      });
      const allCards = document.querySelectorAll('.sauna-scroll-highlight');
      allCards.forEach((card) => {
        card.classList.remove('sauna-scroll-highlight');
      });
      targetElement.classList.add('sauna-scroll-highlight');
      setTimeout(() => {
        if (targetElement) {
          targetElement.classList.remove('sauna-scroll-highlight');
        }
      }, 3000);
    } else {
      console.warn("Could not find targetElement or scrollContainer ref");
    }
  };

  return (
    <div className="min-h-full bg-[#FFEBCD]">
      {/* Tab Toggle */}
      <div className="flex w-full">
        <button
          onClick={() => setActiveTab("find")}
          className={`flex-1 py-4 text-center transition-all ${
            activeTab === "find"
              ? "bg-[#3E2723] text-white"
              : "bg-[#8B7355]/20 text-[#5C4033] hover:bg-[#8B7355]/30"
          }`}
        >
          Find Saunas
        </button>
        <button
          onClick={() => setActiveTab("tbd")}
          className={`flex-1 py-4 text-center transition-all ${
            activeTab === "tbd"
              ? "bg-[#3E2723] text-white"
              : "bg-[#8B7355]/20 text-[#5C4033] hover:bg-[#8B7355]/30"
          }`}
        >
          Discover
        </button>
      </div>

      {/* Find Saunas Tab Content */}
      {activeTab === "find" && (
        <>
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
              
              <div className="relative flex items-center gap-2">
                <Input
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  placeholder="Search saunas or address..."
                  className="pl-4 bg-white/90 backdrop-blur-sm border-white/40 placeholder:text-gray-500"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2"
                  onClick={detectLocation}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  {locating ? 'Locating...' : 'Locate'}
                </Button>
                {userLocation && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-1 text-white/90"
                    onClick={() => setCenterSignal((s) => s + 1)}
                  >
                    Center on me
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          {showMap && (
            <div className="h-96">
              <Map
                listedSaunas={filteredSaunas}
                onListedSaunaClick={handleSaunaClick}
                visitedSaunaIds={visitedSaunas}
                userLocation={userLocation}
                centerSignal={centerSignal}
              />
            </div>
          )}

          {/* Sauna List */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              {selectedSauna ? (
                <>
                  <h3 className="text-[#3E2723]">Sauna Details</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#8B7355] text-[#5C4033]"
                    onClick={() => {
                      setSelectedSauna(null);
                      setShowMap(true);
                    }}
                  >
                    Back to List
                  </Button>
                </>
              ) : (
                  <>
                  <h3 className="text-[#3E2723]">Nearby Saunas</h3>
                  <span className="text-[#6D5A47] text-sm">{filteredSaunas.length} results</span>
                </>
              )}
            </div>

            <div className="space-y-4" ref={scrollContainerRef}>
              {(selectedSauna
                ? saunas.filter((s) => s.id === selectedSauna)
                : filteredSaunas
              ).map((sauna) => (
                <div
                  key={sauna.id}
                  id={`sauna-card-${sauna.id}`}
                  className="relative overflow-hidden rounded-2xl shadow-lg"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')"
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

                      {visitedSaunas.includes(sauna.id) && (
                        <div className="absolute top-12 left-3 bg-emerald-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                          Visited
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

                      <div className="grid grid-cols-3 gap-3">
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-[#8B7355] text-[#5C4033] hover:bg-[#FFEBCD]"
                          onClick={() => toggleVisited(sauna.id)}
                        >
                          {visitedSaunas.includes(sauna.id) ? (
                            <><Minus className="w-4 h-4 mr-1" />Unvisit</>
                          ) : (
                            <><Plus className="w-4 h-4 mr-1" />Visited</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Discover Tab Content */}
      {activeTab === "tbd" && (
        <div className="px-6 py-6 space-y-4">
          <div className="mb-4">
            <h3 className="text-[#3E2723] mb-2">
              Explore Sauna Cultures
            </h3>
            <p className="text-[#5C4033]/80 text-sm">
              Immersive programs created by enthusiasts
              worldwide
            </p>
          </div>

          <CultureCard
            culture="Finnish Sauna"
            creator="Nordic Traditions"
            followers={2847}
            description="Traditional Finnish sauna experience with proper löyly techniques, birch whisks, and cooling rituals."
            temperature="80-90°C"
            duration="45-60 min"
            sessions={156}
            accessories={[
              {
                name: "Harvia Sauna Bucket & Ladle Set",
                category: "Essentials",
                price: "€82.90",
                description:
                  "Premium pine wood bucket (5L) with matching ladle. Traditional Finnish craftsmanship.",
                image:
                  "https://images.unsplash.com/photo-1759300031446-88e81c8a26c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzYXVuYSUyMGJ1Y2tldCUyMGxhZGxlfGVufDF8fHx8MTc2MzIxMzkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SA007/sauna-set-black-steel",
              },
              {
                name: "Harvia Sauna Stones 20kg",
                category: "Heating",
                price: "€42.90",
                description:
                  "Natural olivine diabase stones. Excellent heat retention and steam generation.",
                image:
                  "https://images.unsplash.com/photo-1717152244259-80c400b20056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b25lcyUyMGhlYXRlcnxlbnwxfHx8fDE3NjMyMTM5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/AC3000/sauna-heater-stones-510-cm-20-kg",
              },
              {
                name: "Harvia Sauna Scent Eucalyptus",
                category: "Aromatics",
                price: "€15.90",
                description:
                  "100% natural eucalyptus essential oil. 250ml bottle, refreshing Nordic aroma.",
                image:
                  "https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGVzfGVufDF8fHx8MTc2MzIxMzkxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SAC25021/sauna-scent-eucalyptus-400-ml",
              },
              {
                name: "Harvia Thermometer-Hygrometer SAA110",
                category: "Instruments",
                price: "€48.90",
                description:
                  "Combination instrument with aspen frame. Measures temperature and humidity.",
                image:
                  "https://images.unsplash.com/photo-1757940808417-d965e482eacb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHRoZXJtb21ldGVyJTIwaHlncm9tZXRlcnxlbnwxfHx8fDE3NjMyMTM5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SAS92300/thermohygrometer",
              },
              {
                name: "Finnish Birch Vihta",
                category: "Whisks",
                price: "€22.50",
                description:
                  "Fresh birch whisk for traditional löyly massage. Authentic Finnish experience.",
                image:
                  "https://images.unsplash.com/photo-1763062897323-14ad7eab1c34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJjaCUyMGJyYW5jaGVzJTIwbmF0dXJhbHxlbnwxfHx8fDE3NjMyMTM5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SAC80100/sauna-whisk-birch",
              },
              {
                name: "Harvia Bench Pillow SAS24000",
                category: "Comfort",
                price: "€32.90",
                description:
                  "Premium bench pillow 300x390mm. Soft cushioning for enhanced comfort during sauna sessions.",
                image:
                  "https://images.unsplash.com/photo-1706048111522-e4865f909940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMGhlYWRyZXN0JTIwd29vZHxlbnwxfHx8fDE3NjMyMTM5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SAS24000/bench-pillow-300x390-mm",
              },
            ]}
          />
          <CultureCard
            culture="Japanese Onsen"
            creator="Tokyo Wellness"
            followers={1923}
            description="Authentic Japanese hot spring experience focusing on mindfulness, relaxation, and rotenburo philosophy."
            temperature="38-42°C"
            duration="30-40 min"
            sessions={89}
            accessories={[
              {
                name: "Harvia Steam Generator",
                category: "Equipment",
                price: "€1,890.00",
                description:
                  "Professional steam generator for gentle humid heat. Perfect for lower temperature bathing.",
                image:
                  "https://images.unsplash.com/photo-1758873263491-f3969d8c6fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhbSUyMGdlbmVyYXRvciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjMyMTM5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/steam-generators",
              },
              {
                name: "Harvia Fragrance Pump ZG-900",
                category: "Aromatics",
                price: "€36.90",
                description:
                  "Manual fragrance pump for sauna scents. Easy dosing for perfect aroma intensity.",
                image:
                  "https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGVzfGVufDF8fHx8MTc2MzIxMzkxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/ZG-900/fragrance-pump",
              },
              {
                name: "Harvia Legend Bucket SASPO100",
                category: "Essentials",
                price: "€49.90",
                description:
                  "4L aspen wood sauna bucket. Heat-treated Nordic wood with ergonomic handle.",
                image:
                  "https://images.unsplash.com/photo-1759300031446-88e81c8a26c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzYXVuYSUyMGJ1Y2tldCUyMGxhZGxlfGVufDF8fHx8MTc2MzIxMzkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SASPO100/legend-bucket",
              },
              {
                name: "Harvia Steel Sauna Light SAS21106",
                category: "Lighting",
                price: "€89.90",
                description:
                  "Premium steel frame sauna light. Modern design with heat-resistant glass for authentic ambiance.",
                image:
                  "https://images.unsplash.com/photo-1743286159555-ea765c1bc5e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMGxpZ2h0JTIwZml4dHVyZXxlbnwxfHx8fDE3NjMyMTM5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/fi/tuotteet/SAS21106/saunavalaisin-steel",
              },
            ]}
          />
          <CultureCard
            culture="Russian Banya"
            creator="Moscow Heat Club"
            followers={1456}
            description="Traditional Russian banya with veniks (oak/birch bundles), contrast therapy, and steam rituals."
            temperature="70-90°C"
            duration="90-120 min"
            sessions={124}
            accessories={[
              {
                name: "Oak Venik Bundle",
                category: "Whisks",
                price: "€24.90",
                description:
                  "Premium oak leaf whisk for banya massage. Traditional Russian preparation.",
                image:
                  "https://images.unsplash.com/photo-1763062897323-14ad7eab1c34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJjaCUyMGJyYW5jaGVzJTIwbmF0dXJhbHxlbnwxfHx8fDE3NjMyMTM5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/sauna-accessories/vihta-whisk",
              },
              {
                name: "Traditional Felt Sauna Hat",
                category: "Protection",
                price: "€32.90",
                description:
                  "Authentic wool felt hat. Protects head from extreme heat during intense sessions.",
                image:
                  "https://images.unsplash.com/photo-1630691650107-53dd500d2907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZWx0JTIwc2F1bmElMjBoYXR8ZW58MXx8fHwxNzYzMjEzOTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/sauna-accessories/sauna-hats",
              },
              {
                name: "Harvia Sauna Set Steel SA006",
                category: "Equipment",
                price: "€79.90",
                description:
                  "Premium steel bucket and ladle set. Durable construction for intense banya sessions.",
                image:
                  "https://images.unsplash.com/photo-1759300031446-88e81c8a26c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzYXVuYSUyMGJ1Y2tldCUyMGxhZGxlfGVufDF8fHx8MTc2MzIxMzkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SA006/sauna-set-steel",
              },
              {
                name: "Harvia Sauna Stones 20kg",
                category: "Heating",
                price: "€42.90",
                description:
                  "High-quality stones for maximum steam. Perfect for banya's intense heat cycles.",
                image:
                  "https://images.unsplash.com/photo-1717152244259-80c400b20056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b25lcyUyMGhlYXRlcnxlbnwxfHx8fDE3NjMyMTM5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/AC3000/sauna-heater-stones-510-cm-20-kg",
              },
              {
                name: "Harvia Eucalyptus Sauna Scent",
                category: "Aromatics",
                price: "€15.90",
                description:
                  "Natural eucalyptus essential oil. Enhances breathing and traditional experience.",
                image:
                  "https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGVzfGVufDF8fHx8MTc2MzIxMzkxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/SAC25021/sauna-scent-eucalyptus-400-ml",
              },
            ]}
          />
          <CultureCard
            culture="Turkish Hammam"
            creator="Istanbul Spa Heritage"
            followers={1678}
            description="Classic Turkish bath experience with marble stones, soap massage traditions, and gradual heat zones."
            temperature="40-50°C"
            duration="60-90 min"
            sessions={98}
            accessories={[
              {
                name: "Harvia Steam Generator HGP",
                category: "Equipment",
                price: "€2,190.00",
                description:
                  "Professional steam system. Creates authentic hammam humidity and warmth.",
                image:
                  "https://images.unsplash.com/photo-1758873263491-f3969d8c6fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhbSUyMGdlbmVyYXRvciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjMyMTM5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/steam-generators",
              },
              {
                name: "Traditional Copper Hammam Bowl",
                category: "Accessories",
                price: "€64.90",
                description:
                  "Handcrafted copper bathing bowl. Traditional Turkish design for water rituals.",
                image:
                  "https://images.unsplash.com/photo-1761210719325-283557e92487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3BwZXIlMjBib3dsJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzYzMjEzOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/sauna-accessories/hammam-bowls",
              },
              {
                name: "Natural Olive Oil Soap Set",
                category: "Cleansing",
                price: "€29.90",
                description:
                  "Authentic hammam soap collection. 100% natural olive oil, traditional formula.",
                image:
                  "https://images.unsplash.com/photo-1678799021566-2e2a748e9dd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc29hcCUyMG9saXZlfGVufDF8fHx8MTc2MzIxMzkxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/sauna-accessories/sauna-soaps",
              },
              {
                name: "Harvia Towel Rack SAA150",
                category: "Comfort",
                price: "€78.90",
                description:
                  "Heat-treated wooden towel rack. Perfect for hammam changing areas.",
                image:
                  "https://images.unsplash.com/photo-1664227431098-1289c13695c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB0b3dlbCUyMHJhY2t8ZW58MXx8fHwxNzYzMjEzOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/products/sauna-accessories/towel-racks",
              },
              {
                name: "Harvia Sauna Scent Oriental",
                category: "Aromatics",
                price: "€18.90",
                description:
                  "Exotic blend of spices and herbs. Traditional hammam fragrance experience.",
                image:
                  "https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGVzfGVufDF8fHx8MTc2MzIxMzkxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                link: "https://www.harvia.com/en/ideas-and-trends/products/harvia-sauna-scents-activate-your-senses-and-lift-the-sauna-atmosphere/",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}

// Culture Card Component
function CultureCard({
  culture,
  creator,
  followers,
  description,
  temperature,
  duration,
  sessions,
  accessories,
}: any) {
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95" />

      <div className="relative p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-white mb-1">{culture}</h4>
            <p className="text-white/70 text-xs">
              by {creator}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-0"
          >
            <Globe className="w-3 h-3 mr-1" />
            {followers}
          </Badge>
        </div>

        <p className="text-white/80 text-sm leading-relaxed mb-3">
          {description}
        </p>

        <div className="flex items-center gap-4 text-xs text-white/70 mb-3">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {temperature}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {sessions} sessions
          </span>
        </div>

        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/40"
          >
            Try This Culture
          </Button>
          <Dialog
            open={accessoriesOpen}
            onOpenChange={setAccessoriesOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-white/40 text-[rgb(0,0,0)] hover:bg-white/10 group relative"
              >
                <ShoppingBag className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">
                  Accessories
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#FFEBCD] border-[#8B7355] max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-[#3E2723]">
                  Enhance Your {culture} Experience
                </DialogTitle>
                <DialogDescription className="text-[#5C4033]/80 text-sm mt-1">
                  Authentic accessories for a more immersive
                  sauna session
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {accessories.map((accessory: any) => (
                  <div
                    key={accessory.name}
                    className="relative overflow-hidden rounded-xl shadow-md bg-white/60 p-4 border border-[#8B7355]/20 hover:border-[#8B7355]/40 transition-colors group"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                        <ImageWithFallback
                          src={accessory.image}
                          alt={accessory.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="text-[#3E2723] mb-1">
                              {accessory.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="border-[#8B7355] text-[#5C4033] text-xs mb-2"
                            >
                              {accessory.category}
                            </Badge>
                          </div>
                          <p className="text-[#3E2723]">
                            {accessory.price}
                          </p>
                        </div>
                        <p className="text-[#5C4033]/80 text-sm mb-3 leading-relaxed">
                          {accessory.description}
                        </p>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
                          onClick={() =>
                            accessory.link &&
                            window.open(
                              accessory.link,
                              "_blank",
                            )
                          }
                        >
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-[#8B7355]/10 rounded-xl border border-[#8B7355]/30">
                  <p className="text-[#5C4033] text-sm">
                    <strong>Bundle & Save:</strong> Purchase all {culture} essentials together and save 15% on your order!
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Bundles Coming Soon!
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subtle accessories preview */}
        <div className="pt-3 border-t border-white/20">
          <button
            onClick={() => setAccessoriesOpen(true)}
            className="w-full text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Recommended Accessories
              </span>
              <span className="text-white/60 text-xs group-hover:text-white/80 transition-colors">
                View all {accessories.length} →
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {accessories.slice(0, 2).map((accessory: any) => (
                <div
                  key={accessory.name}
                  className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 group-hover:border-white/40 transition-colors"
                >
                  <p className="text-white text-xs mb-0.5">
                    {accessory.name}
                  </p>
                  <p className="text-white/60 text-xs">
                    {accessory.price}
                  </p>
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
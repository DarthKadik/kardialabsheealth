
import React, { RefObject } from 'react'; // <-- Import RefObject
import Map from './Map';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapPin, Star, Navigation, Clock, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sauna } from '../types';

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

// 1. Define the props interface to accept the ref
interface FindSaunasProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
}

// 2. Accept the prop in your component
export function FindSaunas({ scrollContainerRef }: FindSaunasProps) {

  // 3. This is the corrected scroll function
  const handleSaunaClick = (saunaId: number) => {
    const targetElement = document.getElementById(`sauna-card-${saunaId}`);
    
    // 4. Use the ref directly from props
    const scrollContainer = scrollContainerRef.current;

    if (targetElement && scrollContainer) {
      
      // 5. This logic is now reliable because it uses the correct container
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const targetTop = targetElement.getBoundingClientRect().top;
      const currentScrollTop = scrollContainer.scrollTop;

      // Calculate the final position with 16px padding from the top
      const scrollToPosition = targetTop - containerTop + currentScrollTop - 16; 

      scrollContainer.scrollTo({
        top: scrollToPosition > 0 ? scrollToPosition : 0, // Prevent negative scroll
        behavior: 'smooth'
      });
      
      // --- Improved Highlight Logic ---
      const allCards = document.querySelectorAll('.sauna-scroll-highlight');
      allCards.forEach((card) => {
        card.classList.remove('sauna-scroll-highlight');
      });

      targetElement.classList.add('sauna-scroll-highlight');

      setTimeout(() => {
        if (targetElement) {
          targetElement.classList.remove('sauna-scroll-highlight');
        }
      }, 3000); // Highlight lasts 3 seconds

    } else {
      console.warn("Could not find targetElement or scrollContainer ref");
    }
  };

  return (
    <div className="bg-[#FFEBCD]">
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

      {/* Map */}
      <div className="h-96">
        <Map listedSaunas={saunas} onListedSaunaClick={handleSaunaClick} />
      </div>

      {/* Sauna List */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#3E2723]">Nearby Saunas</h3>
          <span className="text-[#6D5A47] text-sm">{saunas.length} results</span>
        </div>

        <style>{`
          .sauna-scroll-highlight {
            box-shadow: 0 0 0 4px #FFD700, 0 2px 8px rgba(0,0,0,0.15);
            transition: box-shadow 0.3s;
            z-index: 10;
            position: relative;
          }
        `}</style>
        <div className="space-y-4">
          {saunas.map((sauna) => (
            <div key={sauna.id} id={`sauna-card-${sauna.id}`} className="relative overflow-hidden rounded-2xl shadow-lg">
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
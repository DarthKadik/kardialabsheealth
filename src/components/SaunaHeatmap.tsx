import { useEffect, useState } from "react";

interface HeatZone {
  x: number;
  y: number;
  temp: number;
  radius: number;
}

export function SaunaHeatmap() {
  const [baseTemp] = useState(85);
  const [tempVariation, setTempVariation] = useState(0);

  // Simulate real-time temperature fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setTempVariation((Math.random() - 0.5) * 3);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Heat zones with realistic distribution
  const heatZones: HeatZone[] = [
    // Stove area (hottest - bottom right)
    { x: 75, y: 70, temp: baseTemp + 10 + tempVariation, radius: 100 },
    { x: 75, y: 70, temp: baseTemp + 8 + tempVariation, radius: 140 },
    
    // Upper corners (warm)
    { x: 20, y: 20, temp: baseTemp + 5 + tempVariation, radius: 80 },
    { x: 80, y: 20, temp: baseTemp + 6 + tempVariation, radius: 80 },
    
    // Center areas (moderate)
    { x: 40, y: 50, temp: baseTemp + 2 + tempVariation, radius: 90 },
    { x: 50, y: 35, temp: baseTemp + 1 + tempVariation, radius: 85 },
    
    // Near door (cooler - bottom left)
    { x: 20, y: 75, temp: baseTemp - 3 + tempVariation, radius: 70 },
  ];

  const getColorForTemp = (temp: number) => {
    if (temp >= 93) return "#D2691E"; // Saddle brown (dark)
    if (temp >= 90) return "#CD853F"; // Peru
    if (temp >= 87) return "#DEB887"; // Burlywood
    if (temp >= 84) return "#F5DEB3"; // Wheat
    if (temp >= 81) return "#FFE4B5"; // Moccasin
    return "#FFEFD5"; // Papaya whip
  };

  const avgTemp = heatZones.reduce((sum, zone) => sum + zone.temp, 0) / heatZones.length;

  return (
    <div className="relative">
      {/* Heatmap Visualization - Bird's Eye View */}
      <div className="relative aspect-square bg-[#FFEBCD] rounded-2xl border-2 border-[#8B7355]/30 overflow-hidden shadow-lg">
        
        {/* Heat overlay with smooth gradients */}
        <svg className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "multiply" }}>
          <defs>
            {heatZones.map((zone, idx) => (
              <radialGradient key={idx} id={`heat-gradient-${idx}`}>
                <stop offset="0%" stopColor={getColorForTemp(zone.temp)} stopOpacity="0.8" />
                <stop offset="40%" stopColor={getColorForTemp(zone.temp)} stopOpacity="0.5" />
                <stop offset="70%" stopColor={getColorForTemp(zone.temp - 3)} stopOpacity="0.3" />
                <stop offset="100%" stopColor={getColorForTemp(zone.temp - 5)} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          {heatZones.map((zone, idx) => (
            <circle
              key={idx}
              cx={`${zone.x}%`}
              cy={`${zone.y}%`}
              r={zone.radius}
              fill={`url(#heat-gradient-${idx})`}
              className="transition-all duration-2000 ease-in-out"
            />
          ))}
        </svg>

        {/* Floor plan elements */}
        <div className="absolute inset-0 p-4">
          
          {/* Benches - L-shaped seating */}
          {/* Top bench */}
          <div className="absolute top-4 left-4 right-4 h-12 bg-[#8B7355]/40 border-2 border-[#6D5A47]/50 rounded-lg backdrop-blur-sm">
            <div className="absolute inset-1 flex gap-1">
              <div className="flex-1 border-r border-[#6D5A47]/30"></div>
              <div className="flex-1 border-r border-[#6D5A47]/30"></div>
              <div className="flex-1"></div>
            </div>
          </div>
          
          {/* Left bench */}
          <div className="absolute top-20 left-4 bottom-4 w-12 bg-[#8B7355]/40 border-2 border-[#6D5A47]/50 rounded-lg backdrop-blur-sm">
            <div className="absolute inset-1 flex flex-col gap-1">
              <div className="flex-1 border-b border-[#6D5A47]/30"></div>
              <div className="flex-1 border-b border-[#6D5A47]/30"></div>
              <div className="flex-1"></div>
            </div>
          </div>

          {/* Stove - bottom right corner */}
          <div className="absolute bottom-6 right-6 w-16 h-16">
            {/* Stove glow */}
            <div className="absolute inset-0 bg-[#CD853F]/30 rounded-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#CD853F] to-[#8B7355] rounded-lg border-2 border-[#6D5A47] shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-6 h-6 mx-auto mb-1 bg-white/90 rounded-full"></div>
                <span className="text-xs text-white">Stove</span>
              </div>
            </div>
            {/* Heat waves */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#CD853F]/20 rounded-full animate-ping"></div>
          </div>

          {/* Door - bottom left */}
          <div className="absolute bottom-4 left-20 w-16 h-3">
            <div className="w-full h-full bg-[#5C4033]/60 border border-[#3E2723]/70 rounded-sm backdrop-blur-sm">
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-1 h-1 bg-[#8B7355] rounded-full"></div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#5C4033] bg-white/80 px-1 rounded">
              Door
            </div>
          </div>

        </div>

        {/* Live indicator */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8B7355] animate-pulse"></div>
            <span className="text-xs text-[#3E2723]">Live</span>
          </div>
        </div>

        {/* Average temp indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#CD853F] to-[#8B7355]"></div>
            <span className="text-xs text-[#3E2723]">{avgTemp.toFixed(1)}°C</span>
          </div>
        </div>

      </div>

      {/* Temperature legend */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5C4033]">Temperature Distribution</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5C4033]/70">Cool</span>
          <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-[#FFEFD5] via-[#DEB887] via-[#CD853F] to-[#8B7355]"></div>
          <span className="text-xs text-[#5C4033]/70">Hot</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#5C4033]/70 px-1">
          <span>82°C</span>
          <span>87°C</span>
          <span>92°C</span>
          <span>97°C</span>
        </div>
      </div>

      {/* Key areas */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white/60 border border-[#8B7355]/30 rounded-lg p-2 text-center">
          <div className="w-3 h-3 bg-gradient-to-br from-[#CD853F] to-[#8B7355] rounded-full mx-auto mb-1"></div>
          <p className="text-[#5C4033]/80">Near Stove</p>
          <p className="text-[#3E2723]">{(baseTemp + 10 + tempVariation).toFixed(1)}°C</p>
        </div>
        <div className="bg-white/60 border border-[#8B7355]/30 rounded-lg p-2 text-center">
          <div className="w-3 h-3 bg-[#DEB887] rounded-full mx-auto mb-1"></div>
          <p className="text-[#5C4033]/80">Corners</p>
          <p className="text-[#3E2723]">{(baseTemp + 5 + tempVariation).toFixed(1)}°C</p>
        </div>
        <div className="bg-white/60 border border-[#8B7355]/30 rounded-lg p-2 text-center">
          <div className="w-3 h-3 bg-[#F5DEB3] rounded-full mx-auto mb-1"></div>
          <p className="text-[#5C4033]/80">Near Door</p>
          <p className="text-[#3E2723]">{(baseTemp - 3 + tempVariation).toFixed(1)}°C</p>
        </div>
      </div>
    </div>
  );
}
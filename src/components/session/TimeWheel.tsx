import React from "react";

interface TimeWheelProps {
  value: string; // "HH:MM"
  onChange: (newValue: string) => void;
}

export function TimeWheel({ value, onChange }: TimeWheelProps) {
  const [hStr, mStr] = value.split(":");
  const hour = parseInt(hStr, 10) || 0;
  const minute = parseInt(mStr, 10) || 0;

  const itemHeight = 40;

  const onHourScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const totalItems = 24;
    const sets = 3;
    const index = Math.round(scrollTop / itemHeight);
    const nextHour = index % totalItems;
    onChange(`${String(nextHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);

    const middleSetStart = totalItems + 1;
    const nearTop = index < totalItems / 2;
    const nearBottom = index > sets * totalItems - totalItems / 2;
    if ((nearTop || nearBottom) && !element.dataset.jumping) {
      element.dataset.jumping = "true";
      requestAnimationFrame(() => {
        element.scrollTop = (middleSetStart + nextHour) * itemHeight;
        setTimeout(() => delete element.dataset.jumping, 100);
      });
    }
  };

  const onMinuteScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const totalItems = 60;
    const sets = 3;
    const index = Math.round(scrollTop / itemHeight);
    const nextMinute = index % totalItems;
    onChange(`${String(hour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`);

    const middleSetStart = totalItems + 1;
    const nearTop = index < totalItems / 2;
    const nearBottom = index > sets * totalItems - totalItems / 2;
    if ((nearTop || nearBottom) && !element.dataset.jumping) {
      element.dataset.jumping = "true";
      requestAnimationFrame(() => {
        element.scrollTop = (middleSetStart + nextMinute) * itemHeight;
        setTimeout(() => delete element.dataset.jumping, 100);
      });
    }
  };

  return (
    <div className="w-full bg-white/60 border border-[#8B7355]/30 rounded-xl p-4">
      <div className="flex items-center justify-center gap-2">
        <div className="relative h-32 w-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/60 to-transparent" />
            <div className="absolute top-[44px] left-0 right-0 h-10 border-y-2 border-[#8B7355]/30 bg-[#8B7355]/5" />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/60 to-transparent" />
          </div>
          <div
            className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            onScroll={onHourScroll}
            ref={(el) => {
              if (el && !el.dataset.initialized) {
                el.dataset.initialized = "true";
                const middleSetStart = 24 + 1;
                el.scrollTop = (middleSetStart + hour) * itemHeight;
              }
            }}
          >
            <div className="h-10" />
            {Array.from({ length: 3 }, (_, set) =>
              Array.from({ length: 24 }, (_, i) => (
                <div key={`${set}-${i}`} className="h-10 flex items-center justify-center snap-center text-[#3E2723] text-lg">
                  {String(i).padStart(2, "0")}
                </div>
              )),
            )}
            <div className="h-10" />
          </div>
        </div>

        <span className="text-[#3E2723] text-2xl font-semibold">:</span>

        <div className="relative h-32 w-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/60 to-transparent" />
            <div className="absolute top-[44px] left-0 right-0 h-10 border-y-2 border-[#8B7355]/30 bg-[#8B7355]/5" />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white/60 to-transparent" />
          </div>
          <div
            className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            onScroll={onMinuteScroll}
            ref={(el) => {
              if (el && !el.dataset.initialized) {
                el.dataset.initialized = "true";
                const middleSetStart = 60 + 1;
                el.scrollTop = (middleSetStart + minute) * itemHeight;
              }
            }}
          >
            <div className="h-10" />
            {Array.from({ length: 3 }, (_, set) =>
              Array.from({ length: 60 }, (_, i) => (
                <div key={`${set}-${i}`} className="h-10 flex items-center justify-center snap-center text-[#3E2723] text-lg">
                  {String(i).padStart(2, "0")}
                </div>
              )),
            )}
            <div className="h-10" />
          </div>
        </div>
      </div>
    </div>
  );
}



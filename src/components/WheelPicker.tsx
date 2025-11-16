import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface WheelPickerProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onValueChange: (value: number) => void;
  onClose: () => void;
}

export function WheelPicker({
  label,
  value,
  min,
  max,
  step,
  unit,
  onValueChange,
  onClose,
}: WheelPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const itemHeight = 48; // Height of each item in pixels

  // Generate array of values
  const values = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  // Scroll to selected value on mount
  useEffect(() => {
    if (scrollRef.current) {
      const index = values.indexOf(value);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * itemHeight;
      }
    }
  }, []);

  // Handle scroll to update selected value
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newValue = values[index];
      if (newValue !== undefined) {
        setSelectedValue(newValue);
      }
    }
  };

  // Snap to nearest item when scroll ends
  useEffect(() => {
    if (!scrollRef.current) return;

    let scrollTimeout: NodeJS.Timeout;
    const container = scrollRef.current;

    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        container.scrollTo({
          top: index * itemHeight,
          behavior: "smooth",
        });
      }, 100);
    };

    container.addEventListener("scroll", handleScrollEnd);
    return () => {
      container.removeEventListener("scroll", handleScrollEnd);
      clearTimeout(scrollTimeout);
    };
  }, [itemHeight]);

  const handleConfirm = () => {
    onValueChange(selectedValue);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Picker Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white rounded-t-3xl shadow-2xl max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-[#3E2723]">{label}</h3>
            <button
              onClick={onClose}
              className="text-[#5C4033]/60 hover:text-[#5C4033]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wheel Container */}
          <div className="relative h-64 overflow-hidden">
            {/* Selection Highlight */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gradient-to-r from-[#8B7355]/10 to-[#6D5A47]/10 border-y-2 border-[#8B7355]/30 pointer-events-none z-10" />

            {/* Fade overlays */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

            {/* Scrollable wheel */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-scroll scrollbar-hide"
              style={{
                scrollSnapType: "y mandatory",
                paddingTop: "calc(50% - 24px)",
                paddingBottom: "calc(50% - 24px)",
              }}
            >
              {values.map((val) => (
                <div
                  key={val}
                  className="flex items-center justify-center transition-all duration-150"
                  style={{
                    height: `${itemHeight}px`,
                    scrollSnapAlign: "center",
                    scrollSnapStop: "always",
                    opacity: val === selectedValue ? 1 : 0.3,
                    transform:
                      val === selectedValue ? "scale(1.1)" : "scale(0.9)",
                    lineHeight: `${itemHeight}px`,
                  }}
                >
                  <span className="text-2xl text-[#3E2723] select-none" style={{ lineHeight: "1" }}>
                    {val}
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { X } from "lucide-react";
import { DropIndicator } from "./DropIndicator";

interface Interval {
  id: number;
  type: "sauna" | "break";
  duration: number;
  temperature?: "mellow" | "warm" | "hot" | "intense";
}

interface DraggableIntervalProps {
  interval: Interval;
  index: number;
  moveInterval: (dragIndex: number, hoverIndex: number) => void;
  updateInterval: (id: number, duration: number) => void;
  removeInterval: (id: number) => void;
  intervals: Interval[];
  setIntervals: (intervals: Interval[]) => void;
  dropIndicator: { index: number; show: boolean };
  setDropIndicator: (position: { index: number; show: boolean }) => void;
}

const ItemType = "INTERVAL";

export function DraggableInterval({
  interval,
  index,
  moveInterval,
  updateInterval,
  removeInterval,
  intervals,
  setIntervals,
  dropIndicator,
  setDropIndicator,
}: DraggableIntervalProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index, id: interval.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setDropIndicator({ index: -1, show: false });
    },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number; id: number }, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        setDropIndicator({ index: -1, show: false });
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed 40% of the item's height
      // When dragging downwards, only move when the cursor is below 40%
      // When dragging upwards, only move when the cursor is above 60%
      const threshold = 0.4;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY * threshold * 2) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY * (2 - threshold * 2)) {
        return;
      }

      // Determine if we should show indicator above or below
      const showAbove = hoverClientY < hoverMiddleY;
      
      // Show drop indicator
      if (dragIndex !== hoverIndex) {
        setDropIndicator({ 
          index: showAbove ? hoverIndex : hoverIndex + 1, 
          show: true 
        });
      }

      // Time to actually perform the action
      moveInterval(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop: () => {
      setDropIndicator({ index: -1, show: false });
    },
  });

  drag(drop(ref));

  return (
    <>
      {/* Drop indicator above this item */}
      {dropIndicator.index === index && <DropIndicator show={dropIndicator.show} />}
      
      <div
        ref={ref}
        className={`flex items-center gap-2 bg-white/60 p-3 rounded-lg transition-all ${
          isDragging ? "opacity-30 scale-95" : "opacity-100 scale-100"
        }`}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Drag Handle */}
        <div className="flex flex-col gap-0.5 text-[#8B7355]/40 cursor-grab active:cursor-grabbing hover:text-[#8B7355]/70 transition-colors">
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
          <div className="w-1 h-1 rounded-full bg-current" />
        </div>

        <span className="text-sm text-[#5C4033] min-w-[50px]">
          {index + 1}. {interval.type === "sauna" ? "Sauna" : "Break"}
        </span>
        
        <input
          type="number"
          value={interval.duration}
          onChange={(e) => updateInterval(interval.id, parseInt(e.target.value) || 0)}
          className="w-14 px-2 py-1 bg-white/60 border border-[#8B7355]/30 rounded text-[#3E2723] text-sm text-center"
          min="1"
        />
        <span className="text-sm text-[#5C4033]">min</span>
        
        {/* Temperature Level (only for sauna intervals) */}
        {interval.type === "sauna" && (
          <div className="flex-1 flex items-center gap-1">
            <select
              value={interval.temperature || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  const { temperature, ...rest } = interval;
                  setIntervals(intervals.map(i => i.id === interval.id ? rest as Interval : i));
                } else {
                  setIntervals(intervals.map(i => i.id === interval.id ? { ...i, temperature: value as "mellow" | "warm" | "hot" | "intense" } : i));
                }
              }}
              className="flex-1 px-2 py-1 bg-white/60 border border-[#8B7355]/30 rounded text-[#3E2723] text-xs"
            >
              <option value="">Temp.</option>
              <option value="mellow">Mellow</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="intense">Intense</option>
            </select>
          </div>
        )}
        
        <button
          onClick={() => removeInterval(interval.id)}
          className="text-[#5C4033] hover:text-[#3E2723] ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Drop indicator below the last item */}
      {dropIndicator.index === index + 1 && index === intervals.length - 1 && (
        <DropIndicator show={dropIndicator.show} />
      )}
    </>
  );
}

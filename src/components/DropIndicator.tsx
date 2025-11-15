interface DropIndicatorProps {
  show: boolean;
}

export function DropIndicator({ show }: DropIndicatorProps) {
  return (
    <div 
      className={`transition-all duration-150 ease-out ${
        show ? "h-0.5 my-1 opacity-100" : "h-0 my-0 opacity-0"
      }`}
    >
      <div className="relative w-full h-full">
        {/* Main line */}
        <div className="absolute inset-0 bg-[#6D5A47] rounded-full" />
        
        {/* Left dot */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#6D5A47] rounded-full" />
        
        {/* Right dot */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 bg-[#6D5A47] rounded-full" />
      </div>
    </div>
  );
}

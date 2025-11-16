import { useEffect, useState, useRef, JSX } from 'react';
import { motion, PanInfo, useMotionValue } from 'motion/react';
import { recommendedSessions } from '../../data/recommendedSessions';
import { getSessionById } from '../../data/allSessions';
import type { GuidedSessionConfig } from '../../data/guidedSessions';
import { Button } from './button';

export interface CarouselProps {
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  onStartGuidedSession?: (session: GuidedSessionConfig) => void;
  prependNodes?: JSX.Element[];
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

export default function Carousel({
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
  onStartGuidedSession,
  prependNodes = []
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  // Build renderable items: optional custom nodes first, then recommended session cards
  const recItems = recommendedSessions;
  const renderNodes: JSX.Element[] = [
    ...prependNodes,
    ...recItems.map((rec) => {
      return (
        <div className="mx-2" key={`rec-${rec.id}`}>
          <div className="relative overflow-hidden rounded-2xl shadow-lg group">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: rec.id === 'finnish-traditional'
                  ? `url('https://images.unsplash.com/photo-1622997638119-e53621e3d73b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5uaXNoJTIwbGFrZSUyMGZvcmVzdHxlbnwxfHx8fDE3NjMyNTMzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                  : `url('${rec.image}')`,
              }}
            />
            <div className={`absolute inset-0 ${
              rec.id === 'finnish-traditional' 
                ? 'bg-gradient-to-br from-[#A8C5DD]/90 to-[#7BA3C4]/90' 
                : rec.id === 'detox-respiratory'
                ? 'bg-gradient-to-br from-[#C8E6C9]/90 to-[#A5D6A7]/90'
                : 'bg-gradient-to-br from-[#8B7355]/90 to-[#5C4033]/90'
            }`} />
            <div className="relative p-4">
              <h4 className="text-white mb-2">
                {rec.title}
              </h4>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">
                {rec.description}
              </p>
              <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
                <span>{rec.temp}°C</span>
                <span>•</span>
                <span>{rec.duration} min</span>
              </div>
              <Button
                size="sm"
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40"
                onClick={() => {
                  const session = getSessionById(rec.id);
                  if (session && onStartGuidedSession) {
                    onStartGuidedSession(session);
                  } else if (!session) {
                    // eslint-disable-next-line no-console
                    console.warn('Guided session not found for id:', rec.id);
                  }
                }}
              >
                Start Session
              </Button>
            </div>
          </div>
        </div>
      );
    })
  ];
  const itemsCount = renderNodes.length;
  const carouselNodes = loop && itemsCount > 0 ? [...renderNodes, renderNodes[0]] : renderNodes;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered) && itemsCount > 0) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === itemsCount - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselNodes.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, itemsCount, carouselNodes.length, pauseOnHover]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselNodes.length - 1) {
      // Seamless loop reset using double rAF to avoid visible jump
      setIsResetting(true);
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        x.set(0);
        requestAnimationFrame(() => {
          setIsResetting(false);
        });
      });
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop) {
        // If we're at the last real item, go to the duplicate end cap
        if (currentIndex === itemsCount - 1) {
          setCurrentIndex(itemsCount);
          return;
        }
        // If we're already at the duplicate end cap, jump to first real item
        if (currentIndex === itemsCount) {
          setCurrentIndex(1);
          return;
        }
      }
      setCurrentIndex(prev => Math.min(prev + 1, carouselNodes.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(itemsCount - 1);
      } else {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselNodes.length - 1),
          right: 0
        }
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden p-4 ${
        round ? 'rounded-full border border-white' : 'rounded-[24px]'
      }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` })
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${(currentIndex % itemsCount) * trackItemOffset + itemWidth / 2}px 50%`,
          x
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselNodes.map((node, index) => {
          return (
            <motion.div
              key={`carousel-node-${index}`}
              className="relative shrink-0"
              style={{
                width: itemWidth,
                rotateY: 0,
              }}
              transition={effectiveTransition}
            >
              {node}
            </motion.div>
          );
        })}
      </motion.div>
      <div className={`flex w-full justify-center ${round ? 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2' : ''}`}>
        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: itemsCount }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 border ${
                currentIndex % itemsCount === index
                  ? 'bg-white border-white'
                  : 'bg-transparent border-white'
              }`}
              animate={{
                scale: currentIndex % itemsCount === index ? 1.2 : 1
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

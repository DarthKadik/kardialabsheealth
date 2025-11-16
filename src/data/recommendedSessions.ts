/**
 * Shared Recommended Sauna Sessions
 * 
 * This file contains the list of recommended sauna sessions that appear in both:
 * - Smart Sauna page (SaunaAlgorithms component)
 * - Community Hub > My Programs tab
 * 
 * Editing this file will update the recommendations in both locations.
 */

export interface RecommendedSession {
  id: string;
  title: string;
  description: string;
  temp: number;
  duration: number;
  image: string;
  isGuided: boolean;
}

/**
 * Array of recommended sauna sessions
 * These sessions appear in both the Smart page and Community page
 */
export const recommendedSessions: RecommendedSession[] = [
  {
    id: "beginners-guide",
    title: "Beginner's Guide",
    description: "Complete step-by-step tutorial for your first sauna experience",
    temp: 80,
    duration: 60,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "finnish-traditional",
    title: "Traditional Finnish",
    description: "Authentic high-heat löyly experience with birch whisk ritual",
    temp: 92,
    duration: 85,
    image: "https://images.unsplash.com/photo-1521571455-1c93f950d853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "detox-respiratory",
    title: "Detox & Respiratory",
    description: "Maximize sweating to release toxins and open airways with steam",
    temp: 68,
    duration: 75,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "morning-energizer",
    title: "Morning Energizer",
    description: "Quick detox and mental clarity boost to start your day strong",
    temp: 80,
    duration: 40,
    image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "athletic-recovery",
    title: "Athletic Recovery",
    description: "Optimize muscle recovery and reduce soreness after training",
    temp: 80,
    duration: 70,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "radiant-skin",
    title: "Radiant Skin Renewal",
    description: "Deep cleansing and rejuvenation for healthy, glowing skin",
    temp: 75,
    duration: 70,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "evening-wind-down",
    title: "Evening Wind-Down",
    description: "Release daily stress and prepare your body for restorative sleep",
    temp: 70,
    duration: 70,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "mindful-presence",
    title: "Mindful Presence",
    description: "Guided meditation journey combining heat therapy with deep mindfulness practice",
    temp: 50,
    duration: 100,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "recovery-session",
    title: "Recovery Session",
    description: "Gentle heat for muscle recovery after intense workout",
    temp: 75,
    duration: 30,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "deep-relaxation",
    title: "Deep Relaxation",
    description: "Optimal temperature for stress relief and mental clarity",
    temp: 85,
    duration: 40,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
  {
    id: "performance-boost",
    title: "Performance Boost",
    description: "High-intensity session for endurance training",
    temp: 90,
    duration: 25,
    image: "https://images.unsplash.com/photo-1570993492903-ba4c3088f100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    isGuided: true,
  },
];

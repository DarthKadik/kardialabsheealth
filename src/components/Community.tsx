import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Calendar,
  Users,
  Plus,
  Sparkles,
  Clock,
  Flame,
  Droplets,
  Wind,
  UserPlus,
  Settings,
  ShoppingBag,
  Package,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Slider } from "./ui/slider";
import { AdvancedProgramBuilder } from "./AdvancedProgramBuilder";
import { SavedProgramCard } from "./SavedProgramCard";
import { GuidedSession } from "./GuidedSession";
import { GuidedSessionConfig } from "../data/guidedSessions";
import { getSessionById } from "../data/allSessions";
import { recommendedSessions } from "../data/recommendedSessions";

interface CommunityProps {
  sessionState: ReturnType<typeof import("../hooks/useSessionState").useSessionState>;
  onNavigate?: (tab: string) => void;
}

export function Community({ sessionState, onNavigate }: CommunityProps) {
  const [activeSection, setActiveSection] =
    useState("discover");
  const [programBuilderOpen, setProgramBuilderOpen] =
    useState(false);
  const [eventBuilderOpen, setEventBuilderOpen] =
    useState(false);
  const [activeGuidedSession, setActiveGuidedSession] =
    useState<GuidedSessionConfig | null>(null);

  if (activeGuidedSession) {
    return <GuidedSession onBack={() => setActiveGuidedSession(null)} />;
  }
  
  return (
    <div className="bg-[#FFEBCD]">
      {/* Header */}
      <div className="relative px-6 pt-12 pb-6 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95" />

        <div className="relative z-10">
          <h1 className="text-white mb-2">Community Hub</h1>
          <p className="text-white/80 text-sm">
            Connect, share, and discover sauna cultures
            worldwide
          </p>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveSection("discover")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeSection === "discover"
                ? "bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white shadow-lg"
                : "bg-white/60 text-[#5C4033] hover:bg-white/80"
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveSection("programs")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeSection === "programs"
                ? "bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white shadow-lg"
                : "bg-white/60 text-[#5C4033] hover:bg-white/80"
            }`}
          >
            My Programs
          </button>
          <button
            onClick={() => setActiveSection("events")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeSection === "events"
                ? "bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white shadow-lg"
                : "bg-white/60 text-[#5C4033] hover:bg-white/80"
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveSection("friends")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeSection === "friends"
                ? "bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white shadow-lg"
                : "bg-white/60 text-[#5C4033] hover:bg-white/80"
            }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-6 pb-6">
        {/* Discover Section */}
        {activeSection === "discover" && (
          <div className="space-y-4">
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
                  link: "https://www.harvia.com/en/products/sauna-accessories/thermometers-and-hygrometers",
                },
                {
                  name: "Finnish Birch Vihta",
                  category: "Whisks",
                  price: "€22.50",
                  description:
                    "Fresh birch whisk for traditional löyly massage. Authentic Finnish experience.",
                  image:
                    "https://images.unsplash.com/photo-1763062897323-14ad7eab1c34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJjaCUyMGJyYW5jaGVzJTIwbmF0dXJhbHxlbnwxfHx8fDE3NjMyMTM5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/vihta-whisk",
                },
                {
                  name: "Harvia Headrest SAC21000",
                  category: "Comfort",
                  price: "€54.90",
                  description:
                    "Ergonomic wooden headrest. Heat-treated aspen, perfect for relaxation.",
                  image:
                    "https://images.unsplash.com/photo-1706048111522-e4865f909940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMGhlYWRyZXN0JTIwd29vZHxlbnwxfHx8fDE3NjMyMTM5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/headrests",
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
                  name: "Harvia Essence Dispenser",
                  category: "Aromatics",
                  price: "€124.90",
                  description:
                    "Automatic aroma dispenser for steam rooms. Compatible with natural essences.",
                  image:
                    "https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGVzfGVufDF8fHx8MTc2MzIxMzkxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/essence-dispensers",
                },
                {
                  name: "Harvia Sauna Bucket 5L",
                  category: "Essentials",
                  price: "€45.90",
                  description:
                    "Premium wooden bucket for water rituals. Authentic Nordic design.",
                  image:
                    "https://images.unsplash.com/photo-1759300031446-88e81c8a26c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzYXVuYSUyMGJ1Y2tldCUyMGxhZGxlfGVufDF8fHx8MTc2MzIxMzkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/sauna-bucket-and-ladle",
                },
                {
                  name: "Harvia Sauna Light SAS21001",
                  category: "Lighting",
                  price: "€89.90",
                  description:
                    "Waterproof LED sauna light. Soft warm glow for meditation atmosphere.",
                  image:
                    "https://images.unsplash.com/photo-1743286159555-ea765c1bc5e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMGxpZ2h0JTIwZml4dHVyZXxlbnwxfHx8fDE3NjMyMTM5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/lighting",
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
                  name: "Harvia Sauna Bucket Set SAC25000",
                  category: "Equipment",
                  price: "€82.90",
                  description:
                    "Large 5L bucket with ladle. Essential for contrast therapy and cooling rituals.",
                  image:
                    "https://images.unsplash.com/photo-1759300031446-88e81c8a26c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzYXVuYSUyMGJ1Y2tldCUyMGxhZGxlfGVufDF8fHx8MTc2MzIxMzkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/sauna-bucket-and-ladle",
                },
                {
                  name: "Harvia Sauna Stones 20kg",
                  category: "Heating",
                  price: "€42.90",
                  description:
                    "High-quality stones for maximum steam. Perfect for banya's intense heat cycles.",
                  image:
                    "https://images.unsplash.com/photo-1717152244259-80c400b20056?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHN0b25lcyUyMGhlYXRlcnxlbnwxfHx8fDE3NjMyMTM5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/sauna-stones",
                },
                {
                  name: "Harvia Eucalyptus Sauna Scent",
                  category: "Aromatics",
                  price: "€15.90",
                  description:
                    "Natural eucalyptus essential oil. Enhances breathing and traditional experience.",
                  image:
                    "https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGVzfGVufDF8fHx8MTc2MzIxMzkxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  link: "https://www.harvia.com/en/products/sauna-accessories/sauna-fragrances",
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
                  link: "https://www.harvia.com/en/products/sauna-accessories/sauna-fragrances",
                },
              ]}
            />
          </div>
        )}

        {/* My Programs Section */}
        {activeSection === "programs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#3E2723] mb-1">
                  My Sauna Programs
                </h3>
                <p className="text-[#5C4033]/80 text-sm">
                  Create and customize your perfect sessions
                </p>
              </div>
              <Dialog
                open={programBuilderOpen}
                onOpenChange={setProgramBuilderOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#FFEBCD] border-[#8B7355] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#3E2723]">
                      Create Sauna Program
                    </DialogTitle>
                    <DialogDescription className="text-[#5C4033]/80">
                      Design your perfect sauna session
                    </DialogDescription>
                  </DialogHeader>
                  <AdvancedProgramBuilder
                    onSave={(config) => {
                      // Create a SavedProgram from the config
                      const program: import("../hooks/useSessionState").SavedProgram = {
                        id: Date.now(),
                        name: config.programName,
                        intervals: config.intervals,
                        soundscape: config.soundscape,
                        lighting: config.lighting,
                        actions: config.actions
                      };
                      sessionState.addProgram(program);
                      setProgramBuilderOpen(false);
                      onNavigate && onNavigate("home");
                    }}
                    onStartNow={(config) => {
                      const program: import("../hooks/useSessionState").SavedProgram = {
                        id: Date.now(),
                        name: config.programName,
                        intervals: config.intervals,
                        soundscape: config.soundscape,
                        lighting: config.lighting,
                        actions: config.actions
                      };
                      sessionState.addProgram(program);
                      sessionState.startProgramNow(program);
                      setProgramBuilderOpen(false);
                      onNavigate && onNavigate("home");
                    }}
                    onScheduleLater={(config) => {
                      const program: import("../hooks/useSessionState").SavedProgram = {
                        id: Date.now(),
                        name: config.programName,
                        intervals: config.intervals,
                        soundscape: config.soundscape,
                        lighting: config.lighting,
                        actions: config.actions
                      };
                      sessionState.addProgram(program);
                      // Ask for schedule time in HH:MM; default to current time
                      const now = new Date();
                      const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                      const time = window.prompt("Schedule time (HH:MM)?", defaultTime) || defaultTime;
                      sessionState.scheduleProgramForLater(program, time);
                      setProgramBuilderOpen(false);
                      onNavigate && onNavigate("home");
                    }}
                    onCancel={() =>
                      setProgramBuilderOpen(false)
                    }
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* User's Saved Programs */}
            <div className="mb-4">
              <h4 className="text-[#3E2723] mb-4">
                Your Custom Programs
              </h4>
            </div>
            {sessionState.savedPrograms.length > 0 ? (
              <div className="space-y-4">
                {sessionState.savedPrograms.map((program) => (
                  <SavedProgramCard
                    key={program.id}
                    program={program}
                    onClick={() => {}}
                    onStartNow={() => {
                      sessionState.startProgramNow(program);
                      onNavigate && onNavigate("home");
                    }}
                    onSchedule={() => {
                      const now = new Date();
                      const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(
                        now.getMinutes(),
                      ).padStart(2, "0")}`;
                      const time =
                        window.prompt("Schedule time (HH:MM)?", defaultTime) ||
                        defaultTime;
                      sessionState.scheduleProgramForLater(program, time);
                      onNavigate && onNavigate("home");
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[#5C4033]/70 text-sm">
                You have no saved programs yet. Create one to see it here.
              </p>
            )}

            {/* Recommended Sessions */}
            <div className="mb-6 pt-6 border-t border-[#8B7355]/30">
              <h4 className="text-[#3E2723] mb-2">
                Recommended Sessions
              </h4>
              <p className="text-[#5C4033]/80 text-sm mb-4">
                Expert-guided programs tailored for different
                wellness goals
              </p>

              <div className="space-y-4 ">
                {recommendedSessions.map((rec) => (
                  <div
                    key={rec.id}
                    className="relative overflow-hidden rounded-2xl shadow-lg group"
                  >
                    {/* Background Image */}
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

                    {/* Content */}
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
                          console.log(
                            "🔍 Looking for session:",
                            rec.id,
                          );
                          const session = getSessionById(
                            rec.id,
                          );
                          console.log(
                            "✅ Found session:",
                            session
                              ? session.title
                              : "NOT FOUND",
                          );
                          if (session) {
                            setActiveGuidedSession(session);
                            console.log(
                              "🚀 Session activated!",
                            );
                          } else {
                            console.error(
                              "❌ Session not found in registry for ID:",
                              rec.id,
                            );
                          }
                        }}
                      >
                        Start Session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <div className="space-y-4 ">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#3E2723] mb-1">
                  Community Events
                </h3>
                <p className="text-[#5C4033]/80 text-sm">
                  Join or host local sauna gatherings
                </p>
                <div className="mt-2 rounded-xl border border-[#8B7355]/30 bg-white/60 text-[#5C4033] text-xs px-3 py-2">
                  Note: This Events section is a concept preview and not functional.
                </div>
              </div>
              <Dialog
                open={eventBuilderOpen}
                onOpenChange={setEventBuilderOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Host
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#FFEBCD] border-[#8B7355]">
                  <DialogHeader>
                    <DialogTitle className="text-[#3E2723]">
                      Host Community Event
                    </DialogTitle>
                    <DialogDescription className="text-[#5C4033]/80">
                      Create a sauna gathering for your
                      community
                    </DialogDescription>
                  </DialogHeader>
                  <EventBuilder
                    onClose={() => setEventBuilderOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <EventCard
              title="Helsinki Heat Society - Weekly Meetup"
              host="Mika Virtanen"
              date="Saturday, Nov 16"
              time="18:00 - 20:00"
              location="Löyly Helsinki"
              attendees={12}
              maxAttendees={15}
              description="Traditional Finnish sauna with ice swimming. All levels welcome!"
              tags={["Finnish", "Social", "Ice Swimming"]}
            />
            <EventCard
              title="Morning Meditation Sauna"
              host="Sarah Chen"
              date="Sunday, Nov 17"
              time="08:00 - 09:30"
              location="Kulttuurisauna"
              attendees={6}
              maxAttendees={10}
              description="Gentle morning session focused on mindfulness and breathing"
              tags={["Meditation", "Beginner-Friendly"]}
            />
            <EventCard
              title="Sauna Masters Workshop"
              host="Lars Andersson"
              date="Friday, Nov 22"
              time="19:00 - 22:00"
              location="Private Location"
              attendees={8}
              maxAttendees={8}
              description="Learn traditional löyly techniques from a certified sauna master"
              tags={["Workshop", "Advanced", "Löyly"]}
              isFull={true}
            />
          </div>
        )}

        {/* Friends Section */}
        {activeSection === "friends" && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-[#3E2723] mb-1">
                Your Sauna Community
              </h3>
              <p className="text-[#5C4033]/80 text-sm">
                Connect with fellow enthusiasts
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-lg p-4 mb-4 bg-white/60">
              <Input
                placeholder="Search for friends..."
                className="bg-white border-[#8B7355]/40 text-[#3E2723]"
              />
            </div>

            <FriendCard
              name="Mika Virtanen"
              username="@mika_sauna"
              avatar="MV"
              sessions={234}
              followers={432}
              status="Active now"
              isFollowing={true}
            />
            <FriendCard
              name="Sarah Chen"
              username="@sarahwellness"
              avatar="SC"
              sessions={156}
              followers={289}
              status="Last session: 2h ago"
              isFollowing={true}
            />
            <FriendCard
              name="Lars Andersson"
              username="@nordic_heat"
              avatar="LA"
              sessions={412}
              followers={678}
              status="Last session: 1d ago"
              isFollowing={true}
            />

            <div className="mt-6">
              <h4 className="text-[#3E2723] text-sm mb-3">
                Suggested Connections
              </h4>
              <FriendCard
                name="Emma Korhonen"
                username="@emma_loyly"
                avatar="EK"
                sessions={89}
                followers={145}
                status="2 mutual friends"
                isFollowing={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Guided Session Overlay 
      {activeGuidedSession && (
        <GuidedSession
          sessionConfig={activeGuidedSession}
          onBack={() => setActiveGuidedSession(null)}
          sourcePage="home"
        />
      )}*/}
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
            Try This Culture (coming soon)
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
                    Buy Complete {culture} Bundle
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
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
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

// Program Card Component
function ProgramCard({
  name,
  type,
  phases,
  duration,
  temperature,
  description,
  isPublic,
  uses,
}: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[#3E2723]">{name}</h4>
            {isPublic && (
              <Badge
                variant="outline"
                className="border-[#8B7355] text-[#5C4033] text-xs"
              >
                Public
              </Badge>
            )}
          </div>
          <p className="text-[#5C4033]/70 text-xs">
            {type} • {phases} phases
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-[#8B7355]"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-[#5C4033] text-sm mb-3">
        {description}
      </p>

      <div className="flex items-center gap-4 text-xs text-[#5C4033]/70 mb-3 pb-3 border-b border-[#8B7355]/20">
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3" />
          {temperature}°C
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {duration}m
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {uses} uses
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
        >
          Start Session
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-[#8B7355] text-[#5C4033]"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({
  title,
  host,
  date,
  time,
  location,
  attendees,
  maxAttendees,
  description,
  tags,
  isFull,
}: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#6D5A47] flex items-center justify-center text-white flex-shrink-0">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-[#3E2723] mb-1">{title}</h4>
          <p className="text-[#5C4033]/70 text-xs">
            Hosted by {host}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-[#5C4033] mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#8B7355]" />
          <span>
            {date} • {time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#8B7355]" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#8B7355]" />
          <span>
            {attendees}/{maxAttendees} attendees
          </span>
        </div>
      </div>

      <p className="text-[#5C4033] text-sm mb-3 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: string) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-[#8B7355]/20 text-[#5C4033] border-0 text-xs"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Button
        size="sm"
        className={`w-full ${
          isFull
            ? "bg-[#5C4033]/40 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
        }`}
        disabled={isFull}
      >
        {isFull ? "Event Full" : "Join Event"}
      </Button>
    </div>
  );
}

// Friend Card Component
function FriendCard({
  name,
  username,
  avatar,
  sessions,
  followers,
  status,
  isFollowing,
}: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6D5A47] flex items-center justify-center text-white flex-shrink-0">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[#3E2723] truncate">{name}</h4>
          <p className="text-[#5C4033]/70 text-xs truncate">
            {username}
          </p>
          <p className="text-[#5C4033]/60 text-xs mt-1">
            {status}
          </p>
        </div>
        <Button
          size="sm"
          variant={isFollowing ? "outline" : "default"}
          className={
            isFollowing
              ? "border-[#8B7355] text-[#5C4033]"
              : "bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white"
          }
        >
          {isFollowing ? (
            "Following"
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-1" />
              Follow
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#8B7355]/20 text-xs text-[#5C4033]/70">
        <span>{sessions} sessions</span>
        <span>•</span>
        <span>{followers} followers</span>
      </div>
    </div>
  );
}

// Event Builder Component
function EventBuilder({ onClose }: any) {
  return (
    <div className="space-y-4 pb-[50px]">
      <div>
        <Label htmlFor="event-title" className="text-[#3E2723]">
          Event Title
        </Label>
        <Input
          id="event-title"
          placeholder="Weekend Sauna Gathering"
          className="bg-white border-[#8B7355]/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label
            htmlFor="event-date"
            className="text-[#3E2723]"
          >
            Date
          </Label>
          <Input
            id="event-date"
            type="date"
            className="bg-white border-[#8B7355]/40"
          />
        </div>
        <div>
          <Label
            htmlFor="event-time"
            className="text-[#3E2723]"
          >
            Time
          </Label>
          <Input
            id="event-time"
            type="time"
            className="bg-white border-[#8B7355]/40"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="event-location"
          className="text-[#3E2723]"
        >
          Location
        </Label>
        <Input
          id="event-location"
          placeholder="Sauna name or address"
          className="bg-white border-[#8B7355]/40"
        />
      </div>

      <div>
        <Label
          htmlFor="max-attendees"
          className="text-[#3E2723]"
        >
          Max Attendees
        </Label>
        <Input
          id="max-attendees"
          type="number"
          placeholder="10"
          className="bg-white border-[#8B7355]/40"
        />
      </div>

      <div>
        <Label
          htmlFor="event-description"
          className="text-[#3E2723]"
        >
          Description
        </Label>
        <Textarea
          id="event-description"
          placeholder="Tell people what to expect..."
          className="bg-white border-[#8B7355]/40 min-h-[80px]"
        />
      </div>

      <div>
        <Label className="text-[#3E2723] mb-2 block">
          Event Type
        </Label>
        <div className="flex flex-wrap gap-2">
          {[
            "Social",
            "Workshop",
            "Traditional",
            "Meditation",
            "Ice Swimming",
            "Beginner-Friendly",
          ].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 rounded-full text-xs border border-[#8B7355] text-[#5C4033] hover:bg-[#8B7355]/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="private-event"
          className="rounded border-[#8B7355]"
        />
        <Label
          htmlFor="private-event"
          className="text-[#3E2723] text-sm cursor-pointer"
        >
          Private event (invite only)
        </Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1 border-[#8B7355] text-[#5C4033]"
        >
          Cancel
        </Button>
        <Button
          onClick={onClose}
          className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
}
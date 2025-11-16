import { useState, useEffect } from "react";
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
import { GuidedSession } from "./GuidedSession";
import { GuidedSessionConfig } from "../data/guidedSessions";
import { getSessionById } from "../data/allSessions";
import { recommendedSessions } from "../data/recommendedSessions";

interface CommunityProps {
  sessionState: ReturnType<typeof import("../hooks/useSessionState").useSessionState>;
}

// Define the program interface
interface UserProgram {
  id: number;
  name: string;
  type: string;
  phases: number;
  duration: number;
  temperature: number;
  description: string;
  isPublic: boolean;
  uses: number;
  // Advanced settings
  intervals?: any[];
  soundscape?: string;
  lighting?: { r: number; g: number; b: number };
  actions?: any[];
}

// Default programs
const defaultPrograms: UserProgram[] = [
  {
    id: 1,
    name: "My Evening Routine",
    type: "Personal",
    phases: 3,
    duration: 45,
    temperature: 82,
    description: "Relaxing evening session with gradual heat increase",
    isPublic: false,
    uses: 34,
    intervals: [],
    soundscape: "",
    lighting: { r: 255, g: 200, b: 150 },
    actions: []
  },
  {
    id: 2,
    name: "Weekend Warrior",
    type: "Intense",
    phases: 5,
    duration: 75,
    temperature: 88,
    description: "High-intensity session with multiple cooling breaks",
    isPublic: true,
    uses: 12,
    intervals: [],
    soundscape: "",
    lighting: { r: 255, g: 200, b: 150 },
    actions: []
  },
  {
    id: 3,
    name: "Recovery & Meditation",
    type: "Gentle",
    phases: 2,
    duration: 30,
    temperature: 70,
    description: "Low-heat mindfulness session for active recovery",
    isPublic: true,
    uses: 28,
    intervals: [],
    soundscape: "",
    lighting: { r: 255, g: 200, b: 150 },
    actions: []
  }
];

export function Community({ sessionState }: CommunityProps) {
  const [activeSection, setActiveSection] =
    useState("library");
  const [programBuilderOpen, setProgramBuilderOpen] =
    useState(false);
  const [eventBuilderOpen, setEventBuilderOpen] =
    useState(false);
  const [activeGuidedSession, setActiveGuidedSession] =
    useState<GuidedSessionConfig | null>(null);
  const [editProgramId, setEditProgramId] = useState<number | null>(null);
  const [settingsProgramId, setSettingsProgramId] = useState<number | null>(null);
  const [editProgramName, setEditProgramName] = useState("");
  
  // Load programs from localStorage or use defaults
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>(() => {
    try {
      const saved = localStorage.getItem('harvia_user_programs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading programs:', e);
    }
    return defaultPrograms;
  });
  
  // Save programs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('harvia_user_programs', JSON.stringify(userPrograms));
    } catch (e) {
      console.error('Error saving programs:', e);
    }
  }, [userPrograms]);
  
  // Settings state for the currently opened settings dialog
  const [settingsIsPublic, setSettingsIsPublic] = useState(false);
  const [settingsEnableScheduling, setSettingsEnableScheduling] = useState(true);
  const [settingsNotifications, setSettingsNotifications] = useState(true);
  
  // When settings dialog opens, load the program's current settings
  useEffect(() => {
    if (settingsProgramId !== null) {
      const program = userPrograms.find(p => p.id === settingsProgramId);
      if (program) {
        setSettingsIsPublic(program.isPublic);
      }
    }
  }, [settingsProgramId, userPrograms]);

  if (activeGuidedSession) {
    return <GuidedSession sessionConfig={activeGuidedSession} onBack={() => setActiveGuidedSession(null)} sourcePage="smart" />;
  }
  
  return (
    <div className="min-h-full bg-[#FFEBCD]">
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
            onClick={() => setActiveSection("library")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeSection === "library"
                ? "bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white shadow-lg"
                : "bg-white/60 text-[#5C4033] hover:bg-white/80"
            }`}
          >
            Library
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
                <DialogContent className="bg-[#FFEBCD] border-[#8B7355]">
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
                    }}
                    onCancel={() =>
                      setProgramBuilderOpen(false)
                    }
                  />
                </DialogContent>
              </Dialog>
            </div>

<<<<<<< Updated upstream
            {/* User's Saved Programs */}
            <div className="mb-4">
              <h4 className="text-[#3E2723] mb-4">
                
              </h4>
            </div>
            {sessionState.savedPrograms.length > 0 ? (
              <div className="space-y-4">
                {sessionState.savedPrograms.map((program) => (
                  <SavedProgramCard
                    key={program.id}
                    program={program}
                    onClick={() => setViewingProgram(program)}
                    onStartNow={() => {
                      sessionState.startProgramNow(program);
                      onNavigate && onNavigate("home");
=======
            {userPrograms.map(program => (
              <ProgramCard
                key={program.id}
                id={program.id}
                name={program.name}
                type={program.type}
                phases={program.phases}
                duration={program.duration}
                temperature={program.temperature}
                description={program.description}
                isPublic={program.isPublic}
                uses={program.uses}
                onStartSession={(id) => {
                  // For now, show an alert - in a real app, this would start the actual session
                  alert(`Starting session: ${program.name} (ID: ${id})`);
                }}
                onEdit={(id) => setEditProgramId(id)}
                onSettings={(id) => setSettingsProgramId(id)}
              />
            ))}
            
            {/* Edit Program Dialog */}
            <Dialog
              open={editProgramId !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setEditProgramId(null);
                  setEditProgramName("");
                }
              }}
            >
              <DialogContent className="bg-[#FFEBCD] border-[#8B7355] max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-[#3E2723]">
                    Edit Program
                  </DialogTitle>
                  <DialogDescription className="text-[#5C4033]/80">
                    Modify your custom sauna program
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-program-name" className="text-[#3E2723] mb-1.5 block">
                      Program Name
                    </Label>
                    <Input
                      id="edit-program-name"
                      value={editProgramName || userPrograms.find(p => p.id === editProgramId)?.name || ""}
                      onChange={(e) => setEditProgramName(e.target.value)}
                      placeholder="Enter new name"
                      className="bg-white border-[#8B7355]/40 text-[#3E2723]"
                    />
                  </div>
                  <AdvancedProgramBuilder
                    initialData={editProgramId !== null ? {
                      programName: userPrograms.find(p => p.id === editProgramId)?.name || "",
                      intervals: userPrograms.find(p => p.id === editProgramId)?.intervals || [],
                      soundscape: userPrograms.find(p => p.id === editProgramId)?.soundscape || "",
                      lighting: userPrograms.find(p => p.id === editProgramId)?.lighting || { r: 255, g: 200, b: 150 },
                      actions: userPrograms.find(p => p.id === editProgramId)?.actions || []
                    } : undefined}
                    onSave={(config) => {
                      if (editProgramId !== null) {
                        // Update the program
                        setUserPrograms(userPrograms.map(p => 
                          p.id === editProgramId 
                            ? {
                                ...p,
                                name: editProgramName || config.programName,
                                intervals: config.intervals,
                                soundscape: config.soundscape,
                                lighting: config.lighting,
                                actions: config.actions,
                                phases: config.intervals.length,
                                duration: config.intervals.reduce((sum, i) => sum + i.duration, 0)
                              }
                            : p
                        ));
                      }
                      setEditProgramId(null);
                      setEditProgramName("");
>>>>>>> Stashed changes
                    }}
                    onCancel={() => {
                      setEditProgramId(null);
                      setEditProgramName("");
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>

<<<<<<< Updated upstream
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
                      'bg-gradient-to-br from-[#8B7355]/90 to-[#5C4033]/90'
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
=======
            {/* Settings Dialog */}
            <Dialog
              open={settingsProgramId !== null}
              onOpenChange={(open) => !open && setSettingsProgramId(null)}
            >
              <DialogContent className="bg-[#FFEBCD] border-[#8B7355]">
                <DialogHeader>
                  <DialogTitle className="text-[#3E2723]">
                    Program Settings
                  </DialogTitle>
                  <DialogDescription className="text-[#5C4033]/80">
                    Manage your program preferences
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[#3E2723]">Make Public</Label>
                      <p className="text-xs text-[#5C4033]/70">Share this program with the community</p>
>>>>>>> Stashed changes
                    </div>
                    <input type="checkbox" className="rounded border-[#8B7355]" checked={settingsIsPublic} onChange={(e) => setSettingsIsPublic(e.target.checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[#3E2723]">Enable Scheduling</Label>
                      <p className="text-xs text-[#5C4033]/70">Allow automatic start times</p>
                    </div>
                    <input type="checkbox" className="rounded border-[#8B7355]" defaultChecked={settingsEnableScheduling} onChange={(e) => setSettingsEnableScheduling(e.target.checked)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[#3E2723]">Notifications</Label>
                      <p className="text-xs text-[#5C4033]/70">Get reminders before sessions</p>
                    </div>
                    <input type="checkbox" className="rounded border-[#8B7355]" defaultChecked={settingsNotifications} onChange={(e) => setSettingsNotifications(e.target.checked)} />
                  </div>
                  <div className="pt-4 border-t border-[#8B7355]/20">
                    <Button
                      variant="outline"
                      className="w-full border-red-500 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this program?')) {
                          setUserPrograms(userPrograms.filter(p => p.id !== settingsProgramId));
                          setSettingsProgramId(null);
                        }
                      }}
                    >
                      Delete Program
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#8B7355] text-[#5C4033]"
                    onClick={() => setSettingsProgramId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]"
                    onClick={() => {
                      // Save the settings to the program
                      setUserPrograms(userPrograms.map(p => 
                        p.id === settingsProgramId 
                          ? { ...p, isPublic: settingsIsPublic }
                          : p
                      ));
                      alert('Settings saved!');
                      setSettingsProgramId(null);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Library Section */}
        {activeSection === "library" && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-[#3E2723] mb-2">
                Session Library
              </h3>
              <p className="text-[#5C4033]/80 text-sm">
                Expert-guided programs tailored for different wellness goals
              </p>
            </div>

            <div className="space-y-4">
              {recommendedSessions.filter(rec => rec.id !== 'ai-coach').map((rec, index) => (
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
                  <div className={`absolute inset-0 ${'bg-gradient-to-br from-[#8B7355]/90 to-[#5C4033]/90'
                  }`} />

                  {/* Content */}
                  <div className="relative p-4">
                    <h4 className={`mb-2 ${rec.id === 'athletic-recovery' || rec.id === 'recovery-session' || rec.id === 'radiant-skin' ? 'text-white' : 'text-white'}`}>
                      {rec.title}
                    </h4>
                    <p className={`text-sm mb-4 leading-relaxed ${rec.id === 'athletic-recovery' || rec.id === 'recovery-session' || rec.id === 'radiant-skin' ? 'text-white/80' : 'text-white/80'}`}>
                      {rec.description}
                    </p>

                    <div className={`flex items-center gap-4 mb-4 text-sm ${rec.id === 'athletic-recovery' || rec.id === 'recovery-session' || rec.id === 'radiant-skin' ? 'text-white/70' : 'text-white/70'}`}>
                      <span>{rec.temp}°C</span>
                      <span>•</span>
                      <span>{rec.duration} min</span>
                    </div>

                    <Button
                      size="sm"
                      className={`w-full ${
                        rec.id === 'athletic-recovery' || rec.id === 'recovery-session' || rec.id === 'radiant-skin'
                          ? 'bg-[#8B7355]/20 hover:bg-[#8B7355]/30 text-white border border-[#8B7355]/40'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
                      }`}
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
        )}

        {/* Events Section */}
        {activeSection === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[#3E2723] mb-1">
                  Community Events
                </h3>
                <p className="text-[#5C4033]/80 text-sm">
                  Join or host local sauna gatherings
                </p>
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

// Program Card Component
function ProgramCard({
  id,
  name,
  type,
  phases,
  duration,
  temperature,
  description,
  isPublic,
  uses,
  onStartSession,
  onEdit,
  onSettings,
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
          className="text-[#8B7355] hover:text-[#6D5A47] hover:bg-[#8B7355]/10"
          onClick={() => onSettings(id)}
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
          onClick={() => onStartSession(id)}
        >
          Start Session
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-[#8B7355] text-[#5C4033] hover:bg-[#8B7355]/10"
          onClick={() => onEdit(id)}
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
    <div className="space-y-4">
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
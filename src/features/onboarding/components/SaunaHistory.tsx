import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface SaunaSession {
	session_id: string;
	timestamp: string;
	session_type_id: number;
	session_type_title: string;
	duration_minutes: number;
	relaxation_score: number;
	enjoyment_score: number;
	avg_temperature_celsius: number;
	avg_humidity_percent: number;
}

interface SaunaHistoryProps {
	onBack: () => void;
	onContinue: (sessions: SaunaSession[]) => void;
}

export function SaunaHistory({ onBack, onContinue }: SaunaHistoryProps) {
	const [sessions, setSessions] = useState<SaunaSession[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		date: "",
		time: "",
		duration_minutes: "",
		relaxation_score: "",
		enjoyment_score: "",
		avg_temperature_celsius: "",
		avg_humidity_percent: "",
	});

	const handleAddSession = () => {
		if (!formData.date || !formData.time || !formData.duration_minutes) {
			return;
		}
		const timestamp = `${formData.date}T${formData.time}:00`;
		const newSession: SaunaSession = {
			session_id: `session_${Date.now()}`,
			timestamp,
			session_type_id: 9,
			session_type_title: "Custom session",
			duration_minutes: parseInt(formData.duration_minutes) || 0,
			relaxation_score: parseInt(formData.relaxation_score) || 3,
			enjoyment_score: parseInt(formData.enjoyment_score) || 3,
			avg_temperature_celsius: parseInt(formData.avg_temperature_celsius) || 80,
			avg_humidity_percent: parseInt(formData.avg_humidity_percent) || 10,
		};
		setSessions([...sessions, newSession]);
		setShowForm(false);
		setFormData({
			date: "",
			time: "",
			duration_minutes: "",
			relaxation_score: "",
			enjoyment_score: "",
			avg_temperature_celsius: "",
			avg_humidity_percent: "",
		});
	};

	const handleDeleteSession = (sessionId: string) => {
		setSessions(sessions.filter((s) => s.session_id !== sessionId));
	};

	const handleContinue = () => {
		onContinue(sessions);
	};

	const formatDate = (timestamp: string) =>
		new Date(timestamp).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	return (
		<div className="min-h-screen w-full flex flex-col bg-[#FFEBCD]">
			<div className="flex flex-col h-full min-h-screen">
				<div className="flex flex-col items-center pt-8 px-6 pb-6">
					<h1 className="text-3xl text-[#3D2819] mb-3 text-center">Your Recent Sauna Sessions</h1>
					<p className="text-[#3D2819]/60 text-center">Tell us about your sauna visits from the past week</p>
				</div>
				<div className="flex-1 px-6 pb-8 overflow-y-auto">
					<div className="max-w-md mx-auto">
						{sessions.length > 0 && (
							<div className="space-y-3 mb-6">
								{sessions.map((session) => (
									<div key={session.session_id} className="backdrop-blur-xl bg-white/40 border border-[#3D2819]/10 rounded-2xl p-4 shadow-lg">
										<div className="flex items-start justify-between mb-2">
											<div>
												<p className="text-[#3D2819]">{formatDate(session.timestamp)}</p>
												<p className="text-sm text-[#3D2819]/60">
													{session.duration_minutes} min • {session.avg_temperature_celsius}°C • {session.avg_humidity_percent}% humidity
												</p>
											</div>
											<button onClick={() => handleDeleteSession(session.session_id)} className="p-2 hover:bg-[#FF6B6B]/20 rounded-full transition-colors">
												<Trash2 className="w-4 h-4 text-[#FF6B6B]" />
											</button>
										</div>
										<div className="flex gap-4 text-sm text-[#3D2819]/70">
											<span>Relax: {session.relaxation_score}/5</span>
											<span>Joy: {session.enjoyment_score}/5</span>
										</div>
									</div>
								))}
							</div>
						)}

						{showForm ? (
							<div className="backdrop-blur-xl bg-white/60 border border-[#3D2819]/10 rounded-2xl p-6 shadow-lg mb-6">
								<h3 className="text-[#3D2819] mb-4">Add Session</h3>
								<div className="space-y-4">
									<div className="grid grid-cols-2 gap-3">
										<div>
											<Label htmlFor="date" className="text-[#3D2819]/80">
												Date
											</Label>
											<Input
												id="date"
												type="date"
												value={formData.date}
												onChange={(e) => setFormData({ ...formData, date: e.target.value })}
												className="mt-1 bg:white/60 border-[#3D2819]/20 text-[#3D2819]"
												max={new Date().toISOString().split("T")[0]}
											/>
										</div>
										<div>
											<Label htmlFor="time" className="text-[#3D2819]/80">
												Time
											</Label>
											<Input
												id="time"
												type="time"
												value={formData.time}
												onChange={(e) => setFormData({ ...formData, time: e.target.value })}
												className="mt-1 bg:white/60 border-[#3D2819]/20 text-[#3D2819]"
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="duration" className="text-[#3D2819]/80">
											Duration (minutes)
										</Label>
										<Input
											id="duration"
											type="number"
											min="1"
											max="180"
											value={formData.duration_minutes}
											onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
											className="mt-1 bg:white/60 border-[#3D2819]/20 text-[#3D2819]"
											placeholder="e.g., 20"
										/>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<Label htmlFor="temp" className="text-[#3D2819]/80">
												Temperature (°C)
											</Label>
											<Input
												id="temp"
												type="number"
												min="40"
												max="120"
												value={formData.avg_temperature_celsius}
												onChange={(e) => setFormData({ ...formData, avg_temperature_celsius: e.target.value })}
												className="mt-1 bg:white/60 border-[#3D2819]/20 text-[#3D2819]"
												placeholder="70-90"
											/>
											<p className="text-xs text-[#3D2819]/50 mt-1">Typical: 70-90°C</p>
										</div>
										<div>
											<Label htmlFor="humidity" className="text-[#3D2819]/80">
												Humidity (%)
											</Label>
											<Input
												id="humidity"
												type="number"
												min="0"
												max="100"
												value={formData.avg_humidity_percent}
												onChange={(e) => setFormData({ ...formData, avg_humidity_percent: e.target.value })}
												className="mt-1 bg:white/60 border-[#3D2819]/20 text-[#3D2819]"
												placeholder="5-20"
											/>
											<p className="text-xs text-[#3D2819]/50 mt-1">Dry: 5-15%, with löyly 20-25%</p>
										</div>
									</div>
									<div>
										<Label htmlFor="relaxation" className="text-[#3D2819]/80">
											Relaxation (0-5)
										</Label>
										<Input
											id="relaxation"
											type="number"
											min="0"
											max="5"
											value={formData.relaxation_score}
											onChange={(e) => setFormData({ ...formData, relaxation_score: e.target.value })}
											className="mt-1 bg:white/60 border-[#3D2819]/20 text-[#3D2819]"
											placeholder="0-5"
										/>
										<p className="text-xs text-[#3D2819]/50 mt-1">5 is the best</p>
									</div>
									<div>
										<Label htmlFor="enjoyment" className="text-[#3D2819]/80">
											Enjoyment (0-5)
										</Label>
										<Input
											id="enjoyment"
											type="number"
											min="0"
											max="5"
											value={formData.enjoyment_score}
											onChange={(e) => setFormData({ ...formData, enjoyment_score: e.target.value })}
											className="mt-1 bg:white/60 border-[#3D2819]/20 text-[#3D2819]"
											placeholder="0-5"
										/>
										<p className="text-xs text-[#3D2819]/50 mt-1">5 is the best</p>
									</div>
									<div className="flex gap-2 pt-2">
										<Button onClick={handleAddSession} className="flex-1 bg-[#6B4423] hover:bg-[#6B4423]/90 text-[#FFEBCD] rounded-2xl">
											Add Session
										</Button>
										<Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 border-[#3D2819]/20 text-[#3D2819] hover:bg-[#3D2819]/5 rounded-2xl">
											Cancel
										</Button>
									</div>
								</div>
							</div>
						) : (
							<Button onClick={() => setShowForm(true)} className="w-full bg-white/60 hover:bg-white/80 text-[#3D2819] border border-[#3D2819]/20 rounded-2xl mb-6" variant="outline">
								<Plus className="w-5 h-5 mr-2" />
								Add Session
							</Button>
						)}
						<div className="space-y-3">
							<Button onClick={handleContinue} className="w-full bg-[#6B4423] hover:bg-[#6B4423]/90 text-[#FFEBCD] rounded-2xl">
								{sessions.length > 0 ? "Continue" : "Skip - Add Later"}
							</Button>
							<button onClick={onBack} className="w-full text-[#3D2819]/60 hover:text-[#3D2819] transition-colors py-2">
								Back
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}



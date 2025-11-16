import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { GuidedSession } from "./GuidedSession";
import SaunaCamera from "./SaunaCamera";

const recommendations = [
	{
		title: "Beginner's Guide",
		description: "Complete step-by-step tutorial for your first sauna experience",
		temp: 80,
		duration: 60,
		image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
		isGuided: true,
	},
	{
		title: "Recovery Session",
		description: "Gentle heat for muscle recovery after intense workout",
		temp: 75,
		duration: 15,
		image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
	},
	{
		title: "Deep Relaxation",
		description: "Optimal temperature for stress relief and mental clarity",
		temp: 85,
		duration: 20,
		image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
	},
	{
		title: "Performance Boost",
		description: "High-intensity session for endurance training",
		temp: 90,
		duration: 12,
		image: "https://images.unsplash.com/photo-1570993492903-ba4c3088f100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
	},
];

export function SaunaAlgorithms() {
	const [autoOptimize, setAutoOptimize] = useState(true);
	const [targetTemp, setTargetTemp] = useState([85]);
	const [sessionLength, setSessionLength] = useState([20]);
	const [showGuidedSession, setShowGuidedSession] = useState(false);

	// If guided session is active, show it instead
	if (showGuidedSession) {
		return <GuidedSession onBack={() => setShowGuidedSession(false)} />;
	}

	return (
		<div className="relative min-h-full bg-[#FFEBCD]">
			{/* Header with Background Image */}
			<div className="relative px-6 pt-12 pb-8 text-white overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: "url('https://images.unsplash.com/photo-1678742753298-9e6b10fcc42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHdvb2QlMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzE1MzcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')",
					}}
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/95 to-[#5C4033]/95" />

				<div className="relative z-10">
					<h1 className="text-white mb-2">Smart Sauna</h1>
					<p className="text-white/90 text-sm">
						AI-powered recommendations tailored to your goals and health data
					</p>
				</div>
			</div>

			<div className="px-6 py-6">
				{/* Real-Time Heatmap */}
				<div className="mb-6">
					<div className="flex justify-between items-center mb-3">
						<h3 className="text-[#3E2723]">Live Temperature Map</h3>
					</div>
					<SaunaCamera />
				</div>

				{/* AI Toggle */}
				<div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-4 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-[#3E2723] mb-1">Auto-Optimize</p>
							<p className="text-[#5C4033]/70 text-sm">Let AI adjust settings</p>
						</div>
						<Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
					</div>
				</div>

				{/* Manual Controls */}
				{!autoOptimize && (
					<div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/60 p-6 mb-6">
						<h3 className="text-[#3E2723] mb-6">Manual Settings</h3>

						<div className="space-y-6">
							<div>
								<div className="flex items-center justify-between mb-3">
									<label className="text-[#5C4033]">Temperature</label>
									<span className="text-[#3E2723]">{targetTemp[0]}°C</span>
								</div>
								<Slider
									value={targetTemp}
									onValueChange={setTargetTemp}
									min={60}
									max={100}
									step={5}
									className="w-full"
								/>
							</div>

							<div>
								<div className="flex items-center justify-between mb-3">
									<label className="text-[#5C4033]">Duration</label>
									<span className="text-[#3E2723]">{sessionLength[0]} min</span>
								</div>
								<Slider
									value={sessionLength}
									onValueChange={setSessionLength}
									min={5}
									max={60}
									step={5}
									className="w-full"
								/>
							</div>
						</div>

						<Button className="w-full mt-6 bg-gradient-to-r from-[#8B7355] to-[#6D5A47] text-white hover:from-[#6D5A47] hover:to-[#5C4033]">
							Start Custom Session
						</Button>
					</div>
				)}

				{/* AI Recommendations */}
				<div className="mb-4">
					<h3 className="text-[#3E2723] mb-2">Recommended Sessions</h3>
					<p className="text-[#5C4033]/80 text-sm mb-4">
						Based on your recent activity and wellness goals
					</p>
				</div>

				<div className="space-y-4">
					{recommendations.map((rec, index) => (
						<div key={index} className="relative overflow-hidden rounded-2xl shadow-lg group">
							{/* Background Image */}
							<div
								className="absolute inset-0 bg-cover bg-center"
								style={{ backgroundImage: `url('${rec.image}')` }}
							/>
							<div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/90 to-[#5C4033]/90" />

							{/* Content */}
							<div className="relative p-4">
								<h4 className="text-white mb-2">{rec.title}</h4>
								<p className="text-white/80 text-sm mb-4 leading-relaxed">{rec.description}</p>

								<div className="flex items-center gap-4 mb-4 text-sm text-white/70">
									<span>{rec.temp}°C</span>
									<span>•</span>
									<span>{rec.duration} min</span>
								</div>

								{rec.isGuided ? (
									<Button
										size="sm"
										className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40"
										onClick={() => setShowGuidedSession(true)}
									>
										Start Session
									</Button>
								) : (
									<Button
										size="sm"
										className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40"
									>
										Start Session
									</Button>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Health Integration */}
				<div className="relative overflow-hidden rounded-2xl shadow-lg bg-[#8B7355]/10 border border-[#8B7355]/30 p-4 mt-6">
					<div>
						<p className="text-[#3E2723] mb-1">Health Data Connected</p>
						<p className="text-[#5C4033]/80 text-sm leading-relaxed">
							Using your heart rate and activity data to optimize recommendations
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
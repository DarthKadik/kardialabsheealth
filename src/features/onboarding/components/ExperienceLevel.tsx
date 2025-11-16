import { ArrowLeft } from "lucide-react";

interface ExperienceLevelProps {
	onBack: () => void;
	onSelect: (level: number) => void;
}

const levels = [
	{ level: 1, title: "Beginner", description: "New to saunas, curious to learn" },
	{ level: 2, title: "Novice", description: "Tried a few times, still figuring out" },
	{ level: 3, title: "Regular", description: "Go regularly, comfortable with the basics" },
	{ level: 4, title: "Experienced", description: "Frequent user, know my routines well" },
	{ level: 5, title: "Expert", description: "Sauna enthusiast, live for the heat" },
];

export function ExperienceLevel({ onBack, onSelect }: ExperienceLevelProps) {
	return (
		<div className="min-h-screen w-full flex flex-col bg-[#FFEBCD]">
			<div className="flex flex-col h-full min-h-screen">
				<div className="flex items-center px-6 pt-8 pb-6">
					<button onClick={onBack} className="p-2 rounded-full hover:bg-[#3D2819]/10 transition-colors">
						<ArrowLeft className="w-6 h-6 text-[#3D2819]" />
					</button>
				</div>
				<div className="flex-1 px-6 pb-8">
					<h1 className="text-3xl text-[#3D2819] mb-3 text-center">What is your level of experience with saunas?</h1>
					<p className="text-[#3D2819]/60 text-center mb-8">Select the level that best describes you</p>
					<div className="flex flex-col gap-3 max-w-md mx-auto">
						{levels.map((item) => (
							<button
								key={item.level}
								onClick={() => onSelect(item.level)}
								className="relative overflow-hidden backdrop-blur-xl bg-white/40 border border-[#3D2819]/10 rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] text-left"
							>
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-[#6B4423] flex items-center justify-center flex-shrink-0">
										<span className="text-[#FFEBCD]">{item.level}</span>
									</div>
									<div className="flex-1">
										<h3 className="text-[#3D2819] mb-1">{item.title}</h3>
										<p className="text-sm text-[#3D2819]/70">{item.description}</p>
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}



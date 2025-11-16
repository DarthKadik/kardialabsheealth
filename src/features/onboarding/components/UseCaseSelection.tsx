import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/ui/button";

interface UseCaseSelectionProps {
	onBack: () => void;
	onContinue: (selectedCases: string[]) => void;
}

const useCases = [
	"Relaxation",
	"Morning routine",
	"Detox",
	"Sports Recovery",
	"Health Benefits",
	"Social Gatherings",
	"Relieving Muscle Soreness",
	"Meditation/mindfulness",
	"Skin care benefits",
];

export function UseCaseSelection({ onBack, onContinue }: UseCaseSelectionProps) {
	const [selected, setSelected] = useState<string[]>([]);

	const toggleSelection = (useCase: string) => {
		if (selected.includes(useCase)) {
			setSelected(selected.filter((item) => item !== useCase));
		} else if (selected.length < 3) {
			setSelected([...selected, useCase]);
		}
	};

	const handleContinue = () => {
		if (selected.length > 0) {
			onContinue(selected);
		}
	};

	return (
		<div className="min-h-screen w-full flex flex-col bg-[#FFEBCD]">
			<div className="flex flex-col h-full min-h-screen">
				<div className="flex items-center px-6 pt-8 pb-6">
					<button onClick={onBack} className="p-2 rounded-full hover:bg-[#3D2819]/10 transition-colors">
						<ArrowLeft className="w-6 h-6 text-[#3D2819]" />
					</button>
				</div>
				<div className="flex-1 px-6 pb-8 flex flex-col">
					<h1 className="text-3xl text-[#3D2819] mb-3 text-center">Which of these use cases match best your sauna goals?</h1>
					<p className="text-[#3D2819]/60 text-center mb-2">Pick 1-3 options</p>
					<p className="text-sm text-[#3D2819]/50 text-center mb-8">{selected.length}/3 selected</p>
					<div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full">
						{useCases.map((useCase) => {
							const isSelected = selected.includes(useCase);
							const canSelect = selected.length < 3 || isSelected;
							return (
								<button
									key={useCase}
									onClick={() => toggleSelection(useCase)}
									disabled={!canSelect}
									className={`relative overflow-hidden backdrop-blur-xl rounded-2xl p-4 shadow-lg transition-all duration-300 ${
										isSelected
											? "bg-[#FF6B6B]/80 border-2 border-[#FF6B6B] scale-[1.02]"
											: canSelect
											? "bg-white/40 border border-[#3D2819]/10 hover:scale-[1.02] active:scale-[0.98]"
											: "bg-white/20 border border-[#3D2819]/5 opacity-50"
									}`}
									style={isSelected ? { backgroundColor: "rgba(245, 73, 0, 0.8)" } : undefined}
								>
									<span className={`${isSelected ? "text-[#FFEBCD]" : "text-[#3D2819]"}`}>{useCase}</span>
								</button>
							);
						})}
					</div>
					<div className="mt-6 max-w-md mx-auto w-full">
						<Button
							onClick={handleContinue}
							disabled={selected.length === 0}
							className={`w-full rounded-2xl text-[#FFEBCD] transition-all ${
								selected.length === 0 ? "bg-[#3D2819]/30 cursor-not-allowed" : "bg-[#6B4423] hover:bg-[#6B4423]/90"
							}`}
						>
							Continue
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}



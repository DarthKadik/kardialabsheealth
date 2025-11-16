import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

interface DemoScreenProps {
	onBack: () => void;
	onStart: () => void;
}

export function DemoScreen({ onBack, onStart }: DemoScreenProps) {
	return (
		<div className="min-h-screen w-full flex flex-col bg-[#3D2819] relative overflow-hidden">
			<div className="absolute inset-0">
				<ImageWithFallback
					src="https://images.unsplash.com/photo-1759302353458-3c617bfd428b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMGludGVyaW9yJTIwd29vZHxlbnwxfHx8fDE3NjMyMTUxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
					alt="Sauna interior"
					className="w-full h-full object-cover opacity-30"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-[#3D2819]/90 to-[#3D2819]" />
			</div>
			<div className="relative z-10 flex flex-col h-full min-h-screen">
				<div className="flex items-center px-6 pt-8 pb-6">
					<button onClick={onBack} className="p-2 rounded-full hover:bg-[#FFEBCD]/10 transition-colors backdrop-blur-sm">
						<ArrowLeft className="w-6 h-6 text-[#FFEBCD]" />
					</button>
					<h2 className="ml-4 text-xl text-[#FFEBCD]">Demo Mode</h2>
				</div>
				<div className="flex-1 px-6 pt-8 flex flex-col items-center justify-center">
					<div className="backdrop-blur-xl bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 rounded-3xl p-8 shadow-2xl text-center max-w-md">
						<h3 className="mb-4 text-[#FFEBCD]">Junction Demo</h3>
						<p className="text-[#FFEBCD]/70 mb-8">You're now in demo mode. Explore all features without creating an account.</p>
						<Button className="w-full hover:bg-[#FF6B6B]/80 text-[#FFEBCD] rounded-2xl border border-[#FFEBCD]/20 bg-[rgb(245,73,0)]" onClick={onStart}>
							Start Demo
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}



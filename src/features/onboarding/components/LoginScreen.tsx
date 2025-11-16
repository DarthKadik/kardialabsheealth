import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

interface LoginScreenProps {
	onBack: () => void;
	onSubmit: () => void;
}

export function LoginScreen({ onBack, onSubmit }: LoginScreenProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit();
	};

	return (
		<div className="min-h-screen w-full flex flex-col bg-[#3D2819] relative overflow-hidden">
			<div className="absolute inset-0">
				<ImageWithFallback
					src="https://images.unsplash.com/photo-1757940661240-f2e8d2ff93bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcGElMjBzYXVuYXxlbnwxfHx8fDE3NjMyNTYyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
					<h2 className="ml-4 text-xl text-[#FFEBCD]">Log In</h2>
				</div>
				<div className="flex-1 px-6 pt-8">
					<form
						onSubmit={handleSubmit}
						className="backdrop-blur-xl bg-[#FFEBCD]/10 border border-[#FFEBCD]/20 rounded-3xl p-8 shadow-2xl"
					>
						<h3 className="mb-6 text-[#FFEBCD]">Welcome back</h3>
						<div className="space-y-4">
							<div>
								<label htmlFor="email" className="block mb-2 text-[#FFEBCD]/90">
									Email
								</label>
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									className="w-full bg-[#3D2819]/40 border-[#FFEBCD]/20 text-[#FFEBCD] placeholder:text-[#FFEBCD]/40"
								/>
							</div>
							<div>
								<label htmlFor="password" className="block mb-2 text-[#FFEBCD]/90">
									Password
								</label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									className="w-full bg-[#3D2819]/40 border-[#FFEBCD]/20 text-[#FFEBCD] placeholder:text-[#FFEBCD]/40"
								/>
							</div>
							<Button type="submit" className="w-full bg-[#6B4423] hover:bg-[#6B4423]/80 text-[#FFEBCD] mt-6 rounded-2xl border border-[#FFEBCD]/20">
								Sign In
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}



import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

interface OnboardingChoiceProps {
	onLogin: () => void;
	onDemo: () => void;
}

export function OnboardingChoice({ onLogin, onDemo }: OnboardingChoiceProps) {
	return (
		<div className="min-h-screen w-full flex flex-col bg-[#FFEBCD]">
			<div className="flex flex-col h-full min-h-screen">
				<div className="flex flex-col items-center pt-16 px-6">
					<h1 className="text-5xl text-[#3D2819] mb-3">Harvia</h1>
					<p className="text-[#3D2819]/70 text-center">Your perfect sauna experience</p>
				</div>
				<div className="flex-1 flex flex-col justify-center px-6 gap-4 pb-8">
					<button
						onClick={onLogin}
						className="relative overflow-hidden rounded-3xl p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] min-h-[200px] border-2 border-[#6B4423]/30"
					>
						<div className="absolute inset-0">
							<ImageWithFallback
								src="https://images.unsplash.com/photo-1749561532759-f66ea4b3e66c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzYXVuYXxlbnwxfHx8fDE3NjMyNTY0NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
								alt="Modern sauna"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-[#6B4423]/80" />
						</div>
						<div className="relative flex flex-col items-center justify-center">
							<h2 className="text-3xl text-[#FFEBCD] mb-2">Sign Up / Log In</h2>
							<p className="text-[#FFEBCD]/90 text-center">Access your sauna and settings</p>
						</div>
					</button>

					<button
						onClick={onDemo}
						className="relative overflow-hidden rounded-3xl p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] min-h-[200px] border-2 border-[#FF6B6B]/30"
					>
						<div className="absolute inset-0">
							<ImageWithFallback
								src="https://images.unsplash.com/photo-1757940556610-a114be4733bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXVuYSUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzYzMjU2NDQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
								alt="Sauna relaxation"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-[#FF6B6B]/80 bg-[rgba(245,73,0,0.8)]" />
						</div>
						<div className="relative flex flex-col items-center justify-center">
							<h2 className="text-3xl text-[#FFEBCD] mb-2">Demo for Junction</h2>
							<p className="text-[#FFEBCD]/90 text-center">Try without login</p>
						</div>
						<div className="absolute top-4 right-4">
							<div className="px-3 py-1 bg-[#3D2819]/60 backdrop-blur-sm rounded-full">
								<span className="text-[#FFEBCD] text-xs">No account needed</span>
							</div>
						</div>
					</button>
				</div>
				<div className="px-6 pb-8">
					<p className="text-[#3D2819]/60 text-center text-sm">
						Logging in will give you a more authentic experience but also require connecting an Oura ring & manually
						filling your sauna data from the past few weeks
					</p>
				</div>
			</div>
		</div>
	);
}



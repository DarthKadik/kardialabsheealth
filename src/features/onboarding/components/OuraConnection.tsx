import { Button } from "../../../components/ui/button";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

interface OuraConnectionProps {
	onConnect: () => void;
	onSkip: () => void;
}

export function OuraConnection({ onConnect, onSkip }: OuraConnectionProps) {
	return (
		<div className="min-h-screen w-full flex flex-col bg-[#FFEBCD]">
			<div className="flex flex-col h-full min-h-screen">
				<div className="flex flex-col items-center pt-16 px-6">
					<h1 className="text-3xl text-[#3D2819] mb-3 text-center">Connect Your Oura Ring</h1>
					<p className="text-[#3D2819]/60 text-center">Get personalized sauna tips based on your recovery data</p>
				</div>
				<div className="flex-1 flex flex-col justify-center px-6 pb-8">
					<div className="max-w-md mx-auto w-full">
						<div className="mb-6 rounded-3xl overflow-hidden">
							<ImageWithFallback
								src="https://images.unsplash.com/photo-1708221269460-fc630272e54d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXJhJTIwcmluZyUyMHdlYXJhYmxlfGVufDF8fHx8MTc2MzI2NDM5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
								alt="Oura Ring"
								className="w-full h-48 object-cover"
							/>
						</div>
						<div className="backdrop-blur-xl bg-white/40 border border-[#3D2819]/10 rounded-3xl p-6 shadow-lg mb-6">
							<h3 className="text-[#3D2819] mb-4">Benefits of connecting:</h3>
							<ul className="space-y-3">
								<li className="flex items-start gap-3 text-[#3D2819]/80">
									<span className="w-6 h-6 rounded-full bg-[#6B4423] flex items-center justify-center flex-shrink-0 mt-0.5">
										<span className="text-[#FFEBCD] text-xs">✓</span>
									</span>
									<span>Personalized sauna timing based on your sleep and recovery</span>
								</li>
								<li className="flex items-start gap-3 text-[#3D2819]/80">
									<span className="w-6 h-6 rounded-full bg-[#6B4423] flex items-center justify-center flex-shrink-0 mt-0.5">
										<span className="text-[#FFEBCD] text-xs">✓</span>
									</span>
									<span>Smart recommendations for session duration and temperature</span>
								</li>
								<li className="flex items-start gap-3 text-[#3D2819]/80">
									<span className="w-6 h-6 rounded-full bg-[#6B4423] flex items-center justify-center flex-shrink-0 mt-0.5">
										<span className="text-[#FFEBCD] text-xs">✓</span>
									</span>
									<span>Track how sauna sessions impact your readiness and HRV</span>
								</li>
								<li className="flex items-start gap-3 text-[#3D2819]/80">
									<span className="w-6 h-6 rounded-full bg-[#6B4423] flex items-center justify-center flex-shrink-0 mt-0.5">
										<span className="text-[#FFEBCD] text-xs">✓</span>
									</span>
									<span>Get alerts when your body is optimally ready for heat therapy</span>
								</li>
							</ul>
						</div>
						<Button onClick={onConnect} className="w-full bg-[#3D2819] hover:bg-[#3D2819]/90 text-[#FFEBCD] rounded-2xl h-14 mb-4 transition-all hover:scale-[1.02] active:scale-[0.98]">
							<div className="flex items-center justify-center gap-3">
								<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
									<span className="text-black">○</span>
								</div>
								<span>Connect Oura Account</span>
							</div>
						</Button>
						<button onClick={onSkip} className="w-full text-[#3D2819]/60 hover:text-[#3D2819] transition-colors py-3">
							Skip for now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}



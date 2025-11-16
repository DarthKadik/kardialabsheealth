import { useEffect, useState } from "react";

interface LoadingScreenProps {
	onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const duration = 3000;
		const interval = 30;
		const increment = (interval / duration) * 100;
		const timer = setInterval(() => {
			setProgress((prev) => {
				const next = prev + increment;
				if (next >= 100) {
					clearInterval(timer);
					setTimeout(onComplete, 200);
					return 100;
				}
				return next;
			});
		}, interval);
		return () => clearInterval(timer);
	}, [onComplete]);

	return (
		<div className="min-h-screen w-full flex flex-col bg-[#FFEBCD] items-center justify-center px-6">
			<div className="max-w-md w-full">
				<div className="text-center mb-12">
					<h1 className="text-5xl text-[#3D2819] mb-4">Harvia</h1>
					<p className="text-xl text-[#3D2819]/70">Generating your personalized experience</p>
				</div>
				<div className="w-full">
					<div className="w-full h-3 bg-white/40 rounded-full overflow-hidden backdrop-blur-xl border border-[#3D2819]/10 shadow-lg">
						<div
							className="h-full transition-all duration-300 ease-out rounded-full"
							style={{
								width: `${progress}%`,
								background: "linear-gradient(90deg, #6B4423 0%, rgba(245, 73, 0, 0.9) 100%)",
							}}
						/>
					</div>
					<p className="text-center mt-4 text-[#3D2819]/60 text-sm">{Math.round(progress)}%</p>
				</div>
				<div className="mt-12 text-center">
					<p className="text-[#3D2819]/50 text-sm">
						{progress < 30 && "Analyzing your preferences..."}
						{progress >= 30 && progress < 60 && "Customizing your experience..."}
						{progress >= 60 && progress < 90 && "Setting up your profile..."}
						{progress >= 90 && "Almost ready..."}
					</p>
				</div>
			</div>
		</div>
	);
}



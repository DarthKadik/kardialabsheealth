import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOnboarding } from "../features/onboarding/useOnboarding";
import { OnboardingChoice } from "../features/onboarding/components/OnboardingChoice";
import { LoginScreen } from "../features/onboarding/components/LoginScreen";
import { DemoScreen } from "../features/onboarding/components/DemoScreen";
import { ExperienceLevel } from "../features/onboarding/components/ExperienceLevel";
import { UseCaseSelection } from "../features/onboarding/components/UseCaseSelection";
import { LoadingScreen } from "../features/onboarding/components/LoadingScreen";
import { OuraConnection } from "../features/onboarding/components/OuraConnection";
import { SaunaHistory } from "../features/onboarding/components/SaunaHistory";

export default function OnboardingPage() {
	const { setCompleted } = useOnboarding();
	const navigate = useNavigate();
	type Screen = "choice" | "login" | "demo" | "experience" | "useCases" | "oura" | "saunaHistory" | "loading" | "main";
	type SaunaSession = {
		session_id: string;
		timestamp: string;
		session_type_id: number;
		session_type_title: string;
		duration_minutes: number;
		recovery_score?: number;
		relaxation_score: number;
		enjoyment_score: number;
		avg_temperature_celsius: number;
		avg_humidity_percent: number;
	};
	type UserData = {
		isDemo: boolean;
		experienceLevel: number | null;
		useCases: string[];
		ouraConnected: boolean;
		saunaSessions: SaunaSession[];
	};
	const [currentScreen, setCurrentScreen] = useState<Screen>("choice");
	const [userData, setUserData] = useState<UserData>({
		isDemo: false,
		experienceLevel: null,
		useCases: [],
		ouraConnected: false,
		saunaSessions: [],
	});

	const handleLogin = () => {
		setUserData({ ...userData, isDemo: false });
		setCurrentScreen("login");
	};
	const handleDemo = () => {
		setUserData({ ...userData, isDemo: true });
		setCurrentScreen("demo");
	};
	const handleLoginSubmit = () => setCurrentScreen("experience");
	const handleDemoStart = () => setCurrentScreen("experience");
	const handleExperienceSelect = (level: number) => {
		setUserData({ ...userData, experienceLevel: level });
		setCurrentScreen("useCases");
	};
	const handleUseCasesSelect = (cases: string[]) => {
		const updatedData = { ...userData, useCases: cases };
		setUserData(updatedData);
		if (!userData.isDemo) {
			setCurrentScreen("oura");
		} else {
			setCurrentScreen("loading");
		}
	};
	const handleOuraConnect = () => {
		const updatedData = { ...userData, ouraConnected: true };
		setUserData(updatedData);
		setCurrentScreen("saunaHistory");
	};
	const handleOuraSkip = () => {
		const updatedData = { ...userData, ouraConnected: false };
		setUserData(updatedData);
		setCurrentScreen("saunaHistory");
	};
	const handleSaunaHistorySubmit = (sessions: SaunaSession[]) => {
		const updatedData = { ...userData, saunaSessions: sessions };
		setUserData(updatedData);
		try {
			localStorage.setItem("harvia_user_data", JSON.stringify(updatedData));
		} catch {
			// ignore
		}
		setCurrentScreen("loading");
	};
	const handleLoadingComplete = () => {
		setCompleted(true);
		navigate("/", { replace: true });
	};

	if (currentScreen === "choice") {
		return <OnboardingChoice onLogin={handleLogin} onDemo={handleDemo} />;
	}
	if (currentScreen === "login") {
		return <LoginScreen onBack={() => setCurrentScreen("choice")} onSubmit={handleLoginSubmit} />;
	}
	if (currentScreen === "demo") {
		return <DemoScreen onBack={() => setCurrentScreen("choice")} onStart={handleDemoStart} />;
	}
	if (currentScreen === "experience") {
		return (
			<ExperienceLevel onBack={() => setCurrentScreen(userData.isDemo ? "demo" : "login")} onSelect={handleExperienceSelect} />
		);
	}
	if (currentScreen === "useCases") {
		return <UseCaseSelection onBack={() => setCurrentScreen("experience")} onContinue={handleUseCasesSelect} />;
	}
	if (currentScreen === "oura") {
		return <OuraConnection onConnect={handleOuraConnect} onSkip={handleOuraSkip} />;
	}
	if (currentScreen === "saunaHistory") {
		return <SaunaHistory onBack={() => setCurrentScreen("oura")} onContinue={handleSaunaHistorySubmit} />;
	}
	return <LoadingScreen onComplete={handleLoadingComplete} />;
}



import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type OnboardingContextValue = {
	completed: boolean;
	setCompleted: (value: boolean) => void;
	reset: () => void;
	storageKey: string;
};

const STORAGE_KEY = "sauna_onboarding_completed_v1";

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
	const [completed, setCompletedState] = useState<boolean>(() => {
		try {
			return localStorage.getItem(STORAGE_KEY) === "true";
		} catch {
			return false;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, completed ? "true" : "false");
		} catch {
			// ignore storage failures (private mode, etc.)
		}
	}, [completed]);

	const setCompleted = useCallback((value: boolean) => {
		setCompletedState(value);
	}, []);

	const reset = useCallback(() => {
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			// ignore
		}
		setCompletedState(false);
	}, []);

	const value = useMemo<OnboardingContextValue>(
		() => ({
			completed,
			setCompleted,
			reset,
			storageKey: STORAGE_KEY,
		}),
		[completed, setCompleted, reset]
	);

	return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingContext(): OnboardingContextValue {
	const ctx = useContext(OnboardingContext);
	if (!ctx) {
		throw new Error("useOnboardingContext must be used within OnboardingProvider");
	}
	return ctx;
}



import { HashRouter, Route, Routes } from "react-router-dom";
import { OnboardingProvider } from "./features/onboarding/OnboardingProvider";
import RedirectIfOnboarded from "./features/onboarding/RedirectIfOnboarded";
import RequireOnboarding from "./features/onboarding/RequireOnboarding";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
	return (
		<OnboardingProvider>
			<HashRouter>
				<Routes>
					<Route element={<RedirectIfOnboarded />}>
						<Route path="/onboarding" element={<OnboardingPage />} />
					</Route>
					<Route element={<RequireOnboarding />}>
						<Route path="/" element={<DashboardPage />} />
					</Route>
				</Routes>
			</HashRouter>
		</OnboardingProvider>
	);
}
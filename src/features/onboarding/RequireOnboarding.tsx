import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useOnboarding } from "./useOnboarding";

export default function RequireOnboarding() {
	const { completed } = useOnboarding();
	const location = useLocation();
	if (!completed) {
		return <Navigate to="/onboarding" replace state={{ from: location }} />;
	}
	return <Outlet />;
}



import { Navigate, Outlet } from "react-router-dom";
import { useOnboarding } from "./useOnboarding";

export default function RedirectIfOnboarded() {
	const { completed } = useOnboarding();
	if (completed) {
		return <Navigate to="/" replace />;
	}
	return <Outlet />;
}



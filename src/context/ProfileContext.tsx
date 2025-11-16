import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Profile = Record<string, string>;

type ProfileContextValue = {
  profile: Profile;
  setProfile: (updater: Profile | ((prev: Profile) => Profile)) => void;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "profile";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile>({});

  // Initialize from localStorage
  useEffect(() => {
    try {
      const fromStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (fromStorage) {
        const parsed = JSON.parse(fromStorage) as Profile;
        if (parsed && typeof parsed === "object") {
          setProfileState(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse profile from localStorage:", e);
    }
  }, []);

  // Merge URLSearchParams on mount (keep URL unchanged)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params && Array.from(params.keys()).length > 0) {
        const entries = Object.fromEntries(params.entries()) as Profile;
        setProfileState(prev => ({ ...prev, ...entries }));
      }
    } catch (e) {
      console.error("Failed to parse URL search params for profile:", e);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to persist profile to localStorage:", e);
    }
  }, [profile]);

  const value = useMemo<ProfileContextValue>(() => {
    const setProfile: ProfileContextValue["setProfile"] = updater => {
      setProfileState(prev =>
        typeof updater === "function" ? (updater as (p: Profile) => Profile)(prev) : updater
      );
    };
    return { profile, setProfile };
  }, [profile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}



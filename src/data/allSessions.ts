/**
 * Unified Session Registry
 * 
 * This file provides a single source of truth for all guided sauna sessions.
 * Each session is exported individually and also available through a unified registry.
 * 
 * Import examples:
 * - import { getAllSessions, getSessionById } from '../data/allSessions';
 * - import { BEGINNERS_GUIDE, FINNISH_TRADITIONAL } from '../data/allSessions';
 */

import { GuidedSessionConfig } from "./guidedSessions";
import { radiantSkin, finnishTraditional, detoxRespiratory } from "./guidedSessionsExtended";

// Import all sessions from guidedSessions.ts
// We need to import the raw session objects, not from the guidedSessions object
import { guidedSessions } from "./guidedSessions";

// Export individual session constants with clear names
export const BEGINNERS_GUIDE = guidedSessions["beginners-guide"];
export const RECOVERY_SESSION = guidedSessions["recovery-session"];
export const DEEP_RELAXATION = guidedSessions["deep-relaxation"];
export const PERFORMANCE_BOOST = guidedSessions["performance-boost"];
export const ATHLETIC_RECOVERY = guidedSessions["athletic-recovery"];
export const MORNING_ENERGIZER = guidedSessions["morning-energizer"];
export const MINDFUL_PRESENCE = guidedSessions["mindful-presence"];
export const EVENING_WIND_DOWN = guidedSessions["evening-wind-down"];

// Extended sessions
export const RADIANT_SKIN = radiantSkin;
export const FINNISH_TRADITIONAL = finnishTraditional;
export const DETOX_RESPIRATORY = detoxRespiratory;

/**
 * Complete session registry - maps session IDs to their configurations
 * This is the single source of truth for all sessions
 */
export const SESSION_REGISTRY: { [key: string]: GuidedSessionConfig } = {
  "beginners-guide": BEGINNERS_GUIDE,
  "recovery-session": RECOVERY_SESSION,
  "deep-relaxation": DEEP_RELAXATION,
  "performance-boost": PERFORMANCE_BOOST,
  "athletic-recovery": ATHLETIC_RECOVERY,
  "morning-energizer": MORNING_ENERGIZER,
  "mindful-presence": MINDFUL_PRESENCE,
  "evening-wind-down": EVENING_WIND_DOWN,
  "radiant-skin": RADIANT_SKIN,
  "finnish-traditional": FINNISH_TRADITIONAL,
  "detox-respiratory": DETOX_RESPIRATORY,
};

/**
 * Get a session by its ID
 * @param sessionId - The unique identifier for the session
 * @returns The session configuration or null if not found
 */
export function getSessionById(sessionId: string): GuidedSessionConfig | null {
  return SESSION_REGISTRY[sessionId] || null;
}

/**
 * Get all available sessions
 * @returns Array of all session configurations
 */
export function getAllSessions(): GuidedSessionConfig[] {
  return Object.values(SESSION_REGISTRY);
}

/**
 * Get all session IDs
 * @returns Array of all session IDs
 */
export function getAllSessionIds(): string[] {
  return Object.keys(SESSION_REGISTRY);
}

/**
 * Check if a session exists
 * @param sessionId - The session ID to check
 * @returns true if the session exists
 */
export function sessionExists(sessionId: string): boolean {
  return sessionId in SESSION_REGISTRY;
}

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


import { GuidedSessionConfig, guidedSessions } from "./guidedSessions";
import { radiantSkin, finnishTraditional, detoxRespiratory } from "./guidedSessionsExtended";

// Combine all sessions into a single registry
export const SESSION_REGISTRY: { [key: string]: GuidedSessionConfig } = {
  ...guidedSessions,
  "radiant-skin": radiantSkin,
  "finnish-traditional": finnishTraditional,
  "detox-respiratory": detoxRespiratory,
};

/**
 * Get a session by its ID
 * @param sessionId - The unique identifier for the session
 * @returns The session configuration or null if not found
 */
export function getSessionById(sessionId: string): GuidedSession_Config | null {
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


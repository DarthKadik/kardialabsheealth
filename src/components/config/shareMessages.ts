/**
 * Social Share Messages Configuration
 * 
 * This file contains all shareable messages for social media platforms.
 * Developers can easily customize these messages to match branding and marketing goals.
 * 
 * Available variables that can be used in messages:
 * - {totalSessions}: Total number of sauna sessions
 * - {totalMinutes}: Total minutes spent in sauna
 * - {totalHours}: Total hours spent in sauna (calculated from totalMinutes)
 * - {streak}: Current session streak
 */

export interface ShareMessageConfig {
  /** Message template for Instagram (will be copied to clipboard) */
  instagram: string;
  
  /** Message template for Facebook sharing */
  facebook: string;
  
  /** Message template for X/Twitter posting */
  twitter: string;
  
  /** Message template for WhatsApp sharing */
  whatsapp: string;
  
  /** Fallback message when stats are not available */
  fallback: string;
  
  /** Success notification message after copying to clipboard */
  copySuccessMessage: string;
}

/**
 * Default share messages for Sauna Year statistics
 * Edit these templates to customize what users share on social media
 */
export const saunaYearShareMessages: ShareMessageConfig = {
  instagram: "🧖‍♂️ My Sauna Year with Harvia!\n\n📊 {totalSessions} sessions\n⏱️ {totalHours} hours of wellness\n🔥 {streak} day streak\n\nJoin me in the sauna lifestyle! #HarviaSauna #SaunaLife #Wellness",
  
  facebook: "I've completed {totalSessions} sauna sessions and spent {totalHours} hours prioritizing my wellness with Harvia this year! 🧖‍♂️🔥 #HarviaSauna #WellnessJourney",
  
  twitter: "My Sauna Year with @Harvia:\n🧖‍♂️ {totalSessions} sessions\n⏱️ {totalHours} hours\n🔥 {streak} day streak\n\nThe sauna lifestyle is transformative! #HarviaSauna #SaunaLife",
  
  whatsapp: "🧖‍♂️ Check out my Sauna Year with Harvia!\n\n📊 {totalSessions} sessions\n⏱️ {totalHours} hours of pure relaxation\n🔥 {streak} day streak\n\nYou should try it too!",
  
  fallback: "Join me in tracking your wellness journey with Harvia! 🧖‍♂️🔥 #HarviaSauna",
  
  copySuccessMessage: "Message copied to clipboard! Open Instagram to share."
};

/**
 * Helper function to replace variables in message templates
 * @param template - The message template with variables
 * @param stats - Object containing the statistics to replace
 * @returns Formatted message with replaced variables
 */
export function formatShareMessage(
  template: string,
  stats: {
    totalSessions?: number;
    totalMinutes?: number;
    totalHours?: number;
    streak?: number;
  }
): string {
  let message = template;
  
  if (stats.totalSessions !== undefined) {
    message = message.replace(/{totalSessions}/g, stats.totalSessions.toString());
  }
  
  if (stats.totalMinutes !== undefined) {
    message = message.replace(/{totalMinutes}/g, stats.totalMinutes.toString());
  }
  
  if (stats.totalHours !== undefined) {
    message = message.replace(/{totalHours}/g, stats.totalHours.toString());
  } else if (stats.totalMinutes !== undefined) {
    // Calculate hours from minutes if not provided
    const hours = Math.round(stats.totalMinutes / 60);
    message = message.replace(/{totalHours}/g, hours.toString());
  }
  
  if (stats.streak !== undefined) {
    message = message.replace(/{streak}/g, stats.streak.toString());
  }
  
  return message;
}

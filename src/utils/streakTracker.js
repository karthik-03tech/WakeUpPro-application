// src/utils/streakTracker.js
// Tracks daily wake-up streaks in AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@wakeup_streak';

/**
 * Streak shape: { count: number, lastDate: 'YYYY-MM-DD' }
 */

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export async function getStreak() {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lastDate: null };
  } catch {
    return { count: 0, lastDate: null };
  }
}

/**
 * Call this every time the user successfully dismisses an alarm.
 * Returns the new streak object.
 */
export async function recordWakeUp() {
  const streak = await getStreak();
  const today = todayStr();

  if (streak.lastDate === today) {
    // Already recorded today, don't double count
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const isConsecutive = streak.lastDate === yesterdayStr;
  const newStreak = {
    count: isConsecutive ? streak.count + 1 : 1,
    lastDate: today,
  };

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  return newStreak;
}

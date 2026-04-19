// src/utils/alarmStorage.js
// AsyncStorage-based CRUD for alarms

import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_KEY = '@wakeup_alarms';

/**
 * Alarm shape:
 * {
 *   id: string (uuid-like),
 *   label: string,
 *   time: string (HH:MM 24h),
 *   days: number[] (0=Sun … 6=Sat, empty = once),
 *   enabled: boolean,
 *   challengeType: 'question' | 'steps',
 *   difficulty: 'easy' | 'medium' | 'hard',
 *   snoozeCount: number (runtime only, not persisted),
 *   sound: 'default',
 *   notificationIds: string[],
 * }
 */

export async function getAlarms() {
  try {
    const raw = await AsyncStorage.getItem(ALARMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveAlarm(alarm) {
  const alarms = await getAlarms();
  const existing = alarms.findIndex((a) => a.id === alarm.id);
  if (existing >= 0) {
    alarms[existing] = alarm;
  } else {
    alarms.push(alarm);
  }
  await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
}

export async function deleteAlarm(id) {
  const alarms = await getAlarms();
  const filtered = alarms.filter((a) => a.id !== id);
  await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(filtered));
}

export async function updateAlarmEnabled(id, enabled) {
  const alarms = await getAlarms();
  const alarm = alarms.find((a) => a.id === id);
  if (alarm) {
    alarm.enabled = enabled;
    await AsyncStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
    return alarm;
  }
  return null;
}

export function generateId() {
  return `alarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

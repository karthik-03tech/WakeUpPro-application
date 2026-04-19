// src/utils/alarmScheduler.js
// Schedules and cancels Expo Notifications for alarms

import * as Notifications from 'expo-notifications';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Schedule one alarm. Returns array of notification IDs scheduled.
 * alarm.days = [] means "fire once at the next occurrence of alarm.time"
 */
export async function scheduleAlarm(alarm) {
  const ids = [];
  const [hours, minutes] = alarm.time.split(':').map(Number);

  if (alarm.days && alarm.days.length > 0) {
    // Weekly repeating – one notification per day
    for (const dayOfWeek of alarm.days) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ WakeUp Pro',
          body: alarm.label || 'Time to wake up!',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          data: {
            type: 'alarm',
            alarmId: alarm.id,
            challengeType: alarm.challengeType,
            difficulty: alarm.difficulty,
          },
        },
        trigger: {
          type: 'weekly',
          weekday: dayOfWeek + 1, // Expo uses 1–7 (Sun=1)
          hour: hours,
          minute: minutes,
          second: 0,
          repeats: true,
        },
      });
      ids.push(id);
    }
  } else {
    // One-time
    const now = new Date();
    const trigger = new Date();
    trigger.setHours(hours, minutes, 0, 0);
    if (trigger <= now) trigger.setDate(trigger.getDate() + 1); // next day

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ WakeUp Pro',
        body: alarm.label || 'Time to wake up!',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: {
          type: 'alarm',
          alarmId: alarm.id,
          challengeType: alarm.challengeType,
          difficulty: alarm.difficulty,
        },
      },
      trigger: { date: trigger },
    });
    ids.push(id);
  }

  return ids;
}

/**
 * Cancel all notification IDs associated with an alarm.
 */
export async function cancelAlarm(notificationIds = []) {
  for (const id of notificationIds) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}

export { DAY_NAMES };

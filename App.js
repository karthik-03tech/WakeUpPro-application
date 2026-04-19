// App.js
// Root component: sets up navigation, notification listeners, background task,
// and theme provider.

import React, { useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from './src/hooks/useTheme';
import AppNavigator from './src/navigation/AppNavigator';

// ─── Notification Handler ─────────────────────────────────────────────────────
// Show notification even when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ─── Background Task ─────────────────────────────────────────────────────────
const BACKGROUND_ALARM_TASK = 'BACKGROUND_ALARM_TASK';

TaskManager.defineTask(BACKGROUND_ALARM_TASK, ({ data, error }) => {
  if (error) { console.error('BG task error:', error); return; }
  // Background alarms are handled via Expo Notifications –
  // this task keeps the process alive.
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// ─── Navigation Ref (used to navigate from notification response) ─────────────
export const navigationRef = React.createRef();

function navigate(name, params) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.navigate(name, params);
  }
}

// ─── Inner App (has theme context) ────────────────────────────────────────────
function InnerApp() {
  const theme = useTheme();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Notification received while app is in foreground → show RingingScreen
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data;
      if (data?.type === 'alarm') {
        navigate('Ringing', {
          alarmId: data.alarmId,
          challengeType: data.challengeType,
          difficulty: data.difficulty,
          label: notification.request.content.body,
        });
      }
    });

    // User tapped notification from background/killed state → navigate to Ringing
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'alarm') {
        navigate('Ringing', {
          alarmId: data.alarmId,
          challengeType: data.challengeType,
          difficulty: data.difficulty,
          label: response.notification.request.content.body,
        });
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// ─── Permission helper ────────────────────────────────────────────────────────
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  // Register background task
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_ALARM_TASK, {
      minimumInterval: 60,    // seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (e) {
    // Task may already be registered
    console.log('BG task registration:', e.message);
  }

  // Android notification channel
  await Notifications.setNotificationChannelAsync('alarms', {
    name: 'Alarm Notifications',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 200, 500],
    lightColor: '#00D4FF',
    sound: 'alarm.mp3',
    bypassDnd: true,
  });
}

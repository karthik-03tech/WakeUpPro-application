// src/screens/RingingScreen.js
// Full-screen immersive alarm ringing screen with snooze and challenge launcher

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  BackHandler, Vibration, Dimensions, StatusBar
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { getAlarms, saveAlarm } from '../utils/alarmStorage';

const { width } = Dimensions.get('window');
const MAX_SNOOZE = 2;
const SNOOZE_MS = 5 * 60 * 1000; // 5 minutes

const VIBRATION_PATTERN = [0, 500, 200, 500, 200, 500];

export default function RingingScreen({ navigation, route }) {
  const theme = useTheme();
  const alarmId = route.params?.alarmId;
  const challengeType = route.params?.challengeType || 'question';
  const difficulty = route.params?.difficulty || 'medium';
  const label = route.params?.label || 'Wake Up!';

  const [snoozeUsed, setSnoozeUsed] = useState(0);
  const [alarm, setAlarm] = useState(null);

  const soundRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  // Prevent back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  // Load alarm and snooze count
  useEffect(() => {
    if (alarmId) {
      getAlarms().then(list => {
        const found = list.find(a => a.id === alarmId);
        if (found) {
          setAlarm(found);
          setSnoozeUsed(found.snoozeCount || 0);
        }
      });
    }
  }, [alarmId]);

  // Animations
  useEffect(() => {
    // Pulsing ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();

    // Glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Text entrance
    Animated.spring(textAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, []);

  // Sound & vibration
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/alarm.mp3'),
          { isLooping: true, volume: 1.0 }
        );
        if (mounted) {
          soundRef.current = sound;
          await sound.playAsync();
        }
      } catch (e) {
        console.log('Sound not available:', e.message);
      }
    })();
    Vibration.vibrate(VIBRATION_PATTERN, true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    return () => {
      mounted = false;
      if (soundRef.current) soundRef.current.stopAsync().catch(() => {});
      Vibration.cancel();
    };
  }, []);

  const stopAlarm = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
    }
    Vibration.cancel();
    // Reset snooze count on dismiss
    if (alarm) {
      await saveAlarm({ ...alarm, snoozeCount: 0 });
    }
  }, [alarm]);

  async function handleSnooze() {
    if (snoozeUsed >= MAX_SNOOZE) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const newCount = snoozeUsed + 1;
    setSnoozeUsed(newCount);
    if (alarm) await saveAlarm({ ...alarm, snoozeCount: newCount });
    if (soundRef.current) await soundRef.current.stopAsync().catch(() => {});
    Vibration.cancel();
    navigation.goBack();
    // TODO: In a production app, schedule a new one-time notification in SNOOZE_MS
  }

  function handleStartChallenge() {
    if (challengeType === 'steps') {
      navigation.replace('StepChallenge', { stopAlarm, alarmId, label });
    } else {
      navigation.replace('QuestionChallenge', { difficulty, stopAlarm, alarmId, label });
    }
  }

  const glowColor = glowAnim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,77,109,0.2)', 'rgba(255,77,109,0.6)'] });

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0005', alignItems: 'center', justifyContent: 'center', padding: 24 },
    glowCircle: {
      position: 'absolute', width: width * 1.1, height: width * 1.1,
      borderRadius: width * 0.55, backgroundColor: 'rgba(255,77,109,0.12)',
    },
    ring: {
      width: 180, height: 180, borderRadius: 90,
      backgroundColor: 'rgba(255,77,109,0.15)',
      borderWidth: 3, borderColor: '#FF4D6D',
      alignItems: 'center', justifyContent: 'center',
      shadowColor: '#FF4D6D', shadowRadius: 30, shadowOpacity: 0.8, shadowOffset: { width: 0, height: 0 },
    },
    bellText: { fontSize: 64 },
    label: {
      fontSize: 22, fontWeight: '700', color: '#FF4D6D',
      marginTop: 24, textAlign: 'center', letterSpacing: 1,
    },
    time: { fontSize: 56, fontWeight: '800', color: '#FFFFFF', marginTop: 8, fontVariant: ['tabular-nums'] },
    subText: { fontSize: 14, color: '#AAAAAA', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' },
    challengeBtn: {
      marginTop: 48,
      backgroundColor: '#FF4D6D',
      borderRadius: 16,
      paddingVertical: 18, paddingHorizontal: 40,
      shadowColor: '#FF4D6D', shadowRadius: 20, shadowOpacity: 0.6, shadowOffset: { width: 0, height: 4 },
      elevation: 8, width: '100%', alignItems: 'center',
    },
    challengeBtnText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
    snoozeBtn: {
      marginTop: 16, paddingVertical: 14, width: '100%', alignItems: 'center',
      borderRadius: 12, borderWidth: 1, borderColor: '#FFFFFF33',
    },
    snoozeBtnText: { fontSize: 16, color: '#AAAAAA', fontWeight: '600' },
    snoozeCount: { fontSize: 11, color: '#666', marginTop: 4 },
  });

  const now = new Date();
  const hour12 = ((now.getHours() % 12) || 12).toString().padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ampm = now.getHours() < 12 ? 'AM' : 'PM';

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0005" />

      <Animated.View style={[s.glowCircle, { opacity: glowAnim }]} />

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <View style={s.ring}>
          <Text style={s.bellText}>⏰</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: textAnim, transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }], alignItems: 'center' }}>
        <Text style={s.label}>{label || 'WAKE UP!'}</Text>
        <Text style={s.time}>{hour12}:{mm} {ampm}</Text>
        <Text style={s.subText}>Time to rise 🔥</Text>
      </Animated.View>

      <View style={{ width: '100%', marginTop: 'auto', paddingBottom: 24 }}>
        <TouchableOpacity style={s.challengeBtn} onPress={handleStartChallenge} activeOpacity={0.85}>
          <Text style={s.challengeBtnText}>
            {challengeType === 'steps' ? '👟 Start Step Challenge' : '🧠 Start Question Challenge'}
          </Text>
        </TouchableOpacity>

        {snoozeUsed < MAX_SNOOZE && (
          <TouchableOpacity style={s.snoozeBtn} onPress={handleSnooze}>
            <Text style={s.snoozeBtnText}>😴 Snooze 5 min</Text>
            <Text style={s.snoozeCount}>{MAX_SNOOZE - snoozeUsed} snooze{MAX_SNOOZE - snoozeUsed !== 1 ? 's' : ''} remaining</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

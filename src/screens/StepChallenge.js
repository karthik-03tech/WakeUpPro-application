// src/screens/StepChallenge.js
// Pedometer-based challenge: walk 10 steps to dismiss the alarm

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, BackHandler, Animated, StatusBar
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { usePedometer } from '../hooks/usePedometer';
import { recordWakeUp } from '../utils/streakTracker';
import * as Haptics from 'expo-haptics';

const TARGET_STEPS = 10;

export default function StepChallenge({ navigation, route }) {
  const theme = useTheme();
  const { stopAlarm, label } = route.params || {};
  const [active, setActive] = useState(true);
  const [done, setDone] = useState(false);
  const { steps, isAvailable } = usePedometer(active);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  // Prevent back
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  // Ring pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(ringAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Animate progress ring
  useEffect(() => {
    const ratio = Math.min(steps / TARGET_STEPS, 1);
    Animated.timing(progressAnim, { toValue: ratio, duration: 200, useNativeDriver: false }).start();
  }, [steps]);

  // Completion
  useEffect(() => {
    if (steps >= TARGET_STEPS && !done) {
      setDone(true);
      setActive(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.spring(checkAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
      setTimeout(async () => {
        if (stopAlarm) await stopAlarm();
        const streak = await recordWakeUp();
        navigation.replace('Motivation', { streak });
      }, 1500);
    }
  }, [steps, done]);

  const displaySteps = Math.min(steps, TARGET_STEPS);
  const progressDeg = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const ringOpacity = ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
    title: { fontSize: theme.typography.sizes.sm, color: theme.colors.subtext, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: theme.spacing.md },
    progressRingOuter: {
      width: 220, height: 220, borderRadius: 110,
      borderWidth: 12, borderColor: theme.colors.border,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    progressRingInner: {
      position: 'absolute', top: -12, left: -12,
      width: 220, height: 220, borderRadius: 110,
      borderWidth: 12, borderColor: 'transparent',
    },
    progressFillArc: {
      width: 220, height: 220, borderRadius: 110,
      position: 'absolute', top: -12, left: -12,
      borderWidth: 12, borderColor: theme.colors.primary,
      borderRightColor: 'transparent', borderBottomColor: 'transparent',
    },
    stepCount: {
      fontSize: theme.typography.sizes.hero,
      fontWeight: theme.typography.weights.heavy,
      color: theme.colors.primary,
      fontVariant: ['tabular-nums'],
    },
    stepTarget: { fontSize: theme.typography.sizes.lg, color: theme.colors.subtext, fontWeight: '600' },
    instruction: {
      fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold,
      color: theme.colors.text, textAlign: 'center', lineHeight: 30, marginBottom: theme.spacing.md,
    },
    sub: { fontSize: theme.typography.sizes.md, color: theme.colors.subtext, textAlign: 'center' },
    unavailable: { fontSize: theme.typography.sizes.md, color: theme.colors.warning, textAlign: 'center', marginTop: theme.spacing.md },
    checkmark: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: theme.colors.success + '33',
      alignItems: 'center', justifyContent: 'center',
      marginTop: theme.spacing.lg,
    },
    checkText: { fontSize: 40 },
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <Text style={s.title}>👟 Step Challenge</Text>

      <Animated.View style={[s.progressRingOuter, { borderColor: done ? theme.colors.success : theme.colors.border, opacity: ringOpacity }]}>
        <Text style={s.stepCount}>{displaySteps}</Text>
        <Text style={s.stepTarget}>/ {TARGET_STEPS}</Text>
      </Animated.View>

      {done ? (
        <Animated.View style={[s.checkmark, { transform: [{ scale: checkAnim }] }]}>
          <Text style={s.checkText}>✅</Text>
        </Animated.View>
      ) : (
        <>
          <Text style={s.instruction}>
            {done ? 'Well done! 🎉' : '🚶 Start Walking!'}
          </Text>
          <Text style={s.sub}>
            Walk {TARGET_STEPS - displaySteps} more step{TARGET_STEPS - displaySteps !== 1 ? 's' : ''} to dismiss the alarm
          </Text>
          {!isAvailable && (
            <Text style={s.unavailable}>
              ⚠️ Pedometer not available on this device.{'\n'}Walk in place or shake the device.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

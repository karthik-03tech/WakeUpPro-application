// src/screens/MotivationScreen.js
// Post-challenge success screen with quote and streak display

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, StatusBar, SafeAreaView
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getRandomQuote } from '../utils/motivationalQuotes';
import { getStreak } from '../utils/streakTracker';

export default function MotivationScreen({ navigation, route }) {
  const theme = useTheme();
  const { streak: passedStreak } = route.params || {};
  const [streak, setStreak] = useState(passedStreak || { count: 1, lastDate: null });

  const slideAnim = useRef(new Animated.Value(60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const quoteSlide = useRef(new Animated.Value(40)).current;
  const quoteOpacity = useRef(new Animated.Value(0)).current;

  const [quote] = useState(() => getRandomQuote());

  useEffect(() => {
    if (!passedStreak) getStreak().then(setStreak);
  }, []);

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(quoteOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(quoteSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
    successCircle: {
      width: 130, height: 130, borderRadius: 65,
      backgroundColor: theme.colors.success + '22',
      borderWidth: 3, borderColor: theme.colors.success,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: theme.colors.success, shadowRadius: 24, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0 },
      marginBottom: theme.spacing.xl,
    },
    successEmoji: { fontSize: 56 },
    title: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.heavy,
      color: theme.colors.text,
      textAlign: 'center', marginBottom: theme.spacing.sm,
    },
    subtitle: { fontSize: theme.typography.sizes.md, color: theme.colors.subtext, textAlign: 'center', marginBottom: theme.spacing.xl },
    quoteCard: {
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1, borderColor: theme.colors.border,
      borderLeftWidth: 4, borderLeftColor: theme.colors.primary,
      width: '100%', marginBottom: theme.spacing.xl,
    },
    quoteText: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      fontStyle: 'italic', lineHeight: 26,
    },
    quoteAuthor: {
      fontSize: theme.typography.sizes.sm, color: theme.colors.subtext,
      marginTop: theme.spacing.sm, fontWeight: '600',
    },
    streakCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: theme.colors.secondary + '22',
      borderRadius: theme.radius.md, padding: theme.spacing.md,
      borderWidth: 1, borderColor: theme.colors.secondary + '55',
      width: '100%', marginBottom: theme.spacing.xl,
    },
    streakEmoji: { fontSize: 32, marginRight: theme.spacing.md },
    streakText: { fontSize: theme.typography.sizes.md, color: theme.colors.text, fontWeight: theme.typography.weights.bold },
    streakSub: { fontSize: theme.typography.sizes.sm, color: theme.colors.subtext },
    startBtn: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.lg, padding: theme.spacing.md,
      alignItems: 'center', width: '100%',
      shadowColor: theme.colors.primary, shadowRadius: 16, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
    startBtnText: { fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.heavy, color: theme.colors.background },
  });

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <View style={s.content}>
        <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }], alignItems: 'center', width: '100%' }}>
          <View style={s.successCircle}>
            <Text style={s.successEmoji}>🎉</Text>
          </View>
          <Text style={s.title}>You're Awake!</Text>
          <Text style={s.subtitle}>Challenge completed. Great job! 💪</Text>

          <View style={s.streakCard}>
            <Text style={s.streakEmoji}>🔥</Text>
            <View>
              <Text style={s.streakText}>{streak.count}-Day Streak!</Text>
              <Text style={s.streakSub}>{streak.count === 1 ? 'First day — keep it going!' : `${streak.count} days in a row!`}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: quoteOpacity, transform: [{ translateY: quoteSlide }], width: '100%' }}>
          <View style={s.quoteCard}>
            <Text style={s.quoteText}>"{quote.quote}"</Text>
            <Text style={s.quoteAuthor}>— {quote.author}</Text>
          </View>

          <TouchableOpacity style={s.startBtn} onPress={() => navigation.navigate('Tabs')} activeOpacity={0.85}>
            <Text style={s.startBtnText}>🌅  Start Your Day</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// src/screens/QuestionChallenge.js
// Math/logic multiple-choice challenge that must be completed to dismiss alarm

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, BackHandler, StatusBar
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { generateQuestions } from '../utils/questionGenerator';
import { recordWakeUp } from '../utils/streakTracker';
import * as Haptics from 'expo-haptics';

export default function QuestionChallenge({ navigation, route }) {
  const theme = useTheme();
  const { difficulty = 'medium', stopAlarm, alarmId, label } = route.params || {};

  const [questions] = useState(() => generateQuestions(difficulty, 4));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Prevent back
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  // Animate question in
  useEffect(() => {
    slideAnim.setValue(40);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [current]);

  // Progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: current / questions.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [current]);

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  async function handleAnswer(option) {
    setSelected(option);
    const q = questions[current];
    if (option === q.answer) {
      setWrong(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(async () => {
        if (current + 1 >= questions.length) {
          // All done!
          if (stopAlarm) await stopAlarm();
          const streak = await recordWakeUp();
          navigation.replace('Motivation', { streak });
        } else {
          setCurrent((c) => c + 1);
          setSelected(null);
        }
      }, 400);
    } else {
      setWrong(true);
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => {
        setSelected(null);
        setWrong(false);
      }, 800);
    }
  }

  const q = questions[current];
  const progressWidth = progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg },
    progressBar: { height: 5, backgroundColor: theme.colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: theme.spacing.xl },
    progressFill: { height: '100%', backgroundColor: theme.colors.primary, borderRadius: 3 },
    header: { marginBottom: theme.spacing.xl },
    headerLabel: { fontSize: theme.typography.sizes.sm, color: theme.colors.subtext, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    progress: { fontSize: theme.typography.sizes.lg, fontWeight: '800', color: theme.colors.primary, marginTop: 4 },
    questionCard: {
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radius.lg, padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl, minHeight: 160,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: theme.colors.border,
    },
    questionText: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.heavy,
      color: theme.colors.text,
      textAlign: 'center', lineHeight: 34,
    },
    optionBtn: {
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      alignItems: 'center',
      borderWidth: 1.5,
    },
    optionText: { fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold },
    tip: { fontSize: theme.typography.sizes.sm, color: theme.colors.subtext, textAlign: 'center', marginTop: theme.spacing.md },
  });

  function getOptionStyle(opt) {
    if (!selected) return { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border };
    if (opt === q.answer) return { backgroundColor: theme.colors.success + '33', borderColor: theme.colors.success };
    if (opt === selected && opt !== q.answer) return { backgroundColor: theme.colors.danger + '33', borderColor: theme.colors.danger };
    return { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border };
  }

  function getOptionTextColor(opt) {
    if (!selected) return theme.colors.text;
    if (opt === q.answer) return theme.colors.success;
    if (opt === selected && opt !== q.answer) return theme.colors.danger;
    return theme.colors.subtext;
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <View style={s.progressBar}>
        <Animated.View style={[s.progressFill, { width: progressWidth }]} />
      </View>

      <View style={s.header}>
        <Text style={s.headerLabel}>🧠 Question Challenge</Text>
        <Text style={s.progress}>
          {current + 1} / {questions.length}   Difficulty: {difficulty.toUpperCase()}
        </Text>
      </View>

      <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: slideAnim }, { translateX: shakeAnim }] }}>
        <View style={s.questionCard}>
          <Text style={s.questionText}>{q.question}</Text>
        </View>

        {q.options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[s.optionBtn, getOptionStyle(opt)]}
            onPress={() => !selected && handleAnswer(opt)}
            activeOpacity={0.85}
            disabled={!!selected}
          >
            <Text style={[s.optionText, { color: getOptionTextColor(opt) }]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <Text style={s.tip}>Answer all {questions.length} questions correctly to dismiss the alarm</Text>
    </View>
  );
}

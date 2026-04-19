// src/components/AlarmCard.js
// Displays a single alarm with label, time, days, toggle, and delete

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Animated, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { DAY_NAMES } from '../utils/alarmScheduler';

const SHORT_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function AlarmCard({ alarm, onToggle, onDelete, onEdit }) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const [hh, mm] = alarm.time.split(':');
  const hour12 = ((+hh % 12) || 12).toString().padStart(2, '0');
  const ampm = +hh < 12 ? 'AM' : 'PM';

  const s = StyleSheet.create({
    card: {
      backgroundColor: alarm.enabled ? theme.colors.alarmActive : theme.colors.alarmInactive,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: alarm.enabled ? theme.colors.primary + '55' : theme.colors.border,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    timeRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    timeText: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.heavy,
      color: alarm.enabled ? theme.colors.text : theme.colors.subtext,
      fontVariant: ['tabular-nums'],
    },
    ampm: { fontSize: theme.typography.sizes.md, color: theme.colors.subtext, fontWeight: '600' },
    label: { fontSize: theme.typography.sizes.md, color: theme.colors.subtext, marginTop: 2 },
    daysRow: { flexDirection: 'row', gap: 4, marginTop: theme.spacing.sm },
    dayChip: {
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: theme.radius.sm,
    },
    dayText: { fontSize: theme.typography.sizes.xs, fontWeight: '700' },
    deleteBtn: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
    },
    deleteText: { fontSize: 20 },
    challengeBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.secondary + '30',
      borderRadius: theme.radius.full,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginTop: theme.spacing.xs,
    },
    challengeText: { fontSize: theme.typography.sizes.xs, color: theme.colors.secondary, fontWeight: '600' },
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onEdit}
      >
        <View style={s.card}>
          <View style={s.row}>
            <View>
              <View style={s.timeRow}>
                <Text style={s.timeText}>{hour12}:{mm}</Text>
                <Text style={s.ampm}>{ampm}</Text>
              </View>
              {alarm.label ? <Text style={s.label}>{alarm.label}</Text> : null}
              <View style={s.challengeBadge}>
                <Text style={s.challengeText}>
                  {alarm.challengeType === 'question' ? '🧠 Question' : '👟 Steps'} · {alarm.difficulty}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Switch
                value={alarm.enabled}
                onValueChange={onToggle}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary + '88' }}
                thumbColor={alarm.enabled ? theme.colors.primary : theme.colors.subtext}
              />
              <TouchableOpacity onPress={onDelete} style={s.deleteBtn}>
                <Text style={s.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {alarm.days && alarm.days.length > 0 && (
            <View style={s.daysRow}>
              {SHORT_DAYS.map((day, i) => {
                const active = alarm.days.includes(i);
                return (
                  <View
                    key={i}
                    style={[s.dayChip, { backgroundColor: active ? theme.colors.primary + '33' : theme.colors.border + '44' }]}
                  >
                    <Text style={[s.dayText, { color: active ? theme.colors.primary : theme.colors.subtext }]}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

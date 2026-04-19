// src/screens/AlarmFormScreen.js
// Create or edit an alarm: time picker, days, label, challenge type, difficulty

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, Alert, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../hooks/useTheme';
import { saveAlarm, generateId } from '../utils/alarmStorage';
import { scheduleAlarm, cancelAlarm } from '../utils/alarmScheduler';

const SHORT_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function AlarmFormScreen({ navigation, route }) {
  const theme = useTheme();
  const existing = route.params?.alarm;

  const parseTime = (t) => {
    if (!t) return new Date();
    const [h, m] = t.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0); return d;
  };

  const [time, setTime] = useState(parseTime(existing?.time));
  const [showPicker, setShowPicker] = useState(false);
  const [label, setLabel] = useState(existing?.label || '');
  const [days, setDays] = useState(existing?.days || []);
  const [challengeType, setChallengeType] = useState(existing?.challengeType || 'question');
  const [difficulty, setDifficulty] = useState(existing?.difficulty || 'medium');
  const [saving, setSaving] = useState(false);

  const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  function toggleDay(idx) {
    setDays((prev) => prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx].sort());
  }

  async function handleSave() {
    setSaving(true);
    try {
      const alarm = {
        id: existing?.id || generateId(),
        label,
        time: timeStr,
        days,
        enabled: true,
        challengeType,
        difficulty,
        notificationIds: [],
      };

      // Cancel old notifications if editing
      if (existing?.notificationIds?.length) {
        await cancelAlarm(existing.notificationIds);
      }

      const ids = await scheduleAlarm(alarm);
      alarm.notificationIds = ids;
      await saveAlarm(alarm);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not save alarm');
    }
    setSaving(false);
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
    },
    headerBtn: { padding: theme.spacing.sm },
    headerBtnText: { fontSize: theme.typography.sizes.md, color: theme.colors.primary, fontWeight: theme.typography.weights.semibold },
    headerTitle: { fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, color: theme.colors.text },
    scroll: { padding: theme.spacing.md },
    section: { marginBottom: theme.spacing.xl },
    sectionTitle: { fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.bold, color: theme.colors.subtext, marginBottom: theme.spacing.sm, letterSpacing: 1, textTransform: 'uppercase' },
    timeDisplay: {
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      borderWidth: 1, borderColor: theme.colors.border,
    },
    timeText: { fontSize: theme.typography.sizes.hero, fontWeight: theme.typography.weights.heavy, color: theme.colors.primary, fontVariant: ['tabular-nums'] },
    daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dayBtn: {
      width: 42, height: 42, borderRadius: 21,
      alignItems: 'center', justifyContent: 'center', borderWidth: 1,
    },
    dayBtnText: { fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.bold },
    input: {
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.text,
      borderWidth: 1, borderColor: theme.colors.border,
    },
    optionRow: { flexDirection: 'row', gap: theme.spacing.sm },
    optionBtn: {
      flex: 1, padding: theme.spacing.md, borderRadius: theme.radius.md,
      alignItems: 'center', borderWidth: 1.5,
    },
    optionBtnText: { fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.bold },
    saveBtn: {
      backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg,
      padding: theme.spacing.md, alignItems: 'center', marginTop: theme.spacing.sm,
    },
    saveBtnText: { fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold, color: theme.colors.background },
  });

  const hour12 = ((time.getHours() % 12) || 12).toString().padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');
  const ampm = time.getHours() < 12 ? 'AM' : 'PM';

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={s.headerBtnText}>✕ Cancel</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{existing ? 'Edit Alarm' : 'New Alarm'}</Text>
        <TouchableOpacity style={s.headerBtn} onPress={handleSave} disabled={saving}>
          <Text style={s.headerBtnText}>{saving ? '...' : '✓ Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* TIME */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Alarm Time</Text>
          <TouchableOpacity style={s.timeDisplay} onPress={() => setShowPicker(true)} activeOpacity={0.7}>
            <Text style={s.timeText}>{hour12}:{mm} {ampm}</Text>
            <Text style={{ color: theme.colors.subtext, fontSize: theme.typography.sizes.sm, marginTop: 4 }}>Tap to change</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={false}
              onChange={(_, selected) => {
                setShowPicker(Platform.OS === 'ios');
                if (selected) setTime(selected);
              }}
              themeVariant={theme.mode}
            />
          )}
        </View>

        {/* REPEAT DAYS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Repeat</Text>
          <View style={s.daysRow}>
            {SHORT_DAYS.map((d, i) => {
              const active = days.includes(i);
              return (
                <TouchableOpacity
                  key={i}
                  style={[s.dayBtn, {
                    backgroundColor: active ? theme.colors.primary + '33' : theme.colors.surfaceElevated,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  }]}
                  onPress={() => toggleDay(i)}
                >
                  <Text style={[s.dayBtnText, { color: active ? theme.colors.primary : theme.colors.subtext }]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={{ color: theme.colors.subtext, fontSize: theme.typography.sizes.xs, marginTop: 6 }}>
            {days.length === 0 ? 'One-time alarm' : 'Repeats on selected days'}
          </Text>
        </View>

        {/* LABEL */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Label</Text>
          <TextInput
            style={s.input}
            value={label}
            onChangeText={setLabel}
            placeholder="e.g. Morning workout"
            placeholderTextColor={theme.colors.subtext}
            maxLength={40}
          />
        </View>

        {/* CHALLENGE TYPE */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Challenge Type</Text>
          <View style={s.optionRow}>
            {[{ id: 'question', label: '🧠 Questions' }, { id: 'steps', label: '👟 Steps' }].map(opt => {
              const active = challengeType === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.optionBtn, {
                    backgroundColor: active ? theme.colors.primary + '22' : theme.colors.surfaceElevated,
                    borderColor: active ? theme.colors.primary : theme.colors.border,
                  }]}
                  onPress={() => setChallengeType(opt.id)}
                >
                  <Text style={[s.optionBtnText, { color: active ? theme.colors.primary : theme.colors.subtext }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* DIFFICULTY */}
        {challengeType === 'question' && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Difficulty</Text>
            <View style={s.optionRow}>
              {['easy', 'medium', 'hard'].map(d => {
                const active = difficulty === d;
                const colors = { easy: theme.colors.success, medium: theme.colors.warning, hard: theme.colors.danger };
                return (
                  <TouchableOpacity
                    key={d}
                    style={[s.optionBtn, {
                      backgroundColor: active ? colors[d] + '22' : theme.colors.surfaceElevated,
                      borderColor: active ? colors[d] : theme.colors.border,
                    }]}
                    onPress={() => setDifficulty(d)}
                  >
                    <Text style={[s.optionBtnText, { color: active ? colors[d] : theme.colors.subtext, textTransform: 'capitalize' }]}>{d}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
          <Text style={s.saveBtnText}>{saving ? 'Saving…' : '✓  Save Alarm'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

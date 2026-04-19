// src/screens/HomeScreen.js
// Main screen listing all alarms with FAB to add new

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  StatusBar, Animated, SafeAreaView, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import AlarmCard from '../components/AlarmCard';
import { getAlarms, deleteAlarm, updateAlarmEnabled, saveAlarm } from '../utils/alarmStorage';
import { scheduleAlarm, cancelAlarm } from '../utils/alarmScheduler';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const [alarms, setAlarms] = useState([]);
  const fabAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      loadAlarms();
    }, [])
  );

  useEffect(() => {
    Animated.spring(fabAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  }, []);

  async function loadAlarms() {
    const list = await getAlarms();
    setAlarms(list.sort((a, b) => a.time.localeCompare(b.time)));
  }

  async function handleToggle(alarm) {
    const updated = await updateAlarmEnabled(alarm.id, !alarm.enabled);
    if (!updated) return;
    if (updated.enabled) {
      const ids = await scheduleAlarm(updated);
      updated.notificationIds = ids;
      await saveAlarm(updated);
    } else {
      await cancelAlarm(updated.notificationIds || []);
      updated.notificationIds = [];
      await saveAlarm(updated);
    }
    loadAlarms();
  }

  async function handleDelete(alarm) {
    Alert.alert('Delete Alarm', `Delete "${alarm.label || alarm.time}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await cancelAlarm(alarm.notificationIds || []);
          await deleteAlarm(alarm.id);
          loadAlarms();
        },
      },
    ]);
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.heavy,
      color: theme.colors.text,
    },
    headerSub: { fontSize: theme.typography.sizes.sm, color: theme.colors.subtext, marginTop: 2 },
    list: { padding: theme.spacing.md },
    empty: { alignItems: 'center', marginTop: 80 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: theme.colors.subtext },
    emptySubtitle: { fontSize: theme.typography.sizes.md, color: theme.colors.subtext, marginTop: 8, textAlign: 'center' },
    fab: {
      position: 'absolute', right: 24, bottom: 24,
      width: 60, height: 60, borderRadius: 30,
      backgroundColor: theme.colors.primary,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12,
      elevation: 8,
    },
    fabText: { fontSize: 28, color: theme.colors.background, fontWeight: theme.typography.weights.heavy },
  });

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />

      <View style={s.header}>
        <Text style={s.headerTitle}>⏰ WakeUp Pro</Text>
        <Text style={s.headerSub}>{alarms.filter(a => a.enabled).length} alarm{alarms.filter(a => a.enabled).length !== 1 ? 's' : ''} active</Text>
      </View>

      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <AlarmCard
            alarm={item}
            onToggle={() => handleToggle(item)}
            onDelete={() => handleDelete(item)}
            onEdit={() => navigation.navigate('AlarmForm', { alarm: item })}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🌙</Text>
            <Text style={s.emptyTitle}>No alarms set</Text>
            <Text style={s.emptySubtitle}>Tap + to create your{'\n'}first smart alarm</Text>
          </View>
        }
      />

      <Animated.View style={[s.fab, { transform: [{ scale: fabAnim }] }]}>
        <TouchableOpacity onPress={() => navigation.navigate('AlarmForm', {})} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={s.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

// src/screens/SettingsScreen.js
// Theme toggle, default preferences display

import React from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Linking, Alert
} from 'react-native';
import { useTheme, useThemeToggle } from '../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const theme = useTheme();
  const toggleTheme = useThemeToggle();

  async function handleClearStreak() {
    Alert.alert('Reset Streak', 'Are you sure you want to reset your wake-up streak?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem('@wakeup_streak');
          Alert.alert('Done', 'Streak has been reset.');
        },
      },
    ]);
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    headerTitle: { fontSize: theme.typography.sizes.xxl, fontWeight: theme.typography.weights.heavy, color: theme.colors.text },
    scroll: { padding: theme.spacing.md },
    section: { marginBottom: theme.spacing.xl },
    sectionTitle: { fontSize: theme.typography.sizes.xs, fontWeight: '800', color: theme.colors.subtext, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: theme.spacing.sm },
    card: {
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radius.lg, overflow: 'hidden',
      borderWidth: 1, borderColor: theme.colors.border,
    },
    row: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
    },
    rowLast: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: theme.spacing.md,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    rowIcon: { fontSize: 22, width: 32, textAlign: 'center' },
    rowTitle: { fontSize: theme.typography.sizes.md, color: theme.colors.text, fontWeight: theme.typography.weights.semibold },
    rowSub: { fontSize: theme.typography.sizes.xs, color: theme.colors.subtext, marginTop: 2 },
    dangerBtn: {
      backgroundColor: theme.colors.danger + '22',
      borderWidth: 1, borderColor: theme.colors.danger + '55',
      borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center',
    },
    dangerBtnText: { color: theme.colors.danger, fontWeight: theme.typography.weights.bold, fontSize: theme.typography.sizes.md },
    versionText: { textAlign: 'center', color: theme.colors.subtext, fontSize: theme.typography.sizes.xs, marginTop: theme.spacing.lg },
  });

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <View style={s.header}>
        <Text style={s.headerTitle}>⚙️ Settings</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* APPEARANCE */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Appearance</Text>
          <View style={s.card}>
            <View style={s.rowLast}>
              <View style={s.rowLeft}>
                <Text style={s.rowIcon}>{theme.mode === 'dark' ? '🌙' : '☀️'}</Text>
                <View>
                  <Text style={s.rowTitle}>Dark Mode</Text>
                  <Text style={s.rowSub}>{theme.mode === 'dark' ? 'Currently on' : 'Currently off'}</Text>
                </View>
              </View>
              <Switch
                value={theme.mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary + '88' }}
                thumbColor={theme.mode === 'dark' ? theme.colors.primary : theme.colors.subtext}
              />
            </View>
          </View>
        </View>

        {/* CHALLENGE INFO */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Challenge Info</Text>
          <View style={s.card}>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <Text style={s.rowIcon}>🧠</Text>
                <View>
                  <Text style={s.rowTitle}>Question Challenge</Text>
                  <Text style={s.rowSub}>4 math / logic questions</Text>
                </View>
              </View>
            </View>
            <View style={s.row}>
              <View style={s.rowLeft}>
                <Text style={s.rowIcon}>👟</Text>
                <View>
                  <Text style={s.rowTitle}>Step Challenge</Text>
                  <Text style={s.rowSub}>Walk 10 steps using pedometer</Text>
                </View>
              </View>
            </View>
            <View style={s.rowLast}>
              <View style={s.rowLeft}>
                <Text style={s.rowIcon}>😴</Text>
                <View>
                  <Text style={s.rowTitle}>Snooze</Text>
                  <Text style={s.rowSub}>Up to 2 snoozes, 5 min each</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* DATA */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Data</Text>
          <TouchableOpacity style={s.dangerBtn} onPress={handleClearStreak}>
            <Text style={s.dangerBtnText}>🗑️  Reset Wake-Up Streak</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.versionText}>WakeUp Pro v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

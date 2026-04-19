// src/navigation/AppNavigator.js
// Root navigator: Bottom tabs (Home, Settings) + Stack for alarm flow

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

import HomeScreen from '../screens/HomeScreen';
import AlarmFormScreen from '../screens/AlarmFormScreen';
import RingingScreen from '../screens/RingingScreen';
import QuestionChallenge from '../screens/QuestionChallenge';
import StepChallenge from '../screens/StepChallenge';
import MotivationScreen from '../screens/MotivationScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ name, focused, color }) {
  const icons = { Home: '⏰', Settings: '⚙️' };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[name]}</Text>
    </View>
  );
}

function HomeTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subtext,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Alarms' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name="Tabs" component={HomeTabs} />
      <Stack.Screen name="AlarmForm" component={AlarmFormScreen} />
      <Stack.Screen name="Ringing" component={RingingScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="QuestionChallenge" component={QuestionChallenge} options={{ gestureEnabled: false }} />
      <Stack.Screen name="StepChallenge" component={StepChallenge} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Motivation" component={MotivationScreen} />
    </Stack.Navigator>
  );
}

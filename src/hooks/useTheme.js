// src/hooks/useTheme.js
// Provides theme context to the whole app

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../theme';

const ThemeContext = createContext(darkTheme);
const ThemeToggleContext = createContext(() => {});

const THEME_KEY = '@wakeup_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === 'light') setTheme(lightTheme);
    });
  }, []);

  const toggleTheme = async () => {
    const next = theme.mode === 'dark' ? lightTheme : darkTheme;
    setTheme(next);
    await AsyncStorage.setItem(THEME_KEY, next.mode);
  };

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeToggleContext.Provider value={toggleTheme}>
        {children}
      </ThemeToggleContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}

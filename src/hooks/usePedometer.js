// src/hooks/usePedometer.js
// Wraps Expo Pedometer to count steps from a starting point

import { useState, useEffect, useRef } from 'react';
import { Pedometer } from 'expo-sensors';

/**
 * @param {boolean} active - Start counting only when true
 * @returns {{ steps: number, isAvailable: boolean }}
 */
export function usePedometer(active) {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const subscriptionRef = useRef(null);
  const baseStepsRef = useRef(null);

  useEffect(() => {
    Pedometer.isAvailableAsync().then(setIsAvailable);
  }, []);

  useEffect(() => {
    if (!active || !isAvailable) return;

    // Reset on activation
    setSteps(0);
    baseStepsRef.current = null;

    subscriptionRef.current = Pedometer.watchStepCount((result) => {
      if (baseStepsRef.current === null) {
        baseStepsRef.current = result.steps;
      }
      setSteps(result.steps - baseStepsRef.current);
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, [active, isAvailable]);

  return { steps, isAvailable };
}

/**
 * React Infinite Update Protection Utility
 *
 * This utility helps prevent React infinite update loops by:
 * 1. Throttling state updates
 * 2. Detecting rapid consecutive updates
 * 3. Providing protected versions of useState and useEffect
 */

import {
  useState as useReactState,
  useEffect as useReactEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';

// Global update tracking to detect potential infinite loops
const updateTracker = new Map<
  string,
  {
    count: number;
    timestamp: number;
    lastValues: any[];
  }
>();

// Configuration
const UPDATE_THRESHOLD = 25; // Number of updates before warning
const UPDATE_WINDOW_MS = 1000; // Time window to count updates (1 second)
const THROTTLE_MS = 50; // Minimum time between updates

/**
 * Safe version of useState that prevents rapid consecutive updates
 */
export function useSafeState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useReactState<T>(initialState);
  const updateIdRef = useRef(`state-${Math.random().toString(36).slice(2, 9)}`);
  const lastUpdateRef = useRef(0);
  const updateScheduledRef = useRef(false);

  // Create a safe setState function that throttles updates
  const setSafeState: Dispatch<SetStateAction<T>> = value => {
    if (updateScheduledRef.current) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    // Track update frequency for this component
    const updateId = updateIdRef.current;
    if (!updateTracker.has(updateId)) {
      updateTracker.set(updateId, { count: 0, timestamp: now, lastValues: [] });
    }

    const tracker = updateTracker.get(updateId)!;
    tracker.count++;
    tracker.lastValues.push(typeof value === 'function' ? '(function)' : value);

    // Keep only the last 5 values
    if (tracker.lastValues.length > 5) {
      tracker.lastValues.shift();
    }

    // Reset counter if outside the window
    if (now - tracker.timestamp > UPDATE_WINDOW_MS) {
      tracker.count = 1;
      tracker.timestamp = now;
    }

    // Detect potential infinite loop
    if (tracker.count > UPDATE_THRESHOLD) {
      console.warn(
        `[INFINITE UPDATE PROTECTION] Component is updating state too frequently (${tracker.count} updates in ${UPDATE_WINDOW_MS}ms)`,
        'Recent values:',
        tracker.lastValues
      );

      // Reset to prevent console spam
      tracker.count = 0;
      tracker.timestamp = now;
      return;
    }

    // Throttle updates
    if (timeSinceLastUpdate < THROTTLE_MS) {
      updateScheduledRef.current = true;
      setTimeout(() => {
        lastUpdateRef.current = Date.now();
        updateScheduledRef.current = false;
        setState(value);
      }, THROTTLE_MS - timeSinceLastUpdate);
      return;
    }

    // Normal update
    lastUpdateRef.current = now;
    setState(value);
  };

  return [state, setSafeState];
}

/**
 * Safe version of useEffect that prevents potential infinite loops
 */
export function useSafeEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  const effectIdRef = useRef(`effect-${Math.random().toString(36).slice(2, 9)}`);
  const runCountRef = useRef(0);
  const lastRunRef = useRef(0);

  // If no deps array is provided, create an empty one to avoid infinite loops
  const safeDeps = deps || [];

  useReactEffect(() => {
    const now = Date.now();
    runCountRef.current++;

    // Track effect runs for this component
    const effectId = effectIdRef.current;
    if (!updateTracker.has(effectId)) {
      updateTracker.set(effectId, { count: 0, timestamp: now, lastValues: [] });
    }

    const tracker = updateTracker.get(effectId)!;
    tracker.count++;

    // Reset counter if outside the window
    if (now - tracker.timestamp > UPDATE_WINDOW_MS) {
      tracker.count = 1;
      tracker.timestamp = now;
    }

    // Check if effect is running too frequently (potential infinite loop)
    if (tracker.count > UPDATE_THRESHOLD) {
      console.warn(
        `[INFINITE UPDATE PROTECTION] Effect is running too frequently (${tracker.count} runs in ${UPDATE_WINDOW_MS}ms)`,
        'Dependencies:',
        deps
      );

      // Reset to prevent console spam
      tracker.count = 0;
      tracker.timestamp = now;

      // Skip running the effect function when protecting against infinite loops
      return;
    }

    // Regular effect execution
    lastRunRef.current = now;
    return effect();
  }, safeDeps);
}

/**
 * Creates a throttled function that limits the rate of execution
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = THROTTLE_MS
): (...args: Parameters<T>) => void {
  const lastCallTimeRef = useRef(0);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;

    // Clear any pending timeout
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    if (timeSinceLastCall >= delay) {
      // Enough time has passed, call immediately
      lastCallTimeRef.current = now;
      callbackRef.current(...args);
    } else {
      // Schedule for later
      timeoutIdRef.current = setTimeout(() => {
        lastCallTimeRef.current = Date.now();
        timeoutIdRef.current = null;
        callbackRef.current(...args);
      }, delay - timeSinceLastCall);
    }
  };
}

const InfiniteUpdateProtection = {
  useSafeState,
  useSafeEffect,
  useThrottledCallback,
};

export default InfiniteUpdateProtection;

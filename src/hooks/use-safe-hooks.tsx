import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useSafeState,
  useSafeEffect,
  useThrottledCallback,
} from '@/lib/react-infinite-update-protection';

/**
 * Drop-in replacements for React hooks that won't cause infinite update loops
 *
 * These hooks are safer to use in places where you're getting "Maximum update depth exceeded" errors
 */

// Export both the protection utility functions and the React hooks
export { useSafeState, useSafeEffect, useThrottledCallback };

/**
 * Safe version of useMemo that always memoizes the value
 * even if you forget the dependency array
 */
export function useSafeMemo<T>(factory: () => T, deps?: React.DependencyList): T {
  // If no deps are provided, use an empty array to prevent recalculation
  return useMemo(factory, deps || []);
}

/**
 * Safe version of useCallback that always memoizes the callback
 * even if you forget the dependency array
 */
export function useSafeCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps?: React.DependencyList
): T {
  // If no deps are provided, use an empty array to prevent recreation
  return useCallback(callback, deps || []) as T;
}

/**
 * Creates a state with built-in debounce to prevent rapid updates
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300
): [T, (value: T | ((prev: T) => T)) => void, T] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(immediateValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [immediateValue, delay]);

  return [debouncedValue, setImmediateValue, immediateValue];
}

/**
 * Creates a throttled state that limits update frequency
 */
export function useThrottledState<T>(
  initialValue: T,
  delay: number = 100
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const throttledSetState = useThrottledCallback((value: T | ((prev: T) => T)) => {
    setState(value);
  }, delay);

  return [state, throttledSetState];
}

/**
 * For when you need to get the previous value of a state or prop
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Main export
const SafeHooks = {
  useSafeState,
  useSafeEffect,
  useSafeMemo,
  useSafeCallback,
  useThrottledCallback,
  useDebouncedState,
  useThrottledState,
  usePrevious,
};

export default SafeHooks;

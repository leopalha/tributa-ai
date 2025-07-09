import React, { useRef, useCallback, useState, useLayoutEffect } from 'react';

/**
 * SafeRefWrapper prevents infinite loops with Radix UI components
 * by providing a stable ref that won't change on re-renders.
 *
 * Use this component when you encounter "Maximum update depth exceeded" errors
 * with Radix UI components like Popover, Dialog, etc.
 */
export function SafeRefWrapper<T extends HTMLElement>({
  children,
}: {
  children: React.ReactElement;
}) {
  // Create a stable ref that won't change across renders
  const internalRef = useRef<T | null>(null);

  // Create a flag to track if we're in the middle of an update
  const isUpdating = useRef(false);
  const lastUpdateTime = useRef(0);

  // Create a stable callback that won't trigger re-renders
  const handleRef = useCallback((node: T | null) => {
    // Only update the ref if it's a different node and we're not already updating
    if (node !== internalRef.current && !isUpdating.current) {
      // Throttle updates to prevent multiple updates in quick succession
      const now = Date.now();
      if (now - lastUpdateTime.current < 50) return; // 50ms throttle

      isUpdating.current = true;
      lastUpdateTime.current = now;

      // Break the call stack with setTimeout
      setTimeout(() => {
        internalRef.current = node;
        isUpdating.current = false;
      }, 0);
    }
  }, []);

  // Using a childrenWithProps approach is safer than direct cloneElement
  if (!React.isValidElement(children)) {
    return children;
  }

  // Only add ref if the child is a DOM element or a forwardRef component
  const childType = children.type;
  const canForwardRef =
    typeof children.type !== 'string' &&
    (typeof childType === 'function' || (childType && 'render' in childType));

  if (!canForwardRef) {
    return children;
  }

  return React.cloneElement(children, { ref: handleRef });
}

/**
 * useSafeRef creates a ref that won't cause infinite loops in Radix UI components
 * by preventing too many consecutive updates.
 */
export function useSafeRef<T>() {
  const internalRef = useRef<T | null>(null);
  const isUpdating = useRef(false);
  const lastUpdateTime = useRef(0);

  const setRef = useCallback((node: T | null) => {
    // Only update if not the same node and not currently updating
    if (node !== internalRef.current && !isUpdating.current) {
      // Throttle updates to prevent multiple updates in quick succession
      const now = Date.now();
      if (now - lastUpdateTime.current < 50) return; // 50ms throttle

      isUpdating.current = true;
      lastUpdateTime.current = now;

      // Break the call stack with setTimeout
      setTimeout(() => {
        internalRef.current = node;
        isUpdating.current = false;
      }, 0);
    }
  }, []);

  return [setRef, internalRef] as const;
}

/**
 * Create a completely safe version of a component that forwards refs.
 * This uses a more aggressive approach to prevent infinite update loops with Radix UI.
 */
export function createSafeComponent<P extends object, R = any>(
  Component: React.ComponentType<P & { ref?: React.Ref<R> }>
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>> {
  const SafeComponent = React.forwardRef<R, Omit<P, 'ref'>>((props, forwardedRef) => {
    // Use a stable ref handler that won't trigger re-renders
    const [safeRef, stableRef] = useSafeRef<R>();

    // Synchronize refs in a safer way
    useLayoutEffect(() => {
      if (forwardedRef && stableRef.current) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(stableRef.current);
        } else {
          try {
            (forwardedRef as React.MutableRefObject<R>).current = stableRef.current;
          } catch (e) {
            // Ignore ref setting errors
            console.warn('Failed to set forwarded ref', e);
          }
        }
      }

      return () => {
        if (typeof forwardedRef === 'function') {
          forwardedRef(null);
        }
      };
    }, [forwardedRef, stableRef.current]);

    // Create safe props and avoid setting ref twice
    const safeProps = {
      ...(props as any),
      ref: safeRef,
    };

    return <Component {...safeProps} />;
  });

  SafeComponent.displayName = `Safe(${Component.displayName || 'Component'})`;
  return SafeComponent;
}

/**
 * Legacy HOC for compatibility with existing code
 */
export function withSafeRef<P extends object, R = any>(
  Component: React.ComponentType<P & { ref?: React.Ref<R> }>
) {
  return createSafeComponent<P, R>(Component);
}
